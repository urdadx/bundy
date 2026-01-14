import { SideMenu } from "@/components/ui/side-menu";
import { authClient } from "@/lib/auth-client";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import backgroundImage from "@/assets/background/backgroundCastles.png";
import { AuthForm } from "@/components/auth-form";

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
  const { isAuthenticated } = Route.useRouteContext();

  if (!isAuthenticated) {
    return (
      <div
        className="min-h-screen flex flex-col"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <AuthForm open={true} onOpenChange={() => {}} />
      </div>
    );
  }
  return (
    <>
      <div className="flex h-screen">
        <SideMenu />
        <div className="flex-1 overflow-auto bg-white">
          <Outlet />
        </div>
      </div>
    </>
  );
}
