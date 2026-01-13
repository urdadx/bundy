import { useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Lightbulb, Flag, Settings } from "lucide-react";
import { toast } from "sonner";
import { ResignDialog } from "@/components/resign-dialog";
import { GameSettingsUI } from "../game-settings-ui";
import { Dialog, DialogTrigger } from "../ui/dialog";
import { useNavigate } from "@tanstack/react-router";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import jerryLaughing from "@/assets/jerry-laughing.gif";

interface Player {
  name: string;
  avatar?: string;
  score?: number;
  rating?: number;
  isCurrentTurn?: boolean;
}

interface PlaygroundLayoutProps {
  children: ReactNode;
  player1: Player;
  player2: Player;
  timer?: ReactNode;
  rightPanel?: ReactNode;
  className?: string;
}

export function PlaygroundLayout({ children, rightPanel, className }: PlaygroundLayoutProps) {
  return (
    <div className={cn("min-h-screen w-full bg-slate-50", className)}>
      <div className="flex justify-center items-start w-full min-h-screen py-6 px-4">
        <div className="flex gap-4 max-w-7xl w-full">
          <div className="flex-3 flex flex-col items-center gap-3">
            <div className="shrink-0">{children}</div>
          </div>
          <div className="hidden lg:flex flex-2 flex-col gap-3">{rightPanel}</div>
        </div>
      </div>
    </div>
  );
}

export function GameInfoPanel({
  children,
  title,
  headerRight,
  className,
}: {
  children: ReactNode;
  title?: string;
  headerRight?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "bg-white w-full border-2 border-b-4 border-slate-200 rounded-xl overflow-hidden",
        className,
      )}
    >
      {title && (
        <div className="px-4 py-3 bg-slate-50 border-b-2 border-slate-200 flex justify-between items-center">
          <h3 className="text-slate-600 font-bold text-sm uppercase tracking-wide">{title}</h3>
          {headerRight && <div className="text-slate-600 text-sm font-medium">{headerRight}</div>}
        </div>
      )}
      <div className="p-3">{children}</div>
    </div>
  );
}

export function WordListPanel({ words, foundWords }: { words: string[]; foundWords: Set<string> }) {
  return (
    <GameInfoPanel
      title="Words to Find"
      headerRight={
        <span>
          <span className="text-[#58cc02] font-bold">{foundWords.size}</span> / {words.length}
        </span>
      }
    >
      <div className="flex flex-wrap gap-2">
        {words.map((word) => (
          <span
            key={word}
            className={cn(
              "px-3 py-1.5 rounded-xl text-sm font-bold uppercase transition-all border-2 border-b-4",
              foundWords.has(word)
                ? "bg-[#d7ffb8] text-[#58cc02] border-[#58cc02] line-through"
                : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50",
            )}
          >
            {word}
          </span>
        ))}
      </div>
    </GameInfoPanel>
  );
}

interface GameActionsPanelProps {
  diamonds?: number;
  foundWords?: Set<string>;
  placedWords?: Array<{
    word: string;
    start: { r: number; c: number };
    end: { r: number; c: number };
  }>;
  onDiamondsChange?: (newDiamonds: number) => void;
  onRequestHint?: () => void;
  canUseHint?: boolean;
}

function HintButton({
  onRequestHint,
  canUseHint,
}: {
  onRequestHint?: () => void;
  canUseHint?: boolean;
}) {
  const handleHintClick = () => {
    if (onRequestHint) {
      onRequestHint();
    } else {
      toast.info("You need atleast 5 diamonds to use a hint!");
    }
  };

  const button = (
    <Button
      className="w-full"
      onClick={handleHintClick}
      variant="primary"
      disabled={canUseHint === false}
    >
      Hint
      <Lightbulb className="h-5 w-5 ml-1" />
    </Button>
  );

  if (canUseHint === false) {
    return (
      <Tooltip>
        <TooltipTrigger>{button}</TooltipTrigger>
        <TooltipContent className="bg-white border text-base border-slate-200 shadow-md text-black p-2">
          <p>You need atleast 5 diamonds to use hint</p>
        </TooltipContent>
      </Tooltip>
    );
  }

  return button;
}

export function GameActionsPanel({ onRequestHint, canUseHint }: GameActionsPanelProps = {}) {
  const [showResignDialog, setShowResignDialog] = useState(false);
  const navigate = useNavigate();

  return (
    <GameInfoPanel>
      <div className="flex flex-col sm:flex-row gap-2">
        <HintButton onRequestHint={onRequestHint} canUseHint={canUseHint} />
        <Button className="w-full" onClick={() => setShowResignDialog(true)} variant="highlight">
          Resign <Flag className="h-5 w-5 ml-1" />
        </Button>
        <Dialog>
          <DialogTrigger>
            <Button className="w-full" variant="super">
              Settings <Settings className="h-5 w-5 ml-1" />
            </Button>
          </DialogTrigger>
          <GameSettingsUI />
        </Dialog>
      </div>
      <ResignDialog
        open={showResignDialog}
        onOpenChange={setShowResignDialog}
        onConfirm={() => {
          setShowResignDialog(false);
          navigate({
            to: "/arena/lessons",
          });
        }}
      />
    </GameInfoPanel>
  );
}

export function GameActionsPanelMultiplayer({ onResign }: { onResign?: () => void }) {
  const [showResignDialog, setShowResignDialog] = useState(false);

  return (
    <GameInfoPanel>
      <div className="flex flex-col sm:flex-row gap-2">
        <Popover>
          <PopoverTrigger>
            <Button className="w-full" variant="primary">
              Hint
              <Lightbulb className="h-5 w-5 ml-1" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-60 p-0">
            <img
              src={jerryLaughing}
              alt="Jerry laughing"
              loading="lazy"
              className="w-full h-50 rounded"
            />
            <p className="text-center text-base uppercase font-bold pb-2">
              You can't use hint in multiplayer mode
            </p>
          </PopoverContent>
        </Popover>
        <Button className="w-full" variant="highlight" onClick={() => setShowResignDialog(true)}>
          Resign <Flag className="h-5 w-5 ml-1" />
        </Button>
        <Dialog>
          <DialogTrigger>
            <Button className="w-full" variant="super">
              Settings <Settings className="h-5 w-5 ml-1" />
            </Button>
          </DialogTrigger>
          <GameSettingsUI />
        </Dialog>
      </div>

      <ResignDialog
        open={showResignDialog}
        onOpenChange={setShowResignDialog}
        onConfirm={() => {
          setShowResignDialog(false);
          onResign?.();
        }}
      />
    </GameInfoPanel>
  );
}
