import { NextResponse } from "next/server";
import { z } from "zod";

import { generatePrediction } from "@/lib/ai/gemini";
import { getServerSession } from "@/lib/auth-session";
import { connectMongoose } from "@/lib/db/mongoose";
import { PredictionModel } from "@/lib/db/models/prediction";
import { SubscriptionModel } from "@/lib/db/models/subscription";
import { subscriptionFeatures, SubscriptionPlan } from "@/lib/subscription";

const bodySchema = z.object({
  symbol: z.string().min(1).max(10),
});

function startOfToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

export async function GET() {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectMongoose();

    const subscription = await SubscriptionModel.findOne({ userId: session.user.id }).lean();
    const plan = (subscription?.plan ?? "Free") as SubscriptionPlan;
    const features = subscriptionFeatures[plan];

    const usedToday = await PredictionModel.countDocuments({
      userId: session.user.id,
      createdAt: { $gte: startOfToday() },
    });

    return NextResponse.json({
      plan,
      maxPredictions: features.maxPredictions,
      usedToday,
      remaining: Math.max(0, features.maxPredictions - usedToday),
    });
  } catch {
    return NextResponse.json({ error: "Failed to load quota" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let body: z.infer<typeof bodySchema>;
    try {
      body = bodySchema.parse(await request.json());
    } catch {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    await connectMongoose();

    const subscription = await SubscriptionModel.findOne({ userId: session.user.id }).lean();
    const plan = (subscription?.plan ?? "Free") as SubscriptionPlan;
    const features = subscriptionFeatures[plan];

    const usedToday = await PredictionModel.countDocuments({
      userId: session.user.id,
      createdAt: { $gte: startOfToday() },
    });

    if (usedToday >= features.maxPredictions) {
      return NextResponse.json(
        { error: `Daily prediction limit reached (${features.maxPredictions} for ${plan} plan)` },
        { status: 429 }
      );
    }

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
      usedToday: usedToday + 1,
      remaining: Math.max(0, features.maxPredictions - usedToday - 1),
    });
  } catch (error) {
    const isClientError = error instanceof z.ZodError;
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unexpected prediction error" },
      { status: isClientError ? 400 : 500 }
    );
  }
}
