import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  clientPrefix: "VITE_",
  client: {
    VITE_SERVER_URL: z.url(),
    VITE_WS_URL: z.url().optional(),
    VITE_NODE_ENV: z.enum(["development", "production"]).default("production"),
    VITE_R2_BUCKET: z.string().optional(),
  },
  runtimeEnv: (import.meta as any).env,
  emptyStringAsUndefined: true,
});
