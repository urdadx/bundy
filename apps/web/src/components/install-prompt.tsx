import { Download, Share, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function InstallPrompt() {
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [showIosInstructions, setShowIosInstructions] = useState(false);
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    const isStandalone = window.matchMedia("(display-mode: standalone)").matches;
    const isIos =
      /iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    setShowIosInstructions(isIos && !isStandalone);
    setDismissed(sessionStorage.getItem("install-prompt-dismissed") === "true" || isStandalone);

    const handleInstallPrompt = (event: Event) => {
      event.preventDefault();
      setInstallEvent(event as BeforeInstallPromptEvent);
    };
    const handleInstalled = () => {
      setInstallEvent(null);
      setShowIosInstructions(false);
    };

    window.addEventListener("beforeinstallprompt", handleInstallPrompt);
    window.addEventListener("appinstalled", handleInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", handleInstallPrompt);
      window.removeEventListener("appinstalled", handleInstalled);
    };
  }, []);

  if (dismissed || (!installEvent && !showIosInstructions)) return null;

  const dismiss = () => {
    sessionStorage.setItem("install-prompt-dismissed", "true");
    setDismissed(true);
  };

  const install = async () => {
    if (!installEvent) return;
    await installEvent.prompt();
    const { outcome } = await installEvent.userChoice;
    if (outcome === "accepted") setInstallEvent(null);
  };

  return (
    <aside className="fixed inset-x-3 bottom-3 z-[100] mx-auto flex max-w-md items-center gap-3 rounded-2xl border-2 border-slate-200 bg-white p-3 text-slate-700 shadow-xl dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100">
      <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-[#ddf4ff] text-[#1cb0f6]">
        {showIosInstructions ? <Share size={22} /> : <Download size={22} />}
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-bold">Install Bundy</p>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {showIosInstructions ? "Tap Share, then Add to Home Screen." : "Play faster and use Bundy offline."}
        </p>
      </div>
      {installEvent && (
        <Button size="sm" variant="secondary" onClick={install}>
          Install
        </Button>
      )}
      <button className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800" aria-label="Dismiss install prompt" onClick={dismiss}>
        <X size={18} />
      </button>
    </aside>
  );
}
