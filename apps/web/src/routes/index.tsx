import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { trpc } from "@/utils/trpc";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from "@/components/ui/dialog";
import { AuthForm } from "@/components/auth-form";
import wordSearchLogo from '../assets/word-search-logo.png';

export const Route = createFileRoute("/")({
  component: HomeComponent,
});

function HomeComponent() {
  const healthCheck = useQuery(trpc.healthCheck.queryOptions());
  const shitTest = useQuery(trpc.shitTest.queryOptions());


  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="container mx-auto max-w-3xl px-4 py-2">
        <h1 className="mb-4 text-3xl font-bold">Welcome to Wordsearch!</h1>
        <Dialog>

          <DialogTrigger>
            <Button variant="primary" >
              PLAY GAME
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <img src={wordSearchLogo} alt="Word Search Logo" className="w-16 h-16 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-center">
                READY TO BATTLE?
              </h2>
            </DialogHeader>
            <AuthForm />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
