import { router, publicProcedure } from "../trpc";
import { z } from "zod";

export const manufacturerRouter = router({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.manufacturer.findMany({});
  }),
  create: publicProcedure
    .input(z.object({ name: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const newManufacturer = await ctx.prisma.manufacturer.create({
        data: {
          name: input.name,
        },
      });
      return newManufacturer;
    }),
});
