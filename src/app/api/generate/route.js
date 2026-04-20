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
    Transform this image into a tufting rug design ready for fabrication.
    Requirements:
    - Simplify shapes into bold, clean outlines
    - Use maximum 8-10 flat solid colors, absolutely no gradients or shadows
    - Thick defined borders between color zones
    - Style: textile/carpet aesthetic, looks like it could be physically tufted
    - Additional user style: ${userPrompt || "minimalist, street art influence"}
    Output only the transformed image.
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