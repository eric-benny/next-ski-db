import { createTRPCRouter, publicProcedure } from "../trpc";
import { z } from "zod";

// const noteUploadSchema = z.object({
//   user: z.string(),
//   note: z.string(),
//   lastUpdated: z.date(),
//   skiDays: z.number(),
//   skiId: z.string(),
// });

const sampleComp = {
  id: "abc",
  primarySkiId: "62f1c0d7e6d3d09c9c24ba8e",
  primarySki: {
    id: "62f1c0d7e6d3d09c9c24ba8e",
    yearCurrent: 2022,
    yearReleased: 2019,
    retired: false,
    manufacturerId: "abc123",
    model: "Sample Ski",
    predecessorId: null,
    familyId: null,
    fullReview:
      "",
    firstLook: "",
    flashReview:
      "",
    deepDive:
      "",
    predecessor: null,
  },
  secondarySkiId: "abc123",
  secondarySki: {
    id: "abc123",
    yearCurrent: 2022,
    yearReleased: 2019,
    retired: false,
    manufacturerId: "abc123",
    model: "Sample Ski 100",
    predecessorId: null,
    familyId: null,
    fullReview: "",
    firstLook: "",
    flashReview: "",
    deepDive: "null",
    predecessor: null,
  },
  comps: [
    {
      id: "abc123",
      attribute: "Stability",
      quantifier: -1,
      skiCompId: "abc123",
    },
    {
      id: "abc234",
      attribute: "Edge Hold",
      quantifier: 0,
      skiCompId: "abc234",
    },
    {
      id: "abc456",
      attribute: "Float",
      quantifier: 1,
      skiCompId: "abc456",
    },
  ],
};

export const skiCompRouter = createTRPCRouter({
  getForSki: publicProcedure
    .input(z.object({ skiId: z.string() }))
    .query(async ({ ctx, input }) => {
      const data = await ctx.prisma.skiComp.findMany({
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
      if (!ctx.userId) {
        const sample = sampleComp;
        sample.primarySki.id = input.skiId;
        sample.primarySkiId = input.skiId;
        return [sample];
      } else {
        return data;
      }
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
