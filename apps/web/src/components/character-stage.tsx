import { Button } from "./ui/button";
import { GameCard } from "./game-card";
import { cn } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import femaleIdle from "@/assets/characters/female-idle.png";
import maleIdle from "@/assets/characters/male-idle.png";

const CharacterStage = ({
  selectedCharacter,
  setSelectedCharacter,
  handleSubmitGuest,
  handleBackToName,
  isLoading,
}: {
  selectedCharacter: "male" | "female" | null;
  setSelectedCharacter: (char: "male" | "female") => void;
  handleSubmitGuest: () => void;
  handleBackToName: () => void;
  isLoading: boolean;
}) => (
  <div className="flex flex-col justify-center px-1">
    <div className="grid grid-cols-2 gap-4 mb-4">
      <GameCard
        depth="4"
        onClick={() => setSelectedCharacter("female")}
        className={cn(
          "cursor-pointer flex flex-col items-center justify-center gap-2 p-2 transition-all hover:bg-slate-50 active:translate-y-1 active:border-b-4",
          selectedCharacter === "female" &&
            "border-green-500 ring-2 ring-green-500/20 bg-green-50/30",
        )}
      >
        <img
          src={femaleIdle}
          alt="Female Character"
          className="w-16 h-16 object-contain drop-shadow-sm"
        />
        <span
          className={cn(
            "text-xs font-bold uppercase tracking-wider",
            selectedCharacter === "female" ? "text-green-600" : "text-slate-500",
          )}
        >
          Beth
        </span>
      </GameCard>

      <GameCard
        depth={selectedCharacter === "male" ? "4" : "4"}
        onClick={() => setSelectedCharacter("male")}
        className={cn(
          "cursor-pointer flex flex-col items-center justify-center gap-2 p-2 transition-all hover:bg-slate-50 active:translate-y-1 active:border-b-4",
          selectedCharacter === "male" &&
            "border-green-500 ring-2 ring-green-500/20 bg-green-50/30",
        )}
      >
        <img
          src={maleIdle}
          alt="Male Character"
          className="w-16 h-16 object-contain drop-shadow-sm"
        />
        <span
          className={cn(
            "text-xs font-bold uppercase tracking-wider",
            selectedCharacter === "male" ? "text-green-600" : "text-slate-500",
          )}
        >
          Kael
        </span>
      </GameCard>
    </div>

    <div className="flex flex-col gap-2">
      <Button
        variant="primary"
        onClick={handleSubmitGuest}
        disabled={isLoading || !selectedCharacter}
        className="w-full"
      >
        {isLoading ? "Creating..." : "Play"}
      </Button>
      <Button variant="ghost" className="w-full text-slate-500" onClick={handleBackToName}>
        <ArrowLeft className="w-4 h-4 mr-1" />
        Back
      </Button>
    </div>
  </div>
);

export { CharacterStage };
