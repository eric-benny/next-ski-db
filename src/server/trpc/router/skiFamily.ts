import { router, publicProcedure } from "../trpc";
// import { z } from "zod";

export const skiFamilyRouter = router({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.skiFamily.findMany({
        include: {
            manufacturer: true
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
