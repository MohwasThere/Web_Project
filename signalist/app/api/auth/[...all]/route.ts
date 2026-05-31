import { toNextJsHandler } from "better-auth/next-js";

import { getAuth } from "@/lib/auth";

export const dynamic = "force-dynamic";

let handlers: { GET: (req: Request) => Promise<Response>; POST: (req: Request) => Promise<Response> } | null = null;

async function getHandlers() {
  if (!handlers) {
    const auth = await getAuth();
    handlers = toNextJsHandler(auth);
  }
  return handlers;
}

export async function GET(req: Request) {
  const { GET: handler } = await getHandlers();
  return handler(req);
}

export async function POST(req: Request) {
  const { POST: handler } = await getHandlers();
  return handler(req);
}
