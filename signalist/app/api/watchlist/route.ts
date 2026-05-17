import { NextResponse } from "next/server";
import { z } from "zod";

import { getServerSession } from "@/lib/auth-session";
import { connectMongoose } from "@/lib/db/mongoose";
import { WatchlistModel } from "@/lib/db/models/watchlist";

const upsertSchema = z.object({
  items: z.array(
    z.object({
      symbol: z.string().min(1),
      name: z.string().min(1),
      entryPrice: z.number().nonnegative(),
      addedAt: z.string().datetime().optional(),
    })
  ),
});

export async function GET(request: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectMongoose();
    const watchlist = await WatchlistModel.findOne({ userId: session.user.id }).lean();

    const items = Array.isArray(watchlist?.items)
      ? watchlist.items
      : Array.isArray((watchlist as { symbols?: string[] } | null)?.symbols)
        ? ((watchlist as { symbols?: string[] }).symbols ?? []).map((symbol) => ({
            symbol,
            name: `${symbol} Inc.`,
            entryPrice: 0,
            addedAt: new Date().toISOString(),
          }))
        : [];

    return NextResponse.json({ items });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Invalid request" },
      { status: 400 }
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

    const updated = await WatchlistModel.findOneAndUpdate(
      { userId: session.user.id },
      {
        $set: {
          items: body.items.map((item) => ({
            symbol: item.symbol.toUpperCase(),
            name: item.name,
            entryPrice: item.entryPrice,
            addedAt: item.addedAt ? new Date(item.addedAt) : new Date(),
          })),
        },
      },
      { upsert: true, new: true }
    ).lean();

    return NextResponse.json({ items: updated?.items ?? [] });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Invalid request" },
      { status: 400 }
    );
  }
}
