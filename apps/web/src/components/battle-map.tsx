import type { ComponentProps } from "react";
import { LearnButton } from "./duolingo-buttons";

type UnitProps = {
  unit: any;
  lessons: (any & { id: string; completed: boolean })[];
  activeLessonId: string;
  variant?: ComponentProps<typeof LearnButton>["variant"];
};

export function BattleMap({ variant = "primary", lessons, activeLessonId }: UnitProps) {
  const getStageTitle = (stageId: string): string => {
    const worldStageMap: Record<string, string[]> = {
      meadow: [
        "Animal Safari Begins",
        "Wildlife Encounter",
        "Savanna Challenge",
        "Jungle Expedition",
        "King of the Beasts",
      ],
      relic: [
        "Culinary Discovery",
        "Feast of Legends",
        "Kitchen Conquest",
        "Grand Banquet",
        "Master Chef",
      ],
      volcano: [
        "Molecular Adventure",
        "Laboratory Trials",
        "Energy Experiment",
        "Quantum Challenge",
        "Scientific Mastery",
      ],
      cyber: [
        "Digital Lexicon",
        "Code of Words",
        "Vocabulary Quest",
        "Linguistic Matrix",
        "Language Overlord",
      ],
      void: [
        "Athletic Debut",
        "Sports Training",
        "Championship Heat",
        "Final Tournament",
        "Ultimate Champion",
      ],
      malyka: [
        "World Explorer",
        "Global Journey",
        "Cultural Discovery",
        "International Trek",
        "World Traveler",
      ],
    };

    for (const [world, titles] of Object.entries(worldStageMap)) {
      if (stageId.startsWith(world)) {
        const stageNumber = parseInt(stageId.split("-")[1]) - 1;
        return titles[stageNumber] || "Unknown Stage";
      }
    }
    return "The Great Battle of Words";
  };

  return (
    <section className="space-y-10 py-10">
      <ul className="flex flex-col items-center">
        {lessons.map(({ id, completed }, idx, _lessons) => {
          return (
            <li key={id}>
              <LearnButton
                id={id}
                index={idx}
                totalCount={_lessons.length}
                title={getStageTitle(id)}
                current={id === activeLessonId}
                completed={completed}
                variant={variant}
              />
            </li>
          );
        })}
      </ul>
    </section>
  );
}
