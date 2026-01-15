import { betterAuth, type BetterAuthOptions } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { anonymous } from "better-auth/plugins";
import { env } from "@wordsearch/env/server";
import { db } from "@wordsearch/db";
import * as schema from "@wordsearch/db/schema/auth";
import { gameSession, leaderboard, stageProgress, userInventory, userStats, worldProgress } from "@wordsearch/db/schema/game-schema";
import { eq, and } from "drizzle-orm";

const options = {
  database: drizzleAdapter(db, {
    provider: "sqlite",
    schema: schema,
  }),
  trustedOrigins: [env.CORS_ORIGIN],
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    },
  },
  advanced: {
    defaultCookieAttributes: {
      sameSite: "none",
      secure: true,
      httpOnly: true,
    },
  },
  plugins: [
    anonymous({
      emailDomainName: "guest.wordsearch.local",
      // Migrate data from anonymous account to new google account
      onLinkAccount: async ({ anonymousUser, newUser }) => {
        try {
          console.log("Linking anonymous account:", anonymousUser.user.id, "to new user:", newUser.user.id);
        
          const anonymousUserId = anonymousUser.user.id;
          const newUserId = newUser.user.id;
          
          const anonymousStats = await db.select().from(userStats).where(eq(userStats.userId, anonymousUserId)).limit(1);
          
          if (anonymousStats.length > 0) {
            const existingNewUserStats = await db.select().from(userStats).where(eq(userStats.userId, newUserId)).limit(1);
            
            if (existingNewUserStats.length === 0) {
              await db.insert(userStats).values({
                id: crypto.randomUUID(),
                userId: newUserId,
                totalXp: anonymousStats[0]?.totalXp ?? 0,
                diamonds: anonymousStats[0]?.diamonds ?? 0,
                currentWorldId: anonymousStats[0]?.currentWorldId ?? "meadow",
                gamesPlayed: anonymousStats[0]?.gamesPlayed ?? 0,
                gamesWon: anonymousStats[0]?.gamesWon ?? 0,
                gamesLost: anonymousStats[0]?.gamesLost ?? 0,
                totalPlayTime: anonymousStats[0]?.totalPlayTime ?? 0,
                isOnline: anonymousStats[0]?.isOnline ?? false,
              });
              console.log("Migrated user stats from anonymous to new user");
            } else {
              await db.update(userStats)
                .set({
                  totalXp: (existingNewUserStats[0]?.totalXp ?? 0) + (anonymousStats[0]?.totalXp ?? 0),
                  diamonds: (existingNewUserStats[0]?.diamonds ?? 0) + (anonymousStats[0]?.diamonds ?? 0),
                  gamesPlayed: (existingNewUserStats[0]?.gamesPlayed ?? 0) + (anonymousStats[0]?.gamesPlayed ?? 0),
                  gamesWon: (existingNewUserStats[0]?.gamesWon ?? 0) + (anonymousStats[0]?.gamesWon ?? 0),
                  gamesLost: (existingNewUserStats[0]?.gamesLost ?? 0) + (anonymousStats[0]?.gamesLost ?? 0),
                  totalPlayTime: (existingNewUserStats[0]?.totalPlayTime ?? 0) + (anonymousStats[0]?.totalPlayTime ?? 0),
                  updatedAt: new Date(),
                })
                .where(eq(userStats.userId, newUserId));
              console.log("Merged user stats from anonymous to new user");
            }
          }
          
          const anonymousWorldProgress = await db.select().from(worldProgress).where(eq(worldProgress.userId, anonymousUserId));
          
          for (const worldProg of anonymousWorldProgress) {
            const existingWorldProgress = await db.select()
              .from(worldProgress)
              .where(and(
                eq(worldProgress.userId, newUserId),
                eq(worldProgress.worldId, worldProg.worldId!)
              ))
              .limit(1);
            
            if (existingWorldProgress.length === 0) {
              await db.insert(worldProgress).values({
                id: crypto.randomUUID(),
                userId: newUserId,
                worldId: worldProg.worldId!,
                isUnlocked: worldProg.isUnlocked ?? false,
                isCompleted: worldProg.isCompleted ?? false,
                completedStages: worldProg.completedStages ?? 0,
                totalStars: worldProg.totalStars ?? 0,
                bestTime: worldProg.bestTime,
              });
            } else {
              await db.update(worldProgress)
                .set({
                  isUnlocked: (existingWorldProgress[0]?.isUnlocked ?? false) || (worldProg.isUnlocked ?? false),
                  isCompleted: (existingWorldProgress[0]?.isCompleted ?? false) || (worldProg.isCompleted ?? false),
                  completedStages: Math.max(existingWorldProgress[0]?.completedStages ?? 0, worldProg.completedStages ?? 0),
                  totalStars: (existingWorldProgress[0]?.totalStars ?? 0) + (worldProg.totalStars ?? 0),
                  bestTime: existingWorldProgress[0]?.bestTime && worldProg.bestTime 
                    ? Math.min(existingWorldProgress[0].bestTime, worldProg.bestTime)
                    : existingWorldProgress[0]?.bestTime || worldProg.bestTime,
                  updatedAt: new Date(),
                })
                .where(and(
                  eq(worldProgress.userId, newUserId),
                  eq(worldProgress.worldId, worldProg.worldId!)
                ));
            }
          }
          console.log(`Migrated ${anonymousWorldProgress.length} world progress records`);
          
          const anonymousStageProgress = await db.select().from(stageProgress).where(eq(stageProgress.userId, anonymousUserId));
          
          for (const stageProg of anonymousStageProgress) {
            const existingStageProgress = await db.select()
              .from(stageProgress)
              .where(and(
                eq(stageProgress.userId, newUserId),
                eq(stageProgress.stageId, stageProg.stageId!)
              ))
              .limit(1);
            
            if (existingStageProgress.length === 0) {
              await db.insert(stageProgress).values({
                id: crypto.randomUUID(),
                userId: newUserId,
                stageId: stageProg.stageId!,
                isCompleted: stageProg.isCompleted ?? false,
                stars: stageProg.stars ?? 0,
                bestTime: stageProg.bestTime,
                attempts: stageProg.attempts ?? 0,
              });
            } else {
              await db.update(stageProgress)
                .set({
                  isCompleted: (existingStageProgress[0]?.isCompleted ?? false) || (stageProg.isCompleted ?? false),
                  stars: Math.max(existingStageProgress[0]?.stars ?? 0, stageProg.stars ?? 0),
                  bestTime: existingStageProgress[0]?.bestTime && stageProg.bestTime
                    ? Math.min(existingStageProgress[0].bestTime, stageProg.bestTime)
                    : existingStageProgress[0]?.bestTime || stageProg.bestTime,
                  attempts: (existingStageProgress[0]?.attempts ?? 0) + (stageProg.attempts ?? 0),
                  updatedAt: new Date(),
                })
                .where(and(
                  eq(stageProgress.userId, newUserId),
                  eq(stageProgress.stageId, stageProg.stageId!)
                ));
            }
          }
          console.log(`Migrated ${anonymousStageProgress.length} stage progress records`);
          
          const anonymousGameSessions = await db.select().from(gameSession).where(eq(gameSession.userId, anonymousUserId));
          
          for (const session of anonymousGameSessions) {
            await db.insert(gameSession).values({
              id: crypto.randomUUID(),
              userId: newUserId,
              stageId: session.stageId!,
              startedAt: session.startedAt,
              completedAt: session.completedAt,
              timeElapsed: session.timeElapsed,
              wordsFound: session.wordsFound ?? 0,
              totalWords: session.totalWords ?? 0,
              xpEarned: session.xpEarned ?? 0,
              diamondsEarned: session.diamondsEarned ?? 0,
              stars: session.stars ?? 0,
              isCompleted: session.isCompleted ?? false,
            });
          }
          console.log(`Migrated ${anonymousGameSessions.length} game session records`);
          
          const anonymousInventory = await db.select().from(userInventory).where(eq(userInventory.userId, anonymousUserId));
          
          for (const item of anonymousInventory) {
            const existingInventoryItem = await db.select()
              .from(userInventory)
              .where(and(
                eq(userInventory.userId, newUserId),
                eq(userInventory.itemId, item.itemId!)
              ))
              .limit(1);
            
            if (existingInventoryItem.length === 0) {
              await db.insert(userInventory).values({
                id: crypto.randomUUID(),
                userId: newUserId,
                itemId: item.itemId!,
                purchasedAt: item.purchasedAt,
                isEquipped: item.isEquipped ?? false,
              });
            } else {
              await db.update(userInventory)
                .set({
                  isEquipped: (existingInventoryItem[0]?.isEquipped ?? false) || (item.isEquipped ?? false),
                  updatedAt: new Date(),
                })
                .where(and(
                  eq(userInventory.userId, newUserId),
                  eq(userInventory.itemId, item.itemId!)
                ));
            }
          }
          console.log(`Migrated ${anonymousInventory.length} inventory items`);
          
          const anonymousLeaderboard = await db.select().from(leaderboard).where(eq(leaderboard.userId, anonymousUserId)).limit(1);
          
          if (anonymousLeaderboard.length > 0) {
            const newLeaderboardEntry = await db.select().from(leaderboard).where(eq(leaderboard.userId, newUserId)).limit(1);
            
            const updatedStats = await db.select().from(userStats).where(eq(userStats.userId, newUserId)).limit(1);
            
            if (newLeaderboardEntry.length === 0 && updatedStats.length > 0) {
              await db.insert(leaderboard).values({
                id: crypto.randomUUID(),
                userId: newUserId,
                rank: 0, 
                diamonds: updatedStats[0]?.diamonds ?? 0,
                totalXp: updatedStats[0]?.totalXp ?? 0,
                gamesWon: updatedStats[0]?.gamesWon ?? 0,
                lastUpdated: new Date(),
              });
            } else if (newLeaderboardEntry.length > 0 && updatedStats.length > 0) {
              await db.update(leaderboard)
                .set({
                  diamonds: updatedStats[0]?.diamonds ?? 0,
                  totalXp: updatedStats[0]?.totalXp ?? 0,
                  gamesWon: updatedStats[0]?.gamesWon ?? 0,
                  lastUpdated: new Date(),
                  updatedAt: new Date(),
                })
                .where(eq(leaderboard.userId, newUserId));
            }
          }
          
          console.log("Data migration completed successfully");
          
        } catch (error) {
          console.error("Error during account linking data migration:", error);
          
        }
      },
    }),
  ],
} satisfies BetterAuthOptions;

export const auth = betterAuth(options);

export type Auth = typeof auth;
