import { protectedProcedure, router } from "../index";
import { db } from "@wordsearch/db";
import { userStats } from "@wordsearch/db/schema/game-schema";
import { user } from "@wordsearch/db/schema/auth";
import { eq } from "drizzle-orm";
import { z } from "zod";

const VALID_AVATARS = ["jack-avatar.png", "marie-avatar.png", "rudeus-avatar.png"] as const;

function calculateLeague(xp: number): string {
  if (xp >= 600) return "Gold";
  if (xp >= 300) return "Silver";
  return "Bronze";
}

export const userRouter = router({
  getStats: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.userId;

    let stats = await db
      .select()
      .from(userStats)
      .where(eq(userStats.userId, userId))
      .limit(1);

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
    .input(z.object({
      avatar: z.enum(VALID_AVATARS),
    }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.userId;

      await db
        .update(user)
        .set({ avatar: input.avatar })
        .where(eq(user.id, userId));

      return { success: true, avatar: input.avatar };
    }),

  updateName: protectedProcedure
    .input(z.object({
      name: z.string().min(1).max(50),
    }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.userId;

      await db
        .update(user)
        .set({ name: input.name })
        .where(eq(user.id, userId));

      return { success: true, name: input.name };
    }),
});
