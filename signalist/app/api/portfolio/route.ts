import { NextResponse } from "next/server";
import { z, ZodError } from "zod";

import { getServerSession } from "@/lib/auth-session";
import { connectMongoose } from "@/lib/db/mongoose";
import { PortfolioModel } from "@/lib/db/models/portfolio";

const holdingSchema = z.object({
  symbol: z.string().min(1),
  name: z.string().min(1),
  shares: z.number().positive(),
  buyPrice: z.number().positive(),
  // currentPrice is a live value — can be 0 while the quote is still loading
  currentPrice: z.number().nonnegative().default(0),
  changePercent: z.number().optional(),
});

const upsertSchema = z.object({ holdings: z.array(holdingSchema) });

export async function GET(request: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectMongoose();
    const portfolio = await PortfolioModel.findOne({ userId: session.user.id }).lean();

    return NextResponse.json({ holdings: portfolio?.holdings ?? [] });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to load portfolio" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = upsertSchema.parse(await request.json());
    await connectMongoose();

    const updated = await PortfolioModel.findOneAndUpdate(
      { userId: session.user.id },
      { $set: { holdings: body.holdings } },
      { upsert: true, returnDocument: 'after' }
    ).lean();

    return NextResponse.json({ holdings: updated?.holdings ?? [] });
  } catch (error) {
    const status = error instanceof ZodError ? 400 : 500;
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Invalid request" },
      { status }
    );
  }
}
