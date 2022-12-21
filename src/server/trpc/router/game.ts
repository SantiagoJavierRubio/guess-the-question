import { router, publicProcedure } from "../trpc";
import { z } from "zod";
import { env } from "../../../env/server.mjs";

export const gameRouter = router({
  evaluateAnswer: publicProcedure
    .input(z.object({ answer: z.string(), originalQuestion: z.string() }))
    .mutation(async ({ ctx, input }) => {
        const score = await fetch(env.SS_API_URL, {
            method: "POST",
            body: JSON.stringify({
                authorization_token: env.SS_TOKEN,
                original: input.originalQuestion,
                answer: input.answer
            })
        })
        return score.json();
    })
});
