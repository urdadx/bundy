import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { DifficultyBar } from "./difficulty-bar";
import { Dialog, DialogTrigger, DialogContent, DialogHeader } from "./ui/dialog";
import { ThemeSelectionDialog } from "./theme-selection-dialog";
import { useSession } from "@/lib/auth-client";
import { createRoom } from "@/lib/multiplayer/api";
import type { GameSettings } from "@/lib/multiplayer/types";
import { Loader2 } from "lucide-react";
import { Switch } from "./ui/switch";

const THEMES: Record<string, { name: string; icon: string }> = {
  animals: { name: "Animals", icon: "🐾" },
  plants: { name: "Plants", icon: "🌵" },
  cities: { name: "Cities", icon: "🏙️" },
  countries: { name: "Countries", icon: "🌍" },
  foods: { name: "Foods", icon: "🍕" },
  cars: { name: "Cars", icon: "🚗" },
  technology: { name: "Technology", icon: "💻" },
  sports: { name: "Sports", icon: "⚽" },
  science: { name: "Science", icon: "🔬" },
};

const DIFFICULTY_CONFIG = {
  easy: { gridSizeRange: [8, 10], wordCountRange: [5, 7] },
  medium: { gridSizeRange: [10, 12], wordCountRange: [7, 10] },
  hard: { gridSizeRange: [12, 15], wordCountRange: [10, 15] },
};

function randomInRange(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

interface LobbyGameSettingsUIProps {
  onRoomCreated?: (roomId: string) => void;
  onNavigateToLobby?: (roomId: string) => void;
}

export function LobbyGameSettingsUI({
  onRoomCreated,
  onNavigateToLobby,
}: LobbyGameSettingsUIProps) {
  const { data: session } = useSession();
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("medium");
  const [theme, setTheme] = useState("animals");
  const [isCreatingRoom, setIsCreatingRoom] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateSettings = useCallback((): GameSettings => {
    const config = DIFFICULTY_CONFIG[difficulty];
    return {
      theme,
      difficulty,
      gridSize: randomInRange(config.gridSizeRange[0], config.gridSizeRange[1]),
      wordCount: randomInRange(config.wordCountRange[0], config.wordCountRange[1]),
      timeLimit: 600,
    };
  }, [difficulty, theme]);

  const handleContinue = async () => {
    if (!session?.user) {
      setError("You must be logged in to create a room");
      return;
    }

    setIsCreatingRoom(true);
    setError(null);

    try {
      const settings = generateSettings();
      const result = await createRoom({
        odId: session.user.id,
        odName: session.user.name || "Player",
        odAvatar: (session.user as any).avatar || "jack-avatar.png",
        settings,
      });

      onRoomCreated?.(result.roomId);
      onNavigateToLobby?.(result.roomId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create room");
    } finally {
      setIsCreatingRoom(false);
    }
  };

  const handleThemeSelect = (selectedTheme: string) => {
    setTheme(selectedTheme);
  };

  const currentTheme = THEMES[theme] || THEMES.animals;

  return (
    <DialogContent className="border-none p-4 sm:p-6 w-200! sm:max-w-md">
      <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto">
        <DialogHeader className="pb-3">
          <h2 className="text-lg sm:text-xl text-center font-black text-slate-700 uppercase tracking-widest">
            Game Settings
          </h2>
        </DialogHeader>
        <div className="w-full p-2">
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="font-black text-slate-700 uppercase text-sm tracking-wide">
                  Difficulty
                </p>
                <DifficultyBar level={difficulty} />
              </div>
              <div className="flex gap-2 justify-center sm:justify-end">
                {(["easy", "medium", "hard"] as const).map((d) => (
                  <Button
                    key={d}
                    variant="ghost"
                    size="sm"
                    onClick={() => setDifficulty(d)}
                    className={cn(
                      "uppercase font-bold text-xs",
                      difficulty === d ? "text-green-600 bg-green-50" : "text-slate-400",
                    )}
                  >
                    {d}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <p className="font-black text-slate-700 uppercase text-sm tracking-wide">Theme</p>
              <Dialog>
                <DialogTrigger
                  render={
                    <Button variant="ghost" className="font-bold text-slate-500 hover:text-primary">
                      {currentTheme.icon} {currentTheme.name}
                    </Button>
                  }
                />
                <ThemeSelectionDialog currentTheme={theme} onSelect={handleThemeSelect} />
              </Dialog>
            </div>
            <div className="flex items-center justify-between">
              <p className="font-black text-slate-700 uppercase text-sm tracking-wide">Music</p>
              <Switch defaultChecked />
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 rounded-xl p-3 text-sm font-medium">
                {error}
              </div>
            )}

            <div className="pt-2">
              <Button
                variant="primary"
                className="w-full text-base"
                onClick={handleContinue}
                disabled={isCreatingRoom}
              >
                {isCreatingRoom ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Creating Game...
                  </>
                ) : (
                  "Create Game"
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </DialogContent>
  );
}
