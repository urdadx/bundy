import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AuthForm } from "@/components/auth-form";
import { authClient } from "@/lib/auth-client";
import backgroundImage from "@/assets/background/backgroundCastles.png";
import twoPlayersImage from "@/assets/characters/multiplayer.png";

export const Route = createFileRoute("/")({
  component: HomeComponent,
  beforeLoad: async () => {
    const { data: session } = await authClient.getSession();
    return {
      session,
      isAuthenticated: !!session,
    };
  },
});

function HomeComponent() {
  const [open, setOpen] = useState(false);

  const { isAuthenticated } = Route.useRouteContext();

  if (!isAuthenticated) {
    return (
      <div
        className="min-h-screen items-center justify-center flex flex-col"
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
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
      className="flex min-h-screen items-center justify-center"
    >
      <div className=" mx-auto max-w-2xl flex justify-center flex-col items-center px-4">
        <div className="relative">
          <img
            src={twoPlayersImage}
            alt="Multiplayer"
            className="w-32 h-32 object-contain group-hover:scale-105 transition-transform"
          />
        </div>{" "}
        <h1 className="mb-6 text-4xl font-semibold">Welcome to Bundy</h1>
        {isAuthenticated ? (
          <Link to="/arena/lessons">
            <Button variant="primary">Continue Playing</Button>
          </Link>
        ) : (
          <Button variant="primary" onClick={() => setOpen(true)}>
            PLAY GAME
          </Button>
        )}
        <AuthForm open={open} onOpenChange={setOpen} />
      </div>
    </div>
  );
}
