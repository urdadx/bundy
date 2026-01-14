import { WorldSelector } from "@/components/select-world";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import backgroundColorGrass from "@/assets/background/backgroundColorGrass.png";
import { authClient } from "@/lib/auth-client";
import { AuthForm } from "@/components/auth-form";
import backgroundImage from "@/assets/background/backgroundCastles.png";

const worldSearchSchema = z.object({
  world: z.string().default("meadow"),
});

export const Route = createFileRoute("/worlds")({
  validateSearch: (search) => worldSearchSchema.parse(search),
  component: RouteComponent,
  beforeLoad: async () => {
    const { data: session } = await authClient.getSession();
    return {
      session,
      isAuthenticated: !!session,
    };
  },
});

function RouteComponent() {
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
    <div
      className="min-h-screen"
      style={{
        backgroundImage: `url(${backgroundColorGrass})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
      }}
    >
      <WorldSelector />
    </div>
  );
}
