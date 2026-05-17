import mongoose from "mongoose";

import { env } from "@/lib/env";

declare global {
  var __mongooseConnection: Promise<typeof mongoose> | undefined;
}

export const connectMongoose = async () => {
  if (!global.__mongooseConnection) {
    global.__mongooseConnection = mongoose.connect(env.MONGODB_URI, {
      dbName: env.MONGODB_DB_NAME,
      family: 4,
      serverSelectionTimeoutMS: 15000,
      connectTimeoutMS: 15000,
    });
  }

  return global.__mongooseConnection;
};
