import { db } from "./index";
import { world, stage } from "./schema/game-schema";

async function verify() {
  console.log("🔍 Verifying seeded data...\n");

  // Check worlds
  const worlds = await db.select().from(world);
  console.log("📍 Worlds:");
  worlds.forEach((w) => {
    console.log(
      `   ${w.order}. ${w.name} (${w.id}) - Theme: ${w.theme}, Required XP: ${w.requiredXp}`,
    );
  });

  // Check stages
  console.log("\n🎯 Meadow Stages:");
  const stages = await db
    .select()
    .from(stage)
    .where((t) => t.worldId === "meadow");
  stages.forEach((s) => {
    console.log(
      `   Stage ${s.stageNumber}: ${s.difficulty.toUpperCase().padEnd(6)} | Grid: ${s.gridSize}x${s.gridSize} | Words: ${s.wordCount} | Time: ${Math.floor(s.timeLimit / 60)}min | Rewards: ${s.xpReward}XP, ${s.diamondReward}💎`,
    );
  });

  console.log("\n✅ Verification complete!");
}

verify()
  .catch((error) => {
    console.error("❌ Verification failed:", error);
    process.exit(1);
  })
  .finally(() => {
    process.exit(0);
  });
