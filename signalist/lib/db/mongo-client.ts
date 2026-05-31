import { MongoClient } from "mongodb";

import { env } from "@/lib/env";

declare global {
  var __mongoClient: MongoClient | undefined;
}

export const getMongoClient = async () => {
  if (!global.__mongoClient) {
    global.__mongoClient = new MongoClient(env.MONGODB_URI, {
      tls: true,
      family: 4,
      retryReads: true,
      retryWrites: true,
      serverSelectionTimeoutMS: 15000,
      connectTimeoutMS: 15000,
    });
    await global.__mongoClient.connect();
  }

  return global.__mongoClient;
};

export const getMongoDb = async () => {
  const client = await getMongoClient();
  return client.db(env.MONGODB_DB_NAME);
};
