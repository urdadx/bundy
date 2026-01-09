import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { AuthForm } from "@/components/auth-form";

export const Route = createFileRoute("/")({
  component: HomeComponent,
});

function HomeComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="container mx-auto max-w-3xl px-4 py-2">
        <h1 className="mb-4 text-3xl font-bold">Welcome to Wordsearch!</h1>
        <Dialog>
          <DialogTrigger>
            <Button variant="primary">PLAY GAME</Button>
          </DialogTrigger>
          <AuthForm />
        </Dialog>
      </div>
    </div>
  );
}
