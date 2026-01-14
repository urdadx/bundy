import { publicProcedure, router } from "../index";
import { worldsRouter } from "./worlds";
import { userRouter } from "./user";
import { stagesRouter } from "./stages";
import { shopRouter } from "./shop";

export const appRouter = router({
  healthCheck: publicProcedure.query(() => {
    return "OK";
  }),

  worlds: worldsRouter,
  user: userRouter,
  stages: stagesRouter,
  shop: shopRouter,
});
export type AppRouter = typeof appRouter;
