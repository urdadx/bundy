import { createFileRoute, Outlet } from "@tanstack/react-router";
import { ArenaLayout } from "@/components/layouts/arena-layout";
import { RightSidebar } from "@/components/right-sidebar";

export const Route = createFileRoute("/arena/lessons")({
  component: BattlesLayout,
});

function BattlesLayout() {
  return (
    <ArenaLayout sidebar={<RightSidebar />}>
      <Outlet />
    </ArenaLayout>
  );
}
