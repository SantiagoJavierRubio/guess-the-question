import { z } from "zod";

import { router, publicProcedure } from "../trpc";

export const answersRouter = router({
  create: publicProcedure
    .input(z.object({ text: z.string(), questionId: z.string() }))
    .mutation(async ({ ctx, input }) => {
        const answer = await ctx.prisma.answer.create({
            data: {
                text: input.text,
                authorId: ctx.session?.user?.id,
                questionId: input.questionId
            }
        })
    return answer;
  }),
  getByQuestionId: publicProcedure
    .input(z.object({ id: z.string(), ammount: z.number().nullish(), cursor: z.string().nullish() }))
    .query(async ({ ctx, input}) => {
        const answer = await ctx.prisma.answer.findMany({
            where: {
                questionId: input.id
            },
            take: (input.ammount || 3),
            skip: input.cursor ? 1 : 0,
            cursor: input.cursor ? { id: input.cursor } : undefined,
            orderBy: {
                id: 'asc'
            }
        })
        return answer;
    })
});
