import { createTRPCRouter, publicProcedure, reviewerProcedure } from "../trpc";
import { z } from "zod";

export const manufacturerRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.manufacturer.findMany({});
  }),
  create: reviewerProcedure
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
