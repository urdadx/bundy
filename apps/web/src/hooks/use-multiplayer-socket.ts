import { useCallback, useEffect, useRef, useState } from "react";
import type { ClientMessage, ServerMessage, ConnectionState } from "@/lib/multiplayer/types";
import { env } from "@wordsearch/env/web";

interface UseMultiplayerSocketOptions {
  onMessage?: (message: ServerMessage) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onReconnecting?: () => void;
  autoReconnect?: boolean;
  reconnectAttempts?: number;
  reconnectInterval?: number;
}

interface UseMultiplayerSocketReturn {
  connectionState: ConnectionState;
  connect: () => void;
  disconnect: () => void;
  send: (message: ClientMessage) => void;
  isConnected: boolean;
}

export function useMultiplayerSocket(
  options: UseMultiplayerSocketOptions = {}
): UseMultiplayerSocketReturn {
  const {
    onMessage,
    onConnect,
    onDisconnect,
    onReconnecting,
    autoReconnect = true,
    reconnectAttempts = 5,
    reconnectInterval = 1000,
  } = options;

  const [connectionState, setConnectionState] = useState<ConnectionState>("disconnected");
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isIntentionalDisconnectRef = useRef(false);

  const onMessageRef = useRef(onMessage);
  const onConnectRef = useRef(onConnect);
  const onDisconnectRef = useRef(onDisconnect);
  const onReconnectingRef = useRef(onReconnecting);

  useEffect(() => {
    onMessageRef.current = onMessage;
    onConnectRef.current = onConnect;
    onDisconnectRef.current = onDisconnect;
    onReconnectingRef.current = onReconnecting;
  }, [onMessage, onConnect, onDisconnect, onReconnecting]);

  const clearTimers = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    if (pingIntervalRef.current) {
      clearInterval(pingIntervalRef.current);
      pingIntervalRef.current = null;
    }
  }, []);

  const getWsUrl = useCallback(() => {
    const serverUrl = env.VITE_SERVER_URL;
    const wsProtocol = serverUrl.startsWith("https") ? "wss" : "ws";
    const wsHost = serverUrl.replace(/^https?:\/\//, "");
    return `${wsProtocol}://${wsHost}/ws/multiplayer`;
  }, []);

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      return;
    }

    isIntentionalDisconnectRef.current = false;
    setConnectionState("connecting");

    try {
      const ws = new WebSocket(getWsUrl());
      wsRef.current = ws;

      ws.onopen = () => {
        console.log("[WS] Connected");
        setConnectionState("connected");
        reconnectAttemptsRef.current = 0;
        onConnectRef.current?.();

        // Start ping interval to keep connection alive
        pingIntervalRef.current = setInterval(() => {
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ type: "ping" }));
          }
        }, 30000); 
      };

      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data) as ServerMessage;
          onMessageRef.current?.(message);
        } catch (error) {
          console.error("[WS] Error parsing message:", error);
        }
      };

      ws.onclose = (event) => {
        console.log("[WS] Disconnected", event.code, event.reason);
        clearTimers();
        wsRef.current = null;

        if (!isIntentionalDisconnectRef.current && autoReconnect) {
          if (reconnectAttemptsRef.current < reconnectAttempts) {
            setConnectionState("reconnecting");
            onReconnectingRef.current?.();
            
            const delay = reconnectInterval * Math.pow(2, reconnectAttemptsRef.current);
            console.log(`[WS] Reconnecting in ${delay}ms (attempt ${reconnectAttemptsRef.current + 1})`);
            
            reconnectTimeoutRef.current = setTimeout(() => {
              reconnectAttemptsRef.current++;
              connect();
            }, delay);
          } else {
            setConnectionState("disconnected");
            onDisconnectRef.current?.();
          }
        } else {
          setConnectionState("disconnected");
          onDisconnectRef.current?.();
        }
      };

      ws.onerror = (error) => {
        console.error("[WS] Error:", error);
      };
    } catch (error) {
      console.error("[WS] Connection error:", error);
      setConnectionState("disconnected");
    }
  }, [getWsUrl, autoReconnect, reconnectAttempts, reconnectInterval, clearTimers]);

  // Disconnect from WebSocket
  const disconnect = useCallback(() => {
    isIntentionalDisconnectRef.current = true;
    clearTimers();
    
    if (wsRef.current) {
      wsRef.current.close(1000, "User disconnected");
      wsRef.current = null;
    }
    
    setConnectionState("disconnected");
  }, [clearTimers]);

  // Send message
  const send = useCallback((message: ClientMessage) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
    } else {
      console.warn("[WS] Cannot send message - not connected");
    }
  }, []);

  useEffect(() => {
    return () => {
      isIntentionalDisconnectRef.current = true;
      clearTimers();
      if (wsRef.current) {
        wsRef.current.close(1000, "Component unmounted");
      }
    };
  }, [clearTimers]);

  return {
    connectionState,
    connect,
    disconnect,
    send,
    isConnected: connectionState === "connected",
  };
}
