import "dotenv/config";
import { trpcServer } from "@hono/trpc-server";
import { createContext } from "@wordsearch/api/context";
import { appRouter } from "@wordsearch/api/routers/index";
import { auth } from "@wordsearch/auth";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { upgradeWebSocket, websocket } from "hono/bun";
import {
  handleMessage,
  handleOpen,
  handleClose,
  handleError,
  handleCreateRoom,
  getRoom,
  type WSData,
  type GameSettings,
  serializeRoom,
} from "./websocket";

const app = new Hono();

app.use(logger());
app.use(
  "/*",
  cors({
    origin: process.env.CORS_ORIGIN || "",
    allowMethods: ["GET", "POST", "OPTIONS"],
    credentials: true,
  }),
);

app.on(["POST", "GET"], "/api/auth/**", (c) => auth.handler(c.req.raw));

app.use(
  "/trpc/*",
  trpcServer({
    router: appRouter,
    createContext: (_opts, context) => {
      return createContext({ context, auth });
    },
  }),
);

app.get("/", (c) => {
  return c.text("OK");
});

// ============ Multiplayer API Endpoints ============

// Create a new multiplayer room
app.post("/api/multiplayer/rooms", async (c) => {
  try {
    const body = await c.req.json();
    const { odId, odName, odAvatar, settings } = body as {
      odId: string;
      odName: string;
      odAvatar: string;
      settings: GameSettings;
    };

    if (!odId || !odName) {
      return c.json({ error: "Missing required fields" }, 400);
    }

    const result = handleCreateRoom(
      odId,
      odName,
      odAvatar || "jack-avatar.png",
      settings || {
        theme: "animals",
        difficulty: "medium",
        gridSize: 10,
        wordCount: 7,
        timeLimit: 600,
      }
    );

    return c.json({ roomId: result.roomId });
  } catch (error) {
    console.error("Error creating room:", error);
    return c.json({ error: "Failed to create room" }, 500);
  }
});

// Get room info
app.get("/api/multiplayer/rooms/:roomId", (c) => {
  const roomId = c.req.param("roomId");
  const room = getRoom(roomId);

  if (!room) {
    return c.json({ error: "Room not found" }, 404);
  }

  return c.json({ room: serializeRoom(room) });
});

// ============ WebSocket Endpoint ============

app.get(
  "/ws/multiplayer",
  upgradeWebSocket(() => {

    const wsData: WSData = {
      odId: "",
      odName: "",
      roomId: "",
      odAvatar: "",
    };

    return {
      onOpen(_event, ws) {
        (ws as any).data = wsData;
        handleOpen(ws as any);
      },
      onMessage(event, ws) {
        if (!(ws as any).data) {
          (ws as any).data = wsData;
        }
        handleMessage(ws as any, event.data.toString());
      },
      onClose(_event, ws) {
        handleClose(ws as any);
      },
      onError(_event, ws) {
        handleError(ws as any, new Error("WebSocket error"));
      },
    };
  })
);

export default {
  fetch: app.fetch,
  websocket,
};
