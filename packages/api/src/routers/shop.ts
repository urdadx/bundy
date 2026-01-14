import { protectedProcedure, router } from "../index";
import { db } from "@wordsearch/db";
import { shopItem, userInventory, userStats } from "@wordsearch/db/schema/game-schema";
import { eq, and, sql } from "drizzle-orm";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

export const shopRouter = router({
  getItems: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.userId;

    const items = await db.select().from(shopItem).where(eq(shopItem.isAvailable, true)).orderBy(shopItem.sortOrder);

    const userItems = await db.select().from(userInventory).where(eq(userInventory.userId, userId));
    const ownedItemIds = new Set(userItems.map(item => item.itemId));

    const itemsWithOwnership = items.map(item => ({
      ...item,
      image: item.image.startsWith('/rewards/') 
        ? item.image 
        : item.image,
      isOwned: ownedItemIds.has(item.id),
    }));

    return itemsWithOwnership;
  }),

  getInventory: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.userId;

    const inventory = await db
      .select({
        id: userInventory.id,
        purchasedAt: userInventory.purchasedAt,
        isEquipped: userInventory.isEquipped,
        item: {
          id: shopItem.id,
          name: shopItem.name,
          description: shopItem.description,
          image: shopItem.image,
          category: shopItem.category,
        },
      })
      .from(userInventory)
      .innerJoin(shopItem, eq(userInventory.itemId, shopItem.id))
      .where(eq(userInventory.userId, userId))
      .orderBy(userInventory.purchasedAt);

    return inventory;
  }),

  buyItem: protectedProcedure
    .input(
      z.object({
        itemId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.userId;
      const { itemId } = input;

      return await db.transaction(async (tx) => {
        const item = await tx.select().from(shopItem).where(eq(shopItem.id, itemId)).limit(1);
        
        if (!item.length) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Item not found",
          });
        }

        const shopItemData = item[0]!;
        if (!shopItemData.isAvailable) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Item is not available",
          });
        }

        // Check if user already owns this item
        const existingInventory = await tx
          .select()
          .from(userInventory)
          .where(and(eq(userInventory.userId, userId), eq(userInventory.itemId, itemId)))
          .limit(1);

        if (existingInventory.length > 0) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "You already own this item",
          });
        }

        const userStatsData = await tx
          .select()
          .from(userStats)
          .where(eq(userStats.userId, userId))
          .limit(1);

        if (!userStatsData.length) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "User stats not found",
          });
        }

        const currentDiamonds = userStatsData[0]!.diamonds;
        if (currentDiamonds < shopItemData.price) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Insufficient diamonds",
          });
        }

        // Deduct diamonds from user stats
        await tx
          .update(userStats)
          .set({ diamonds: currentDiamonds - shopItemData.price })
          .where(eq(userStats.userId, userId));

        // Add item to user inventory
        await tx.insert(userInventory).values({
          id: `inventory-${userId}-${itemId}-${Date.now()}`,
          userId: userId,
          itemId: itemId,
          purchasedAt: new Date(),
        });

        return {
          success: true,
          item: shopItemData,
          newBalance: currentDiamonds - shopItemData.price,
        };
      });
    }),

  // Equip an item (for cosmetic items like avatars, themes, etc.)
  equipItem: protectedProcedure
    .input(
      z.object({
        itemId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.userId;
      const { itemId } = input;

      // Check if user owns the item
      const inventoryItem = await db
        .select()
        .from(userInventory)
        .where(and(eq(userInventory.userId, userId), eq(userInventory.itemId, itemId)))
        .limit(1);

      if (!inventoryItem.length) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "You don't own this item",
        });
      }

      const item = await db.select().from(shopItem).where(eq(shopItem.id, itemId)).limit(1);
      
      if (!item.length) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Item not found",
        });
      }

      const itemData = item[0]!;
      if (itemData.category !== "cosmetic") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Only cosmetic items can be equipped",
        });
      }

      await db
        .update(userInventory)
        .set({ isEquipped: false })
        .where(
          and(
            eq(userInventory.userId, userId),
            sql`${userInventory.itemId} IN (SELECT id FROM shop_item WHERE category = ${itemData.category})`
          )
        );

      await db
        .update(userInventory)
        .set({ isEquipped: true })
        .where(and(eq(userInventory.userId, userId), eq(userInventory.itemId, itemId)));

      return {
        success: true,
        equippedItem: itemData,
      };
    }),

  unequipItem: protectedProcedure
    .input(
      z.object({
        itemId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.userId;
      const { itemId } = input;

      // Check if user owns the item and it's equipped
      const inventoryItem = await db
        .select()
        .from(userInventory)
        .where(
          and(
            eq(userInventory.userId, userId),
            eq(userInventory.itemId, itemId),
            eq(userInventory.isEquipped, true)
          )
        )
        .limit(1);

      if (!inventoryItem.length) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Item is not equipped or not owned",
        });
      }

      await db
        .update(userInventory)
        .set({ isEquipped: false })
        .where(and(eq(userInventory.userId, userId), eq(userInventory.itemId, itemId)));

      return {
        success: true,
      };
    }),
});