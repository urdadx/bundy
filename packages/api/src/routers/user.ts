import { protectedProcedure, router } from "../index";
import { db } from "@wordsearch/db";
import { userStats, worldProgress } from "@wordsearch/db/schema/game-schema";
import { user } from "@wordsearch/db/schema/auth";
import { eq, desc, asc, gt, sql } from "drizzle-orm";
import { z } from "zod";

const VALID_AVATARS = ["jack-avatar.png", "marie-avatar.png", "rudeus-avatar.png"] as const;

function calculateLeague(xp: number): string {
  if (xp >= 500) return "Gold";
  if (xp >= 300) return "Silver";
  return "Bronze";
}

export const userRouter = router({
  getStats: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.userId;

    let stats = await db.select().from(userStats).where(eq(userStats.userId, userId)).limit(1);

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

      stats = await db.select().from(userStats).where(eq(userStats.userId, userId)).limit(1);
    }

    const userStat = stats[0]!;

    return {
      ...userStat,
      league: calculateLeague(userStat.totalXp),
    };
  }),

  getWorldProgress: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.userId;

    const progress = await db
      .select({
        worldId: worldProgress.worldId,
        isUnlocked: worldProgress.isUnlocked,
        isCompleted: worldProgress.isCompleted,
        completedStages: worldProgress.completedStages,
      })
      .from(worldProgress)
      .where(eq(worldProgress.userId, userId));

    return progress;
  }),

  getProfile: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.userId;

    const userData = await db
      .select({
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
        avatar: user.avatar,
        isAnonymous: user.isAnonymous,
      })
      .from(user)
      .where(eq(user.id, userId))
      .limit(1);

    if (!userData.length) {
      return null;
    }

    return userData[0];
  }),

  updateAvatar: protectedProcedure
    .input(
      z.object({
        avatar: z.enum(VALID_AVATARS),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.userId;

      await db.update(user).set({ avatar: input.avatar }).where(eq(user.id, userId));

      return { success: true, avatar: input.avatar };
    }),

  updateName: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1).max(50),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.userId;

      await db.update(user).set({ name: input.name }).where(eq(user.id, userId));

      return { success: true, name: input.name };
    }),

  updateDiamonds: protectedProcedure
    .input(
      z.object({
        diamonds: z.number(),
        operation: z.enum(["add", "subtract", "set"]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.userId;

      // Get current user stats
      const currentStats = await db
        .select()
        .from(userStats)
        .where(eq(userStats.userId, userId))
        .limit(1);

      if (!currentStats.length) {
        throw new Error("User stats not found");
      }

      const currentDiamonds = currentStats[0]!.diamonds;
      let newDiamonds: number;

      switch (input.operation) {
        case "add":
          newDiamonds = currentDiamonds + input.diamonds;
          break;
        case "subtract":
          newDiamonds = Math.max(0, currentDiamonds - input.diamonds); // Don't go below 0
          break;
        case "set":
          newDiamonds = input.diamonds;
          break;
      }

      await db.update(userStats).set({ diamonds: newDiamonds }).where(eq(userStats.userId, userId));

      return { success: true, diamonds: newDiamonds };
    }),

  getUserRank: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.userId;

    const userXpQuery = await db
      .select({ totalXp: userStats.totalXp })
      .from(userStats)
      .where(eq(userStats.userId, userId))
      .limit(1);

    if (!userXpQuery.length) {
      return { rank: null, totalUsers: 0 };
    }

    const userXp = userXpQuery[0]!.totalXp;

    // Count users with higher XP
    const usersWithHigherXp = await db
      .select({ count: sql<number>`COUNT(*)`.as('count') })
      .from(userStats)
      .where(gt(userStats.totalXp, userXp));

    const totalUsersQuery = await db
      .select({ count: sql<number>`COUNT(*)`.as('count') })
      .from(userStats);

    const rank = (usersWithHigherXp[0]?.count ?? 0) + 1;
    const totalUsers = totalUsersQuery[0]?.count ?? 0;

    return { rank, totalUsers };
  }),

  getLeaderboard: protectedProcedure
    .input(
      z.object({
        cursor: z.number().optional().default(0),
        limit: z.number().default(10),
      }),
    )
    .query(async ({ input }) => {
      const { cursor, limit } = input;

      const results = await db
        .select({
          id: user.id,
          username: user.name,
          avatar: user.avatar,
          xp: userStats.totalXp,
          isOnline: userStats.isOnline,
        })
        .from(userStats)
        .innerJoin(user, eq(userStats.userId, user.id))
        .orderBy(desc(userStats.totalXp), asc(user.id))
        .limit(limit + 1)
        .offset(cursor);

      const hasNextPage = results.length > limit;
      const items = results.slice(0, limit);
      const nextCursor = hasNextPage ? cursor + limit : null;

      return {
        items,
        nextCursor,
      };
    }),
});
