import { trpc } from "@/utils/trpc";
import { useQuery } from "@tanstack/react-query";
import { TipOfTheDay } from "./layouts/daily-tips";
import { LeagueProgress } from "./layouts/league-progress";
import { GoogleSyncCard } from "./layouts/sign-to-sync";

export function RightSidebar() {
  const { data: stats } = useQuery(trpc.user.getStats.queryOptions());
  const allowedLeagues = ["Bronze", "Silver", "Gold"] as const;
  const league = allowedLeagues.includes(stats?.league as any)
    ? (stats?.league as "Bronze" | "Silver" | "Gold")
    : "Bronze";
  const xp = stats?.totalXp || 0;

  const nextLeagueXp = league === "Bronze" ? 300 : league === "Silver" ? 500 : 0;
  const xpNeeded = Math.max(nextLeagueXp - xp, 0);

  return (
    <div className="space-y-7">
      <LeagueProgress league={league} xpNeeded={xpNeeded} />
      <TipOfTheDay />
      <GoogleSyncCard />
    </div>
  );
}
