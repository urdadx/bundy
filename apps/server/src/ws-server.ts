import "dotenv/config";
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

app.get("/", (c) => {
  return c.text("WebSocket Server OK");
});

app.get("/health", (c) => {
  return c.json({ status: "healthy", service: "websocket" });
});

// ============ Multiplayer API Endpoints ============

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
      },
    );

    return c.json({ roomId: result.roomId });
  } catch (error) {
    console.error("Error creating room:", error);
    return c.json({ error: "Failed to create room" }, 500);
  }
});

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
  }),
);

const port = parseInt(process.env.WS_PORT || "3003", 10);

console.log(`🔌 WebSocket server starting on port ${port}`);

export default {
  port,
  fetch: app.fetch,
  websocket,
};
