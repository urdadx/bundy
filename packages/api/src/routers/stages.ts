import { publicProcedure, protectedProcedure, router } from "../index";
import { db } from "@wordsearch/db";
import {
  stage,
  userStats,
  stageProgress,
  worldProgress,
  world,
} from "@wordsearch/db/schema/game-schema";
import { eq, asc, and, sql } from "drizzle-orm";
import { z } from "zod";

export const stagesRouter = router({
  getByWorldId: publicProcedure
    .input(z.object({ worldId: z.string() }))
    .query(async ({ input }) => {
      const stages = await db
        .select()
        .from(stage)
        .where(eq(stage.worldId, input.worldId))
        .orderBy(asc(stage.stageNumber));

      return stages;
    }),

  getById: publicProcedure.input(z.object({ id: z.string() })).query(async ({ input }) => {
    const stageData = await db.select().from(stage).where(eq(stage.id, input.id)).limit(1);

    if (!stageData.length) {
      throw new Error("Stage not found");
    }

    return stageData[0];
  }),

  // Get stage progress for a user - uses session to get userId
  getProgress: protectedProcedure
    .input(z.object({ worldId: z.string() }))
    .query(async ({ input, ctx }) => {
      const userId = ctx.userId;

      // Get all stages for this world
      const stages = await db
        .select()
        .from(stage)
        .where(eq(stage.worldId, input.worldId))
        .orderBy(asc(stage.stageNumber));

      // Get user's progress for all stages in this world
      const progressRecords = await db
        .select()
        .from(stageProgress)
        .where(eq(stageProgress.userId, userId));

      // Create a map for quick lookup
      const progressMap = new Map(progressRecords.map((p) => [p.stageId, p]));

      // Merge stages with their progress
      return stages.map((s) => ({
        ...s,
        completed: progressMap.get(s.id)?.isCompleted ?? false,
        stars: progressMap.get(s.id)?.stars ?? 0,
        bestTime: progressMap.get(s.id)?.bestTime ?? null,
        attempts: progressMap.get(s.id)?.attempts ?? 0,
      }));
    }),

  completeStage: protectedProcedure
    .input(
      z.object({
        stageId: z.string(),
        completionTime: z.number(),
        stars: z.number().min(0).max(3).default(3),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.userId;

      const stageData = await db.select().from(stage).where(eq(stage.id, input.stageId)).limit(1);

      if (!stageData.length) {
        throw new Error("Stage not found");
      }

      const currentStage = stageData[0]!;

      let userStatsData = await db
        .select()
        .from(userStats)
        .where(eq(userStats.userId, userId))
        .limit(1);

      if (!userStatsData.length) {
        await db.insert(userStats).values({
          id: `stats-${userId}`,
          userId: userId,
          totalXp: 10,
          diamonds: 0,
          currentWorldId: "meadow",
          gamesPlayed: 0,
          gamesWon: 0,
          gamesLost: 0,
        });

        userStatsData = await db
          .select()
          .from(userStats)
          .where(eq(userStats.userId, userId))
          .limit(1);
      }

      const currentUserStats = userStatsData[0]!;

      // Check if this stage was already completed to avoid double rewards
      const existingProgress = await db
        .select()
        .from(stageProgress)
        .where(and(eq(stageProgress.userId, userId), eq(stageProgress.stageId, input.stageId)))
        .limit(1);

      const isFirstCompletion = !existingProgress.length || !existingProgress[0]!.isCompleted;

      // Only award XP and diamonds on first completion
      if (isFirstCompletion) {
        await db
          .update(userStats)
          .set({
            totalXp: sql`${userStats.totalXp} + ${currentStage.xpReward}`,
            diamonds: sql`${userStats.diamonds} + ${currentStage.diamondReward}`,
            gamesPlayed: sql`${userStats.gamesPlayed} + 1`,
            gamesWon: sql`${userStats.gamesWon} + 1`,
            updatedAt: new Date(),
          })
          .where(eq(userStats.id, currentUserStats.id));
      } else {
        // Just update games played for replays
        await db
          .update(userStats)
          .set({
            gamesPlayed: sql`${userStats.gamesPlayed} + 1`,
            updatedAt: new Date(),
          })
          .where(eq(userStats.id, currentUserStats.id));
      }

      // Update or create stage progress
      if (existingProgress.length > 0) {
        await db
          .update(stageProgress)
          .set({
            isCompleted: true,
            stars: Math.max(existingProgress[0]!.stars, input.stars),
            bestTime: existingProgress[0]!.bestTime
              ? Math.min(existingProgress[0]!.bestTime, input.completionTime)
              : input.completionTime,
            attempts: sql`${stageProgress.attempts} + 1`,
            updatedAt: new Date(),
          })
          .where(eq(stageProgress.id, existingProgress[0]!.id));
      } else {
        await db.insert(stageProgress).values({
          id: `progress-${userId}-${input.stageId}`,
          userId: userId,
          stageId: input.stageId,
          isCompleted: true,
          stars: input.stars,
          bestTime: input.completionTime,
          attempts: 1,
        });
      }

      // Update world progress (only increment if first completion)
      if (isFirstCompletion) {
        const worldProgressData = await db
          .select()
          .from(worldProgress)
          .where(
            and(eq(worldProgress.userId, userId), eq(worldProgress.worldId, currentStage.worldId)),
          )
          .limit(1);

        if (worldProgressData.length > 0) {
          const currentWorldProgress = worldProgressData[0]!;
          await db
            .update(worldProgress)
            .set({
              completedStages: sql`${worldProgress.completedStages} + 1`,
              totalStars: sql`${worldProgress.totalStars} + ${input.stars}`,
              isCompleted: sql`${worldProgress.completedStages} + 1 >= 5`,
              updatedAt: new Date(),
            })
            .where(eq(worldProgress.id, currentWorldProgress.id));
        } else {
          await db.insert(worldProgress).values({
            id: `world-progress-${userId}-${currentStage.worldId}`,
            userId: userId,
            worldId: currentStage.worldId,
            isUnlocked: true,
            isCompleted: false,
            completedStages: 1,
            totalStars: input.stars,
          });
        }
      }

      // Get the next stage in the world
      const allStagesInWorld = await db
        .select()
        .from(stage)
        .where(eq(stage.worldId, currentStage.worldId))
        .orderBy(asc(stage.stageNumber));

      const currentStageIndex = allStagesInWorld.findIndex((s) => s.id === input.stageId);
      const nextStage = allStagesInWorld[currentStageIndex + 1] || null;

      // If we completed the last stage in the world, unlock the next world
      if (!nextStage && isFirstCompletion) {
        const allWorlds = await db.select().from(world).orderBy(asc(world.order));

        const currentWorldIndex = allWorlds.findIndex((w) => w.id === currentStage.worldId);
        const nextWorld = allWorlds[currentWorldIndex + 1] || null;

        if (nextWorld) {
          const nextWorldProgress = await db
            .select()
            .from(worldProgress)
            .where(and(eq(worldProgress.userId, userId), eq(worldProgress.worldId, nextWorld.id)))
            .limit(1);

          if (!nextWorldProgress.length) {
            await db.insert(worldProgress).values({
              id: `world-progress-${userId}-${nextWorld.id}`,
              userId: userId,
              worldId: nextWorld.id,
              isUnlocked: true,
              isCompleted: false,
              completedStages: 0,
              totalStars: 0,
            });
          }
        }
      }

      // Return the updated stats and next stage info
      const updatedStats = await db
        .select()
        .from(userStats)
        .where(eq(userStats.id, currentUserStats.id))
        .limit(1);

      return {
        xpEarned: isFirstCompletion ? currentStage.xpReward : 0,
        diamondsEarned: isFirstCompletion ? currentStage.diamondReward : 0,
        totalXp: updatedStats[0]!.totalXp,
        totalDiamonds: updatedStats[0]!.diamonds,
        nextStage: nextStage,
        completedWorld: !nextStage,
        isFirstCompletion,
      };
    }),
});
