import { betterAuth, type BetterAuthOptions } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { anonymous } from "better-auth/plugins";
import { env } from "@wordsearch/env/server";
import { db } from "@wordsearch/db";
import * as schema from "@wordsearch/db/schema/auth";

const options = {
  database: drizzleAdapter(db, {
    provider: "sqlite",
    schema: schema,
  }),
  trustedOrigins: [env.CORS_ORIGIN],
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    },
  },
  advanced: {
    defaultCookieAttributes: {
      sameSite: "none",
      secure: true,
      httpOnly: true,
    },
  },
  plugins: [
    anonymous({
      emailDomainName: "guest.wordsearch.local",
    }),
  ],
} satisfies BetterAuthOptions;

export const auth = betterAuth(options);

export type Auth = typeof auth;
