// src/server/trpc/router/_app.ts
import { router } from "../trpc";
import { exampleRouter } from "./example";
import { authRouter } from "./auth";
import { skiRouter } from "./ski";
import { manufacturerRouter } from "./manufacturer";
import { skiFamilyRouter } from "./skiFamily";

export const appRouter = router({
  ski: skiRouter,
  manufacturer: manufacturerRouter,
  skiFamily: skiFamilyRouter,
  example: exampleRouter,
  auth: authRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
