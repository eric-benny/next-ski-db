import { createTRPCRouter } from "./trpc";
import { exampleRouter } from "./routers/example";
import { skiRouter } from "./routers/ski";
import { manufacturerRouter } from "./routers/manufacturer";
import { skiFamilyRouter } from "./routers/skiFamily";
import { guideSkiRouter } from "./routers/guideSki";
import { userRouter } from "./routers/user";
import { noteRouter } from "./routers/note";
import { skiCompRouter } from "./routers/skiComp";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  ski: skiRouter,
  manufacturer: manufacturerRouter,
  skiFamily: skiFamilyRouter,
  guideSki: guideSkiRouter,
  user: userRouter,
  note: noteRouter,
  skiComp: skiCompRouter,
  example: exampleRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
