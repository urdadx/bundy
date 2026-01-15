import { BattleBanner } from "@/components/lesson-banner";
import { BattleMap } from "@/components/battle-map";
import { createFileRoute } from "@tanstack/react-router";
import { trpc } from "@/utils/trpc";
import { useQuery } from "@tanstack/react-query";
import { Loader } from "@/components/loader";

export const Route = createFileRoute("/arena/lessons/$lessonName/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { lessonName } = Route.useParams();

  const { data: stages, isLoading: stagesLoading } = useQuery(
    trpc.stages.getProgress.queryOptions({ worldId: lessonName }),
  );

  const { data: worldData, isLoading: worldLoading } = useQuery(
    trpc.worlds.getById.queryOptions({ id: lessonName }),
  );

  if (stagesLoading || worldLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen w-full">
        <Loader />
      </div>
    );
  }

  const dummyUnit = {
    id: worldData?.id || 1,
    name: worldData?.name || "Warrior of Words",
  };

  const lessons =
    stages?.map((s) => ({
      id: s.id,
      title: `Stage ${s.stageNumber}`,
      completed: s.completed,
      difficulty: s.difficulty,
    })) || [];

  const activeLesson = stages?.find((s) => !s.completed) || stages?.[0];

  return (
    <div className="flex w-full space-y-4 sm:space-y-0 flex-col gap-x-12">
      <div className=" w-full space-y-5">
        <BattleBanner
          name={worldData?.name || lessonName}
          description={worldData?.description ?? undefined}
          color={worldData?.color || "primary"}
          stageId={activeLesson?.id}
          order={worldData?.order}
        />

        <BattleMap
          unit={dummyUnit}
          lessons={lessons}
          activeLessonId={activeLesson?.id || ""}
          variant={(worldData?.color as any) || "primary"}
        />
      </div>
    </div>
  );
}
