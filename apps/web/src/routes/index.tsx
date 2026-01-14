import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AuthForm } from "@/components/auth-form";
import { authClient } from "@/lib/auth-client";
import backgroundImage from "@/assets/background/backgroundCastles.png";

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
    <div className="flex min-h-screen items-center justify-center">
      <div className="container mx-auto max-w-3xl px-4 py-2">
        <h1 className="mb-4 text-3xl font-bold">Welcome to Wordsearch!</h1>
        <Button variant="primary" onClick={() => setOpen(true)}>
          PLAY GAME
        </Button>
        <AuthForm open={open} onOpenChange={setOpen} />
      </div>
    </div>
  );
}
