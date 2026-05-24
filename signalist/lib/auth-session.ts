import { headers } from "next/headers";

import { getAuth } from "@/lib/auth";

export const getServerSession = async () => {
  const auth = await getAuth();
  return auth.api.getSession({
    headers: await headers(),
  });
};
