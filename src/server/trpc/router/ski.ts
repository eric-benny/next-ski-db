import { router, publicProcedure } from "../trpc";
import { z } from "zod";

const skiSpecSchema = z.object({
  length: z.number(),
  measuredLength: z.number(),
  weightStated: z.union([z.number(), z.undefined()]),
  weightMeas: z.array(z.number()),
  dimTip: z.number(),
  dimWaist: z.number(),
  dimTail: z.number(),
  dimTipMeas: z.number(),
  dimWaistMeas: z.number(),
  dimTailMeas: z.number(),
  sidcutStated: z.union([z.number(), z.undefined()]),
  splayTip: z.union([z.number(), z.undefined()]),
  splayTail: z.union([z.number(), z.undefined()]),
  camberStated: z.union([z.string(), z.undefined()]),
  camberMeas: z.union([z.string(), z.undefined()]),
  core: z.union([z.string(), z.undefined()]),
  base: z.union([z.string(), z.undefined()]),
  mountPointFac: z.array(z.string()),
  mountPointBlist: z.array(z.string()),
  flexTip: z.union([z.string(), z.undefined()]),
  flexShovel: z.union([z.string(), z.undefined()]),
  flexFront: z.union([z.string(), z.undefined()]),
  flexFoot: z.union([z.string(), z.undefined()]),
  flexBack: z.union([z.string(), z.undefined()]),
  flexTail: z.union([z.string(), z.undefined()]),
});

const noteUploadSchema = z.object({
  user: z.string(),
  note: z.string(),
  lastUpdated: z.date(),
  skiDays: z.number(),
});

const skiUploadSchema = z.object({
  yearCurrent: z.number(),
  yearReleased: z.number(),
  yearsActive: z.array(z.number()),
  retired: z.boolean(),
  manufacturer: z.string(),
  model: z.string(),
  parent: z.union([z.string(), z.undefined()]),
  family: z.union([z.string(), z.undefined()]),
  lengths: z.array(z.number()),
  specs: z.array(skiSpecSchema),
  notes: z.array(noteUploadSchema).optional(),
  fullReview: z.string().optional(),
  firstLook: z.string().optional(),
  flashReview: z.string().optional(),
  deepDive: z.string().optional(),
});

export const skiRouter = router({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.ski.findMany({
      include: {
        manufacturer: true,
        family: true,
        guideInfo: true,
        specs: true,
        lengths: true,
      },
    });
  }),
  getOne: publicProcedure
    .input(z.object({ skiId: z.string().nullish() }))
    .query(({ ctx, input }) => {
      if (input.skiId) {
        return ctx.prisma.ski.findFirst({
          where: {
            id: input.skiId,
          },
          include: {
            manufacturer: true,
            family: true,
            guideInfo: true,
            specs: {
              include: {
                mountPointBlist: true,
                mountPointFac: true,
              },
            },
            lengths: true,
            predecessor: true,
          },
        });
      }
      return ctx.prisma.ski.findFirst({
        include: {
          manufacturer: true,
          family: true,
          guideInfo: true,
          specs: {
            include: {
              mountPointBlist: true,
              mountPointFac: true,
            },
          },
          lengths: true,
          predecessor: true,
        },
      });
    }),
  create: publicProcedure
    .input(skiUploadSchema)
    .mutation(async ({ ctx, input }) => {
      const newSki = await ctx.prisma.ski.create({
        data: {
          yearCurrent: input.yearCurrent,
          yearReleased: input.yearReleased,
          retired: false,
          manufacturerId: input.manufacturer,
          model: input.model,
          predecessorId: input.parent,
          familyId: input.family,
          fullReview: input.fullReview,
          firstLook: input.firstLook,
          flashReview: input.flashReview,
          deepDive: input.deepDive,
          lengths: {
            create: [
              ...input.lengths.map(l => ({
                length: l
              }))
            ]
          },
          specs: {
            create: [
              ...input.specs.map((spec) => ({
                length: spec.length,
                measuredLength: spec.measuredLength,
                weightStated: spec.weightStated,
                weightMeas1: spec.weightMeas[0],
                weightMeas2: spec.weightMeas[1],
                dimTip: spec.dimTip,
                dimWaist: spec.dimWaist,
                dimTail: spec.dimTail,
                dimTipMeas: spec.dimTipMeas,
                dimWaistMeas: spec.dimWaistMeas,
                dimTailMeas: spec.dimTailMeas,
                sidcutStated: spec.sidcutStated,
                splayTip: spec.splayTip,
                splayTail: spec.splayTail,
                camberStated: spec.camberStated,
                camberMeas: spec.camberMeas,
                core: spec.core,
                base: spec.base,
                flexTip: spec.flexTip,
                flexShovel: spec.flexShovel,
                flexFront: spec.flexFront,
                flexFoot: spec.flexFoot,
                flexBack: spec.flexBack,
                flexTail: spec.flexTail,
                mountPointFac: {
                  create: [
                    ...spec.mountPointFac.map((mpf) => ({
                      description: mpf,
                    })),
                  ],
                },
                mountPointBlist: {
                  create: [
                    ...spec.mountPointBlist.map((mpb) => ({
                      description: mpb,
                    })),
                  ],
                },
              })),
            ],
          },
        },
        include: {
          lengths: true,
          specs: {
            include: {
              mountPointFac: true,
              mountPointBlist: true,
            },
          },
        },
      });

      // for (const spec of input.specs) {
      //   const newSpec = await ctx.prisma.skiSpec.create({
      //     data: {
      //       length: spec.length,
      //       measuredLength: spec.measuredLength,
      //       weightStated: spec.weightStated,
      //       weightMeas1: spec.weightMeas[0],
      //       weightMeas2: spec.weightMeas[1],
      //       dimTip: spec.dimTip,
      //       dimWaist: spec.dimWaist,
      //       dimTail: spec.dimTail,
      //       dimTipMeas: spec.dimTipMeas,
      //       dimWaistMeas: spec.dimWaistMeas,
      //       dimTailMeas: spec.dimTailMeas,
      //       sidcutStated: spec.sidcutStated,
      //       splayTip: spec.splayTip,
      //       splayTail: spec.splayTail,
      //       camberStated: spec.camberStated,
      //       camberMeas: spec.camberMeas,
      //       core: spec.core,
      //       base: spec.base,
      //       flexTip: spec.flexTip,
      //       flexShovel: spec.flexShovel,
      //       flexFront: spec.flexFront,
      //       flexFoot: spec.flexFoot,
      //       flexBack: spec.flexBack,
      //       flexTail: spec.flexTail,
      //       skiId: newSki.id,
      //     },
      //   });

      //   for (const mpf of spec.mountPointFac) {
      //     const newMpf = await ctx.prisma.mountPointFac.create({
      //       data: {
      //         description: mpf,
      //         specId: newSpec.id,
      //       },
      //     });
      //   }

      //   for (const mpb of spec.mountPointBlist) {
      //     const newMpb = await ctx.prisma.mountPointBlist.create({
      //       data: {
      //         description: mpb,
      //         specId: newSpec.id,
      //       },
      //     });
      //   }
      // }
      return newSki;
    }),
  update: publicProcedure
    .input(
      z.object({
        skiId: z.string(),
        ski: skiUploadSchema,
      })
    )
    .mutation(async ({ ctx, input }) => {
      const newSki = await ctx.prisma.ski.update({
        where: {
          id: input.skiId,
        },
        data: {
          yearCurrent: input.ski.yearCurrent,
          yearReleased: input.ski.yearReleased,
          retired: false,
          manufacturerId: input.ski.manufacturer,
          model: input.ski.model,
          predecessorId: input.ski.parent,
          familyId: input.ski.family,
          fullReview: input.ski.fullReview,
          firstLook: input.ski.firstLook,
          flashReview: input.ski.flashReview,
          deepDive: input.ski.deepDive,
        },
      });

      await ctx.prisma.skiLength.deleteMany({
        where: {
          skiId: newSki.id,
        },
      });

      for (const l of input.ski.lengths) {
        await ctx.prisma.skiLength.create({
          data: {
            length: l,
            skiId: newSki.id,
          },
        });
      }

      for (const spec of input.ski.specs) {
        const newSpec = await ctx.prisma.skiSpec.upsert({
          where: {
            unique_spec: { skiId: input.skiId, length: spec.length },
          },
          update: {
            length: spec.length,
            measuredLength: spec.measuredLength,
            weightStated: spec.weightStated,
            weightMeas1: spec.weightMeas[0],
            weightMeas2: spec.weightMeas[1],
            dimTip: spec.dimTip,
            dimWaist: spec.dimWaist,
            dimTail: spec.dimTail,
            dimTipMeas: spec.dimTipMeas,
            dimWaistMeas: spec.dimWaistMeas,
            dimTailMeas: spec.dimTailMeas,
            sidcutStated: spec.sidcutStated,
            splayTip: spec.splayTip,
            splayTail: spec.splayTail,
            camberStated: spec.camberStated,
            camberMeas: spec.camberMeas,
            core: spec.core,
            base: spec.base,
            flexTip: spec.flexTip,
            flexShovel: spec.flexShovel,
            flexFront: spec.flexFront,
            flexFoot: spec.flexFoot,
            flexBack: spec.flexBack,
            flexTail: spec.flexTail,
            skiId: newSki.id,
          },
          create: {
            length: spec.length,
            measuredLength: spec.measuredLength,
            weightStated: spec.weightStated,
            weightMeas1: spec.weightMeas[0],
            weightMeas2: spec.weightMeas[1],
            dimTip: spec.dimTip,
            dimWaist: spec.dimWaist,
            dimTail: spec.dimTail,
            dimTipMeas: spec.dimTipMeas,
            dimWaistMeas: spec.dimWaistMeas,
            dimTailMeas: spec.dimTailMeas,
            sidcutStated: spec.sidcutStated,
            splayTip: spec.splayTip,
            splayTail: spec.splayTail,
            camberStated: spec.camberStated,
            camberMeas: spec.camberMeas,
            core: spec.core,
            base: spec.base,
            flexTip: spec.flexTip,
            flexShovel: spec.flexShovel,
            flexFront: spec.flexFront,
            flexFoot: spec.flexFoot,
            flexBack: spec.flexBack,
            flexTail: spec.flexTail,
            skiId: newSki.id,
          },
        });

        await ctx.prisma.mountPointFac.deleteMany({
          where: {
            specId: newSpec.id,
          },
        });

        for (const mpf of spec.mountPointFac) {
          await ctx.prisma.mountPointFac.create({
            data: {
              description: mpf,
              specId: newSpec.id,
            },
          });
        }

        await ctx.prisma.mountPointBlist.deleteMany({
          where: {
            specId: newSpec.id,
          },
        });

        for (const mpb of spec.mountPointBlist) {
          await ctx.prisma.mountPointBlist.create({
            data: {
              description: mpb,
              specId: newSpec.id,
            },
          });
        }
      }
      return newSki;
    }),
});
