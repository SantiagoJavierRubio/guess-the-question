import { z } from "zod";

import { router, publicProcedure } from "../trpc";

export const questionsRouter = router({
  create: publicProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
        const q = await ctx.prisma.question.create({
            data: {
                text: input,
                authorId: ctx.session?.user?.id
            }
        })
    return q;
  }),
  getAll: publicProcedure.query(async ({ ctx }) => {
    return ctx.prisma.question.findMany();
  }),
  getRandomQuestion: publicProcedure
  .input(z.object({ avoid: z.array(z.string()).nullish() }))
    .query(async ({ ctx, input }) => {
        const qSum = await ctx.prisma.question.count();
        const skip = Math.floor(Math.random() * qSum)
        const q = await ctx.prisma.question.findMany({
            where: {
                NOT: {
                    authorId: ctx.session?.user?.id,
                    id: {
                        in: input.avoid || []
                    },
                    answers: { none: {} }
                },
            },
            skip: skip
        })
        return q[0];
    }),
  getRandomQuestions: publicProcedure
    .input(z.object({ ammount: z.number().optional(), avoid: z.array(z.string()).nullish() }))
    .query(async ({ ctx, input }) => {
        const qSum = await ctx.prisma.question.count();
        const skip = Math.floor(Math.random() * qSum)
        const q = await ctx.prisma.question.findMany({
            where: {
                NOT: {
                    authorId: ctx.session?.user?.id,
                    id: {
                        in: input.avoid || []
                    }
                }
            },
            take: input.ammount || 5,
            skip: skip
        })
        return q;
    })
});
