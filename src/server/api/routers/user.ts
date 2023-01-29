import { createTRPCRouter, publicProcedure } from "../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

export const userRouter = createTRPCRouter({
  getFavorites: publicProcedure.query(async ({ ctx }) => {
    const user = await ctx.prisma.user.findFirst({
      where: {
        id: ctx.session?.user?.id,
      },
      include: {
        favorites: {
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
            }
          },
        },
      },
    });
    return user ? user.favorites.map((f) => f.ski) : [];
  }),
  addFavorite: publicProcedure
    .input(z.object({ skiId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.session && ctx.session.user) {
        await ctx.prisma.skiFavorite.create({
          data: {
            userId: ctx.session.user.id,
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
  deleteFavorite: publicProcedure
    .input(z.object({ skiId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.session && ctx.session.user) {
        await ctx.prisma.skiFavorite.delete({
          where: {
            userId_skiId: {
              userId: ctx.session.user.id,
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
