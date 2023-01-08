import { router, publicProcedure } from "../trpc";
import { z } from "zod";

const guideSkiUploadSchema = z.object({
  ski: z.string(),
  category: z.string(),
  year: z.number(),
  specLength: z.number(),
  summary: z.string().nullish(),
});

export const guideSkiRouter = router({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.guideSki.findMany({
      include: {
        ski: {
          include: {
            lengths: true,
            specs: true,
          },
        },
      },
    });
  }),
  getAllByYear: publicProcedure
    .input(z.object({ year: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.guideSki.findMany({
        where: {
          year: parseInt(input.year),
        },
        include: {
          ski: {
            include: {
              manufacturer: true,
              lengths: true,
              specs: true,
            },
          },
        },
      });
    }),
  create: publicProcedure
    .input(guideSkiUploadSchema)
    .mutation(async ({ ctx, input }) => {
      const newGuideSki = await ctx.prisma.guideSki.create({
        data: {
          year: input.year,
          category: input.category,
          specLength: input.specLength,
          summary: input.summary || "",
          skiId: input.ski,
        },
      });
      return newGuideSki;
    }),
  update: publicProcedure
    .input(
      z.object({
        guideSkiId: z.string(),
        summary: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const newGuideSki = await ctx.prisma.guideSki.update({
        where: {
          id: input.guideSkiId,
        },
        data: {
          summary: input.summary,
        },
      });
      return newGuideSki;
    }),
  delete: publicProcedure
    .input(
      z.object({
        guideSkiId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const newGuideSki = await ctx.prisma.guideSki.delete({
        where: {
          id: input.guideSkiId,
        },
      });
      return newGuideSki;
    }),
  //   getOne: publicProcedure
  //     .input(z.object({ skiId: z.string().nullish() }))
  //     .query(({ ctx, input }) => {
  //       if (input.skiId) {
  //         return ctx.prisma.ski.findFirst({
  //           where: {
  //             id: input.skiId,
  //           },
  //           include: {
  //             manufacturer: true,
  //             family: true,
  //             guideInfo: true,
  //             specs: true,
  //             lengths: true,
  //             predecessor: true,
  //           },
  //         });
  //       }
  //       return ctx.prisma.ski.findFirst({
  //         include: {
  //           manufacturer: true,
  //           family: true,
  //           guideInfo: true,
  //           specs: true,
  //           lengths: true,
  //           predecessor: true,
  //         },
  //       });
  //     }),
});
