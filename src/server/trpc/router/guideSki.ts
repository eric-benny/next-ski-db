import { router, publicProcedure } from "../trpc";
import { z } from "zod";

export const guideSkiRouter = router({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.guideSki.findMany({
        include: {
            ski: {
                include: {
                    lengths: true,
                    specs: true
                }
            }
        }
    });
  }),
  getAllByYear: publicProcedure
  .input(z.object({ year: z.string() }))
  .query(({ ctx, input }) => {
    return ctx.prisma.guideSki.findMany({
        where: {
            year: parseInt(input.year)
        },
        include: {
            ski: {
                include: {
                    manufacturer: true,
                    lengths: true,
                    specs: true
                }
            }
        }
    });
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
