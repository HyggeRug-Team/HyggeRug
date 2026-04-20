/*ENDPOINT que procesa la imagen por IA*/
import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });

export async function POST(req) {
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