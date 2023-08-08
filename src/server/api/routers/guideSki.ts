import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
  reviewerProcedure,
} from "../trpc";
import { z } from "zod";

const guideSkiUploadSchema = z.object({
  ski: z.string(),
  category: z.string(),
  year: z.number(),
  specLength: z.number(),
  summary: z.string().nullish(),
});

const sampleSummary = "Sample buyer's guide description about the ski";

export const guideSkiRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const data = await ctx.prisma.guideSki.findMany({
      include: {
        ski: {
          include: {
            lengths: true,
            specs: true,
          },
        },
      },
    });
    if (!ctx.userId) {
      const samples = data.map((s) => {
        return { ...s, summary: sampleSummary };
      });
      return samples;
    }
    return data;
  }),
  getAllByYear: publicProcedure
    .input(z.object({ year: z.string() }))
    .query(async ({ ctx, input }) => {
      const data = await ctx.prisma.guideSki.findMany({
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
      if (!ctx.userId) {
        const samples = data.map((s) => {
          return { ...s, summary: sampleSummary };
        });
        return samples;
      }
      return data;
    }),
  getBySki: publicProcedure
    .input(z.object({ skiId: z.string() }))
    .query(async ({ ctx, input }) => {
      const data = await ctx.prisma.guideSki.findMany({
        where: {
          skiId: input.skiId,
        },
        include: {
          ski: {
            include: {
              lengths: true,
              specs: true,
            },
          },
        },
      });
      if (!ctx.userId) {
        const samples = data.map((s) => {
          return { ...s, summary: sampleSummary };
        });
        return samples;
      }
      return data;
    }),
  create: reviewerProcedure
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
  update: reviewerProcedure
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
  delete: reviewerProcedure
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
