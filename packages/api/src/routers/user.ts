import { protectedProcedure, router } from "../index";
import { db } from "@wordsearch/db";
import { userStats } from "@wordsearch/db/schema/game-schema";
import { eq } from "drizzle-orm";

// Calculate league based on XP
function calculateLeague(xp: number): string {
  if (xp >= 1000) return "Gold";
  if (xp >= 500) return "Silver";
  return "Bronze";
}

export const userRouter = router({
  // Get the current user's stats using session
  getStats: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.userId;

    let stats = await db
      .select()
      .from(userStats)
      .where(eq(userStats.userId, userId))
      .limit(1);

    // If stats don't exist, create them automatically
    if (!stats.length) {
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

      stats = await db
        .select()
        .from(userStats)
        .where(eq(userStats.userId, userId))
        .limit(1);
    }

    const userStat = stats[0]!;
    
    return {
      ...userStat,
      league: calculateLeague(userStat.totalXp),
    };
  }),
});
