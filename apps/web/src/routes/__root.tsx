import type { QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import type { trpc } from "@/utils/trpc";
import { useTheme } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import "../index.css";

export interface RouterAppContext {
  trpc: typeof trpc;
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<RouterAppContext>()({
  component: RootComponent,
  head: () => ({
    meta: [
      {
        title: "wordsearch",
      },
      {
        name: "description",
        content: "Multiplayer word search game for learning and fun!",
      },
    ],
    links: [
      {
        rel: "icon",
        href: "/favicon.ico",
      },
    ],
  }),
});

function RootComponent() {
  const { theme } = useTheme();

  return (
    <>
      <div className="grid grid-rows-[auto_1fr] h-svh">
        <Outlet />
      </div>
      <Toaster theme={theme as "light" | "dark"} richColors />
      <ReactQueryDevtools position="bottom" buttonPosition="bottom-right" />
    </>
  );
}
