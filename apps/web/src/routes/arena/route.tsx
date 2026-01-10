import { SideMenu } from "@/components/ui/side-menu";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/arena")({
  component: ArenaLayout,
});

function ArenaLayout() {
  return (
    <div className="flex h-screen">
      <SideMenu />
      <div className="flex-1 overflow-auto bg-white">
        <Outlet />
      </div>
    </div>
  );
}
