import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

import { getMongoClient, getMongoDb } from "@/lib/db/mongo-client";
import { env } from "@/lib/env";

// Use any-typed generic to avoid strict-inference mismatch between the
// concrete config object and the wider BetterAuthOptions type.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AuthInstance = ReturnType<typeof betterAuth<any>>;

let _auth: AuthInstance | null = null;

export async function getAuth(): Promise<AuthInstance> {
  if (_auth) return _auth;

  const db = await getMongoDb();
  const client = await getMongoClient();

  // Build the trusted-origins list from env so production URLs are included
  const origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
  ];

  const extraOrigins = (env.BETTER_AUTH_TRUSTED_ORIGINS ?? "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

  for (const origin of extraOrigins) {
    if (!origins.includes(origin)) {
      origins.push(origin);
    }
  }

  if (env.BETTER_AUTH_URL && !origins.includes(env.BETTER_AUTH_URL)) {
    origins.push(env.BETTER_AUTH_URL);
  }

  _auth = betterAuth({
    secret: env.BETTER_AUTH_SECRET,
    baseURL: env.BETTER_AUTH_URL,
    basePath: "/api/auth",
    trustedOrigins: origins,
    database: mongodbAdapter(db, { client }),
    emailAndPassword: {
      enabled: true,
    },
    session: {
      expiresIn: 60 * 60 * 24 * 7,
      updateAge: 60 * 60 * 24,
    },
  });

  return _auth;
}
