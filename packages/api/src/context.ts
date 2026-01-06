import type { Context as HonoContext } from "hono";
import type { Auth } from "@wordsearch/auth";

export type CreateContextOptions = {
  context: HonoContext;
  auth: Auth;
};

export async function createContext({ context, auth }: CreateContextOptions) {
  // Get session from better-auth using the request headers
  const session = await auth.api.getSession({
    headers: context.req.raw.headers,
  });

  return {
    session,
    user: session?.user ?? null,
    userId: session?.user?.id ?? null,
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
