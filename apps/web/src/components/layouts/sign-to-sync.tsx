import { toast } from "sonner";
import { Button } from "../ui/button";
import { GoogleSVG } from "../ui/google-svg";
import { signIn, useSession, isGuestUser } from "@/lib/auth-client";
import { useState } from "react";

const TwitterIcon = () => (
  <svg className="size-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M22.46 5.924c-.793.352-1.645.59-2.54.697a4.48 4.48 0 0 0 1.965-2.475 8.94 8.94 0 0 1-2.828 1.082A4.48 4.48 0 0 0 11.155 9.03a12.72 12.72 0 0 1-9.23-4.68 4.48 4.48 0 0 0 1.386 5.98 4.44 4.44 0 0 1-2.03-.56v.057a4.48 4.48 0 0 0 3.6 4.39 4.5 4.5 0 0 1-2.025.077 4.48 4.48 0 0 0 4.18 3.11A8.98 8.98 0 0 1 2 19.54a12.7 12.7 0 0 0 6.88 2.02c8.26 0 12.78-6.84 12.78-12.77 0-.19-.01-.38-.02-.57A9.22 9.22 0 0 0 24 4.59a8.93 8.93 0 0 1-2.54.697z" />
  </svg>
);

export const GoogleSyncCard = () => {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);

  const isGuest = isGuestUser(session?.user || null);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await signIn.social({
        provider: "google",
        callbackURL: window.location.href,
      });
    } catch (error) {
      toast.warning("Failed to sign in with Google. Please try again.");
      console.error("Google sign-in error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 relative overflow-hidden">
        <div className="absolute -left-4 -bottom-4 w-24 h-24 bg-sky-50 rounded-full border-4 border-sky-100 opacity-50" />

        <div className="flex flex-col items-center gap-3 relative z-10">
          <div className="flex-1 text-center sm:text-left space-y-1">
            <h3 className="text-lg font-semibold text-slate-700 uppercase tracking-tight">
              {isGuest ? "Sign in to Save Your Progress" : ""}
            </h3>
          </div>

          {isGuest ? (
            <Button
              className="w-full h-12 bg-white border-3 border-slate-200 border-b-4 text-slate-600 font-black uppercase hover:bg-slate-50 active:border-b-0 active:translate-y-1 transition-all flex items-center gap-3"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
            >
              <GoogleSVG />
              {isLoading ? "Signing in..." : "Sign in with Google"}
            </Button>
          ) : (
            <a
              href="https://twitter.com/NerdyProgramme2"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full h-12 bg-white border-3 border-slate-200 border-b-4 text-blue-500 font-black uppercase hover:bg-slate-50 active:border-b-0 active:translate-y-1 transition-all flex items-center justify-center gap-2 rounded-xl"
            >
              <TwitterIcon />
              <span>Follow me on X</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
};
