import { useNavigate, useSearch } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { GameCard } from "./game-card";
import { trpc } from "@/utils/trpc";
import { Loader } from "./loader";

import planet01 from "@/assets/planets/planet01.png";
import planet02 from "@/assets/planets/planet02.png";
import planet03 from "@/assets/planets/planet03.png";
import planet04 from "@/assets/planets/planet04.png";
import planet05 from "@/assets/planets/planet05.png";
import planet06 from "@/assets/planets/planet06.png";

const WORLD_IMAGES: Record<string, string> = {
  meadow: planet01,
  relic: planet02,
  volcano: planet06,
  cyber: planet04,
  void: planet05,
  malyka: planet03,
};

export function WorldSelector() {
  const navigate = useNavigate({ from: "/worlds" });
  const { world: selectedWorld } = useSearch({ from: "/worlds" });

  const {
    data: worlds,
    isLoading: worldsLoading,
    error: worldsError,
  } = useQuery(trpc.worlds.getAll.queryOptions());
  const { data: stats, isLoading: statsLoading } = useQuery(trpc.user.getStats.queryOptions());

  const handleSelect = (id: string, isLocked: boolean) => {
    if (isLocked) return;
    navigate({
      search: (prev) => ({
        ...prev,
        world: id,
      }),
    });
  };

  const handleContinue = () => {
    if (selectedWorld) {
      navigate({
        to: "/arena/lessons/$lessonName",
        params: { lessonName: selectedWorld },
      });
    }
  };

  const isLoading = worldsLoading || statsLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader />
      </div>
    );
  }

  if (worldsError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500 text-lg">Failed to load worlds</p>
      </div>
    );
  }

  const userXp = stats?.totalXp || 0;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full max-w-xl mx-auto p-4">
      <h1 className="text-3xl font-black text-slate-700 mb-8 uppercase tracking-widest">Worlds</h1>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 w-full place-items-center">
        {worlds?.map((world) => {
          const isSelected = selectedWorld === world.id;
          const isLocked = userXp < world.requiredXp;
          const planetImage = WORLD_IMAGES[world.id] || planet01;

          return (
            <div key={world.id} className="relative group w-full max-w-50">
              <div
                className={cn(
                  "absolute -top-3 left-1/2 -translate-x-1/2 z-10 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter border-2 transition-all",
                  isLocked
                    ? "bg-slate-100 border-slate-200 text-slate-400"
                    : isSelected
                      ? "bg-green-500 border-green-600 text-white"
                      : "bg-white border-slate-200 text-slate-400",
                )}
              >
                {isLocked ? "🔒 Locked" : `World ${world.order}`}
              </div>

              <GameCard
                depth={isSelected ? "4" : "8"}
                onClick={() => handleSelect(world.id, isLocked)}
                className={cn(
                  "cursor-pointer flex  flex-col items-center justify-center gap-4 transition-all hover:bg-slate-50 active:translate-y-1 active:border-b-4",
                  isSelected && "border-green-500 ring-2 ring-green-500/20 bg-green-50",
                  isLocked &&
                    "grayscale cursor-not-allowed hover:bg-white active:translate-y-0 active:border-b-8",
                )}
              >
                <img
                  src={planetImage}
                  alt={world.name}
                  className={cn(
                    "w-24 h-24 drop-shadow-md select-none object-cover",
                    isLocked && "grayscale",
                  )}
                  loading="lazy"
                />

                <span
                  className={cn(
                    "text-sm font-black uppercase tracking-widest transition-colors",
                    isLocked ? "text-slate-400" : isSelected ? "text-green-600" : "text-slate-500",
                  )}
                >
                  {world.name}
                </span>
              </GameCard>
            </div>
          );
        })}
      </div>

      <div className="mt-12 w-full max-w-md">
        <Button
          variant="super"
          size="lg"
          className="w-full text-xl h-16 shadow-xl"
          disabled={!selectedWorld}
          onClick={handleContinue}
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
