// src/server/trpc/router/_app.ts
import { router } from "../trpc";
import { exampleRouter } from "./example";
import { authRouter } from "./auth";
import { skiRouter } from "./ski";
import { manufacturerRouter } from "./manufacturer";
import { skiFamilyRouter } from "./skiFamily";
import { guideSkiRouter } from "./guideSki";

export const appRouter = router({
  ski: skiRouter,
  manufacturer: manufacturerRouter,
  skiFamily: skiFamilyRouter,
  guideSki: guideSkiRouter,
  example: exampleRouter,
  auth: authRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
