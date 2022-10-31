import { router, publicProcedure } from "../trpc";
import { z } from "zod";

export const skiRouter = router({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.ski.findMany(
      {
        include: {
          manufacturer: true,
          family: true,
          guideInfo: true
        },
      }
    );
  }),
});
