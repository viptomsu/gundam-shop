import { GoogleGenAI } from "@google/genai";

export const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const MODELS = {
  flash: "gemini-3-flash-preview",
  pro: "gemini-3-pro-preview",
} as const;

export type ModelType = keyof typeof MODELS;

interface GenerateContentParams {
  prompt: string;
  model?: ModelType;
  thinking?: boolean;
}

export async function generateContent({
  prompt,
  model = "flash",
  thinking = false,
}: GenerateContentParams) {
  const selectedModel = MODELS[model];
  const thinkingLevel = thinking ? "HIGH" : "MINIMAL";

  const config = {
    thinkingConfig: {
      thinkingLevel,
    },
  } as any;

  const response = await ai.models.generateContent({
    model: selectedModel,
    config,
    contents: [
      {
        role: "user",
        parts: [
          {
            text: prompt,
          },
        ],
      },
    ],
  });

  return response.text;
}

export async function generateImage(prompt: string): Promise<Buffer | null> {
  const model = "gemini-2.5-flash-image";
  const config = {
    responseModalities: ["IMAGE", "TEXT"],
  } as any;

  try {
    const response = await ai.models.generateContentStream({
      model,
      config,
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
    });

    for await (const chunk of response) {
      if (
        !chunk.candidates ||
        !chunk.candidates[0].content ||
        !chunk.candidates[0].content.parts
      ) {
        continue;
      }

      const part = chunk.candidates[0].content.parts[0];
      if (part.inlineData && part.inlineData.data) {
        return Buffer.from(part.inlineData.data, "base64");
      }
    }

    return null;
  } catch (error) {
    console.error("Error generating image:", error);
    throw error;
  }
}
