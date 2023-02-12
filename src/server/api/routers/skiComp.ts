import { createTRPCRouter, publicProcedure } from "../trpc";
import { z } from "zod";

// const noteUploadSchema = z.object({
//   user: z.string(),
//   note: z.string(),
//   lastUpdated: z.date(),
//   skiDays: z.number(),
//   skiId: z.string(),
// });

export const skiCompRouter = createTRPCRouter({
  getForSki: publicProcedure
    .input(z.object({ skiId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.skiComp.findMany({
        where: {
          OR: [
            {
              primarySkiId: input.skiId,
            },
            {
              secondarySkiId: input.skiId,
            },
          ],
        },
        include: {
          comps: true,
          primarySki: true,
          secondarySki: true,
        },
      });
    }),
  // create: publicProcedure
  //   .input(noteUploadSchema)
  //   .mutation(async ({ ctx, input }) => {
  //     const newNote = await ctx.prisma.note.create({
  //       data: {
  //         note: input.note,
  //         lastUpdated: input.lastUpdated,
  //         skiDays: input.skiDays,
  //         userId: input.user,
  //         skiId: input.skiId,
  //       },
  //     });
  //     return newNote;
  //   }),
  // update: publicProcedure
  //   .input(z.object({ noteId: z.string(), note: noteUploadSchema }))
  //   .mutation(async ({ ctx, input }) => {
  //     const newNote = await ctx.prisma.note.update({
  //       where: {
  //         id: input.noteId
  //       },
  //       data: {
  //         note: input.note.note,
  //         lastUpdated: input.note.lastUpdated,
  //         skiDays: input.note.skiDays,
  //         userId: input.note.user,
  //         skiId: input.note.skiId,
  //       },
  //     });
  //     return newNote;
  //   }),
});
