import { LeaderboardTable } from "@/components/leaderboard/leaderboard-table";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/arena/leaderboard/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <LeaderboardTable />
    </div>
  );
}
