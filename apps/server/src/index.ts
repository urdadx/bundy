import "dotenv/config";
import { trpcServer } from "@hono/trpc-server";
import { createContext } from "@wordsearch/api/context";
import { appRouter } from "@wordsearch/api/routers/index";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";

const app = new Hono();

app.use(logger());
app.use(
  "/*",
  cors({
    origin: process.env.CORS_ORIGIN || "",
    allowMethods: ["GET", "POST", "OPTIONS"],
  }),
);

app.use(
  "/trpc/*",
  trpcServer({
    router: appRouter,
    createContext: (_opts, context) => {
      return createContext({ context });
    },
  }),
);

app.get("/", (c) => {
  return c.text("OK");
});

app.get("/shit", (c) => {
  return c.text("SHITTT");
});

export default app;
