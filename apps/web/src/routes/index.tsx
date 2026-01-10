import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AuthForm } from "@/components/auth-form";

export const Route = createFileRoute("/")({
  component: HomeComponent,
});

function HomeComponent() {
  const [open, setOpen] = useState(false);

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
