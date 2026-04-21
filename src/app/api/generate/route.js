/*ENDPOINT que procesa la imagen por IA*/
import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';


const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });

export async function POST(req) {
    // Aqui se comprueba si el usuario tiene los creditos suficientes o ya ha superado el limite
    const user = await getSession();
    if (!user) {
        return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const weeklyLimit = parseInt(process.env.AI_WEEKLY_LIMIT) || 5;
    const now = new Date();

    // Leemos el estado actual de créditos
    const [rows] = await db.query(
        'SELECT ai_credits_used, ai_credits_reset_at FROM users WHERE user_id = ?',
        [user.userId]
    );
    const userData = rows[0];

    // Revisamos si hay que resetear el ciclo semanal
    const resetAt = userData.ai_credits_reset_at ? new Date(userData.ai_credits_reset_at) : null;
    const oneWeekMs = 7 * 24 * 60 * 60 * 1000;

    if (!resetAt || (now - resetAt) >= oneWeekMs) {
        await db.query(
            'UPDATE users SET ai_credits_used = 0, ai_credits_reset_at = ? WHERE user_id = ?',
            [now, user.userId]
        );
        userData.ai_credits_used = 0;
    }

    // Bloqueamos si no le quedan créditos
    if (userData.ai_credits_used >= weeklyLimit) {
        return NextResponse.json({ error: 'Weekly limit reached', success: false }, { status: 429 });
    }
    const data = await req.formData();
    const file = data.get("image");
    const userPrompt = data.get("prompt");

    if (!file) {
        return NextResponse.json({ success: false, error: "No image provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Image = buffer.toString("base64");

    const prompt = `
    Vector-style tufting pattern blueprint of the input image.
  
    CRITICAL REQUIREMENTS:
    - NO GRADIENTS OR SHADOWS: Transition between colors must be instantaneous and hard-edged.
    - PALETTE: Max 8-10 flat, solid colors. Every pixel must belong to one of these zones.
    - LINES: Thick, clean, defined black outlines separating every color zone.
    - ESTHETIC: Clean vector illustration / blueprint look. Smooth, simplified edges for easier tufting.
  
    User influence: ${userPrompt || "minimalist, street art style"}
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-image",
            contents: [
                {
                    parts: [
                        { text: prompt },
                        {
                            inlineData: {
                                mimeType: file.type,
                                data: base64Image,
                            },
                        },
                    ],
                },
            ],
            config: {
                responseModalities: ["IMAGE", "TEXT"],
            },
        });

        const parts = response.candidates?.[0]?.content?.parts ?? [];
        const imagePart = parts.find((p) => p.inlineData?.mimeType?.startsWith("image/"));

        if (!imagePart?.inlineData) {
            const textPart = parts.find((p) => p.text);
            console.warn("No image returned by Gemini:", textPart?.text);
            return NextResponse.json(
                { success: false, error: "Gemini did not return an image" },
                { status: 500 }
            );
        }
        // Añadimos un credito a la base de datos
        await db.query(
            'UPDATE users SET ai_credits_used = ai_credits_used + 1 WHERE user_id = ?',
            [user.userId]
        );
        return NextResponse.json({
            success: true,
            imageBase64: imagePart.inlineData.data,
            mimeType: imagePart.inlineData.mimeType,
        });

    } catch (error) {
        console.error("Gemini error:", error.message);
        return NextResponse.json(
            { success: false, error: error.message || "Generation failed" },
            { status: 500 }
        );
    }
}