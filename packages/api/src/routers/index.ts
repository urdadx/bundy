import { publicProcedure, router } from "../index";
import { worldsRouter } from "./worlds";
import { userRouter } from "./user";
import { stagesRouter } from "./stages";

export const appRouter = router({
  healthCheck: publicProcedure.query(() => {
    return "OK";
  }),

  shitTest: publicProcedure.query(() => {
    return "SHITTT";
  }),

  worlds: worldsRouter,
  user: userRouter,
  stages: stagesRouter,
});
export type AppRouter = typeof appRouter;
