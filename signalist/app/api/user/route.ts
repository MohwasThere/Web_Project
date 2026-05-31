import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

import { getServerSession } from "@/lib/auth-session";
import { getMongoDb } from "@/lib/db/mongo-client";
import { connectMongoose } from "@/lib/db/mongoose";
import { PortfolioModel } from "@/lib/db/models/portfolio";
import { WatchlistModel } from "@/lib/db/models/watchlist";
import { SubscriptionModel } from "@/lib/db/models/subscription";
import { env } from "@/lib/env";

export async function DELETE(request: Request) {
  const session = await getServerSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { password } = (await request.json().catch(() => ({}))) as { password?: string };
  if (!password) {
    return NextResponse.json({ error: "Password is required" }, { status: 400 });
  }

  // Verify password by attempting a sign-in against Better Auth's own endpoint
  const verifyRes = await fetch(`${env.BETTER_AUTH_URL}/api/auth/sign-in/email`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Origin: env.BETTER_AUTH_URL },
    body: JSON.stringify({ email: session.user.email, password }),
  });

  if (!verifyRes.ok) {
    return NextResponse.json({ error: "Incorrect password" }, { status: 401 });
  }

  // Delete all user data from Mongoose collections
  await connectMongoose();
  await Promise.allSettled([
    PortfolioModel.deleteOne({ userId: session.user.id }),
    WatchlistModel.deleteOne({ userId: session.user.id }),
    SubscriptionModel.deleteOne({ userId: session.user.id }),
  ]);

  // Remove the user, all sessions, and accounts from MongoDB
  // Better Auth stores users with _id as ObjectId; sessions/accounts use userId as string
  const db = await getMongoDb();
  await Promise.allSettled([
    db.collection("user").deleteOne({ _id: new ObjectId(session.user.id) }),
    db.collection("session").deleteMany({ userId: session.user.id }),
    db.collection("account").deleteMany({ userId: session.user.id }),
  ]);

  return NextResponse.json({ ok: true });
}
