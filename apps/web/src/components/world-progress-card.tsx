import { Button } from "@/components/ui/button";
import { ProgressBar } from "./progress-bar";
import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
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

const WORLD_COLORS: Record<string, string> = {
  meadow: "#58cc02",
  relic: "#ce82ff",
  volcano: "#ff4b4b",
  cyber: "#1cb0f6",
  void: "#6b7280",
  malyka: "#ffc800",
};

export function WorldProgressCard() {
  const { data: worlds, isLoading: worldsLoading } = useQuery(trpc.worlds.getAll.queryOptions());
  const { data: stats, isLoading: statsLoading } = useQuery(trpc.user.getStats.queryOptions());

  if (worldsLoading || statsLoading) {
    return (
      <div className="flex items-center justify-center w-full min-h-screen">
        <Loader />
      </div>
    );
  }

  if (!worlds?.length) {
    return null;
  }

  const userXp = stats?.totalXp || 0;

  return (
    <div className="flex flex-col gap-6">
      {worlds.map((world, index) => {
        const planetImage = WORLD_IMAGES[world.id] || planet01;
        const bgColor = WORLD_COLORS[world.id] || "#1cb0f6";
        const isLocked = userXp < world.requiredXp;

        let progress = 0;
        const nextWorld = worlds[index + 1];

        if (userXp >= (nextWorld?.requiredXp ?? Infinity)) {
          progress = 100;
        } else if (userXp < world.requiredXp) {
          progress = 0;
        } else if (nextWorld) {
          const range = nextWorld.requiredXp - world.requiredXp;
          const earned = userXp - world.requiredXp;
          progress = Math.min(100, Math.max(0, (earned / range) * 100));
        } else {
          // Last world
          progress = userXp >= world.requiredXp ? 100 : 0;
        }

        return (
          <div
            key={world.id}
            className={`relative overflow-hidden rounded-3xl p-4 text-white sm:p-6 transition-all ${isLocked ? "opacity-70 grayscale" : ""}`}
            style={{ backgroundColor: isLocked ? "#94a3b8" : bgColor }}
          >
            <div className="absolute right-0 top-0 h-full w-1/2 bg-white/10 [clip-path:polygon(20%_0%,100%_0%,100%_100%,0%_100%)]" />

            <div className="relative z-10 flex flex-col gap-6">
              <div>
                <span className="rounded-lg bg-black/20 px-3 py-1 text-xs font-black uppercase tracking-wider">
                  {world.theme}
                </span>
                <h2 className="mt-3 text-lg font-black uppercase tracking-tight sm:text-xl">
                  {world.name}
                </h2>
              </div>

              <div className="flex max-w-80 items-center gap-2">
                <div className="relative h-6 w-full overflow-hidden">
                  <ProgressBar
                    value={progress}
                    color="bg-white"
                    className="h-5 border-0 shadow-none"
                  />
                </div>
                <span className="font-black text-sm">{Math.round(progress)}%</span>
              </div>

              <div className="w-full sm:w-64">
                {isLocked ? (
                  <Button
                    size="default"
                    variant="secondary"
                    disabled
                    className="w-full rounded-2xl bg-white/50 cursor-not-allowed border-transparent text-slate-500"
                  >
                    <span className="text-lg font-black uppercase tracking-widest">🔒 Locked</span>
                  </Button>
                ) : (
                  <Link to="/arena/lessons/$lessonName" params={{ lessonName: world.id }}>
                    <Button
                      size="default"
                      variant="secondary"
                      className="w-full rounded-2xl bg-white hover:bg-slate-50 border-slate-200 active:border-b-0 active:translate-y-1"
                      style={{ color: bgColor }}
                      asChild
                    >
                      <span className="text-lg font-black uppercase tracking-widest">
                        {progress === 100 ? "Completed" : "Continue"}
                      </span>
                    </Button>
                  </Link>
                )}
              </div>
            </div>

            <div className="absolute right-4 top-1/2 -translate-y-1/2 hidden h-48 w-48 lg:flex items-center justify-center z-20">
              <div className={isLocked ? "grayscale opacity-50" : ""}>
                <img
                  src={planetImage}
                  alt={world.name}
                  className="w-full h-full object-contain"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
