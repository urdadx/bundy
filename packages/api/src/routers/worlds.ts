import { publicProcedure, router } from "../index";
import { db } from "@wordsearch/db";
import { world, stage } from "@wordsearch/db/schema/game-schema";
import { eq, asc } from "drizzle-orm";
import { z } from "zod";

export const worldsRouter = router({
  // Get all worlds with their stages
  getAll: publicProcedure.query(async () => {
    const worlds = await db.select().from(world).orderBy(asc(world.order));

    return worlds;
  }),

  // Get a single world by ID with its stages
  getById: publicProcedure.input(z.object({ id: z.string() })).query(async ({ input }) => {
    const worldData = await db.select().from(world).where(eq(world.id, input.id)).limit(1);

    if (!worldData.length) {
      throw new Error("World not found");
    }

    const stages = await db
      .select()
      .from(stage)
      .where(eq(stage.worldId, input.id))
      .orderBy(asc(stage.stageNumber));

    return {
      ...worldData[0],
      stages,
    };
  }),

  // Get stages for a specific world
  getStages: publicProcedure.input(z.object({ worldId: z.string() })).query(async ({ input }) => {
    const stages = await db
      .select()
      .from(stage)
      .where(eq(stage.worldId, input.worldId))
      .orderBy(asc(stage.stageNumber));

    return stages;
  }),
});
