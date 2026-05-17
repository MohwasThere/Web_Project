import { GoogleGenerativeAI } from "@google/generative-ai";
import { z } from "zod";

import { env } from "@/lib/env";

const predictionSchema = z.object({
  direction: z.enum(["bullish", "bearish", "neutral"]),
  confidence: z.number().min(0).max(100),
  target: z.string(),
  reason: z.string(),
});

const client = new GoogleGenerativeAI(env.GEMINI_API_KEY);

export const generatePrediction = async (symbol: string) => {
  const model = client.getGenerativeModel({ model: env.GEMINI_MODEL });

  const prompt = [
    "You are a financial signal generator.",
    `Analyze ${symbol.toUpperCase()} in a short-term horizon.`,
    "Respond ONLY with JSON in this shape:",
    '{"direction":"bullish|bearish|neutral","confidence":0-100,"target":"string","reason":"string"}',
  ].join("\n");

  const result = await model.generateContent(prompt);
  const rawText = result.response.text().trim();
  const parsed = predictionSchema.parse(JSON.parse(rawText));

  return {
    ...parsed,
    raw: rawText,
  };
};
