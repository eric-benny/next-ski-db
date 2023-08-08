import { createTRPCRouter, privateProcedure, publicProcedure } from "../trpc";
import { z } from "zod";

const noteUploadSchema = z.object({
  user: z.string(),
  note: z.string(),
  lastUpdated: z.date(),
  skiDays: z.number(),
  skiId: z.string(),
});

const sampleNote = {
  id: "abc123",
  note: "This is a versitile ski",
  lastUpdated: "2023-04-23T18:25:43.511Z",
  skiDays: 5,
  userId: "user123",
  skiId: ""
}

export const noteRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const data = await ctx.prisma.note.findMany({});
    if (!ctx.userId) {
      return [sampleNote]
    }
    return data;
  }),
  create: privateProcedure
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
  update: privateProcedure
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
