import { createTRPCRouter, privateProcedure } from "../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

export const userRouter = createTRPCRouter({
  getFavorites: privateProcedure.query(async ({ ctx }) => {
    if (ctx.userId) {
      const favorites = await ctx.prisma.skiFavorite.findMany({
        where: {
          userId: ctx.userId,
        },
        include: {
          ski: {
            include: {
              manufacturer: true,
              family: true,
              guideInfo: true,
              specs: true,
              lengths: true,
              predecessor: true,
            },
          },
        },
      });
      return favorites.map((f) => f.ski);
    }
    return [];
  }),
  addFavorite: privateProcedure
    .input(z.object({ skiId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.userId) {
        await ctx.prisma.skiFavorite.create({
          data: {
            userId: ctx.userId,
            skiId: input.skiId,
          },
        });
      } else {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "No valid user found",
        });
      }
      return;
    }),
  deleteFavorite: privateProcedure
    .input(z.object({ skiId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.userId) {
        await ctx.prisma.skiFavorite.delete({
          where: {
            userId_skiId: {
              userId: ctx.userId,
              skiId: input.skiId,
            },
          },
        });
      } else {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "No valid user found",
        });
      }
      return;
    }),
});
