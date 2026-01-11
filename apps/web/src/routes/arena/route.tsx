import { SideMenu } from "@/components/ui/side-menu";
import { authClient } from "@/lib/auth-client";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/arena")({
  component: ArenaLayout,
  beforeLoad: async () => {
    const { data: session } = await authClient.getSession();
    return {
      session,
      isAuthenticated: !!session,
    };
  },
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
