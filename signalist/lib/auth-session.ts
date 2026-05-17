import { headers } from "next/headers";

import { auth } from "@/lib/auth";

export const getServerSession = async () => {
  return auth.api.getSession({
    headers: await headers(),
  });
};
