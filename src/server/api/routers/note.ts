import { createTRPCRouter, publicProcedure } from "../trpc";
import { z } from "zod";

const noteUploadSchema = z.object({
  user: z.string(),
  note: z.string(),
  lastUpdated: z.date(),
  skiDays: z.number(),
  skiId: z.string(),
});

export const noteRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.note.findMany({});
  }),
  create: publicProcedure
    .input(noteUploadSchema)
    .mutation(async ({ ctx, input }) => {
      const newNote = await ctx.prisma.note.create({
        data: {
          note: input.note,
          lastUpdated: input.lastUpdated,
          skiDays: input.skiDays,
          userId: input.user,
          skiId: input.skiId,
        },
      });
      return newNote;
    }),
  update: publicProcedure
    .input(z.object({ noteId: z.string(), note: noteUploadSchema }))
    .mutation(async ({ ctx, input }) => {
      const newNote = await ctx.prisma.note.update({
        where: {
          id: input.noteId
        },
        data: {
          note: input.note.note,
          lastUpdated: input.note.lastUpdated,
          skiDays: input.note.skiDays,
          userId: input.note.user,
          skiId: input.note.skiId,
        },
      });
      return newNote;
    }),
});
