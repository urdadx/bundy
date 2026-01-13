import { createFileRoute, Outlet } from "@tanstack/react-router";
import { ArenaLayout } from "@/components/layouts/arena-layout";
import { trpc } from "@/utils/trpc";
import { useQuery } from "@tanstack/react-query";
import { LeagueProgress } from "@/components/layouts/league-progress";
import { TipOfTheDay } from "@/components/layouts/daily-tips";
import { GoogleSyncCard } from "@/components/layouts/sign-to-sync";

export const Route = createFileRoute("/arena/lessons")({
  component: BattlesLayout,
});

function BattlesLayout() {
  return (
    <ArenaLayout sidebar={<ProgressSidebar />}>
      <Outlet />
    </ArenaLayout>
  );
}

function ProgressSidebar() {
  const { data: stats } = useQuery(trpc.user.getStats.queryOptions());
  const allowedLeagues = ["Bronze", "Silver", "Gold"] as const;
  const league = allowedLeagues.includes(stats?.league as any)
    ? (stats?.league as "Bronze" | "Silver" | "Gold")
    : "Bronze";
  const xp = stats?.totalXp || 0;

  const nextLeagueXp = league === "Bronze" ? 300 : league === "Silver" ? 700 : 0;
  const xpNeeded = Math.max(nextLeagueXp - xp, 0);

  return (
    <div className="space-y-4">
      <LeagueProgress league={league} xpNeeded={xpNeeded} />
      <TipOfTheDay />
      <GoogleSyncCard />
    </div>
  );
}
