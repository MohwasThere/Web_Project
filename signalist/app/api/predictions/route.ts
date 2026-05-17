import { NextResponse } from "next/server";
import { z } from "zod";

import { generatePrediction } from "@/lib/ai/gemini";
import { getServerSession } from "@/lib/auth-session";
import { connectMongoose } from "@/lib/db/mongoose";
import { PredictionModel } from "@/lib/db/models/prediction";

const bodySchema = z.object({
  symbol: z.string().min(1),
});

export async function POST(request: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = bodySchema.parse(await request.json());
    await connectMongoose();

    const prediction = await generatePrediction(body.symbol);

    const created = await PredictionModel.create({
      userId: session.user.id,
      symbol: body.symbol.toUpperCase(),
      ...prediction,
    });

    return NextResponse.json({
      prediction: {
        id: created._id,
        symbol: created.symbol,
        direction: created.direction,
        confidence: created.confidence,
        target: created.target,
        reason: created.reason,
        createdAt: created.createdAt,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unexpected prediction error",
      },
      { status: 400 }
    );
  }
}
