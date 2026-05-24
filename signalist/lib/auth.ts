import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

import { getMongoClient, getMongoDb } from "@/lib/db/mongo-client";
import { env } from "@/lib/env";

type AuthInstance = ReturnType<typeof betterAuth>;

let _auth: AuthInstance | null = null;

export async function getAuth(): Promise<AuthInstance> {
  if (_auth) return _auth;

  const db = await getMongoDb();
  const client = await getMongoClient();

  _auth = betterAuth({
    secret: env.BETTER_AUTH_SECRET,
    baseURL: env.BETTER_AUTH_URL,
    basePath: "/api/auth",
    trustedOrigins: [
      "http://localhost:3000",
      "http://127.0.0.1:3000",
    ],
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
