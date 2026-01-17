import type { QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import type { trpc } from "@/utils/trpc";
import { useTheme } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import "../index.css";
import { seo } from "@/lib/seo";

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
        content: "Wordsearch adventure game for learning and fun!",
      },
      ...seo({
        title: "Bundy - Wordsearch adventure game",
        description:
          "Play Bundy, an exciting wordsearch adventure game that challenges your vocabulary and spelling skills while having fun!",
        keywords: "wordsearch, adventure game, vocabulary, spelling, learning, fun",
        image: "https://bundy.urdadx.com/og.png",
      }),
    ],
    links: [
      {
        rel: "icon",
        href: "/favicon/favicon.ico",
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
