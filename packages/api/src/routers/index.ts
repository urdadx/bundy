import { publicProcedure, router } from "../index";

export const appRouter = router({
  healthCheck: publicProcedure.query(() => {
    return "OK";
  }),

  shitTest: publicProcedure.query(() => {
    return "SHITTT";
  }),


});
export type AppRouter = typeof appRouter;
