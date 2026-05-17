import { NextResponse } from "next/server";
import { z } from "zod";

import { getServerSession } from "@/lib/auth-session";
import { connectMongoose } from "@/lib/db/mongoose";
import { SubscriptionModel } from "@/lib/db/models/subscription";

const updateSchema = z.object({
  plan: z.enum(["Free", "Basic", "Premium", "Pro"]),
});

export async function GET() {
  const session = await getServerSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectMongoose();

  const subscription = await SubscriptionModel.findOneAndUpdate(
    { userId: session.user.id },
    { $setOnInsert: { plan: "Free", status: "active" } },
    { upsert: true, new: true }
  ).lean();

  return NextResponse.json({
    plan: subscription?.plan ?? "Free",
    status: subscription?.status ?? "active",
  });
}

export async function POST(request: Request) {
  const session = await getServerSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = updateSchema.parse(await request.json());
    await connectMongoose();

    const subscription = await SubscriptionModel.findOneAndUpdate(
      { userId: session.user.id },
      { $set: { plan: body.plan, status: "active" } },
      { upsert: true, new: true }
    ).lean();

    return NextResponse.json({
      plan: subscription?.plan ?? body.plan,
      status: subscription?.status ?? "active",
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Invalid request" },
      { status: 400 }
    );
  }
}
