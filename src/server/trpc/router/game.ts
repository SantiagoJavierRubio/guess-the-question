import { router, publicProcedure } from "../trpc";
import { z } from "zod";
import { env } from "../../../env/server.mjs";

interface scoreResponse {
    score: number
}

function isCorrectScore(score: unknown): score is scoreResponse {
    return (typeof score === 'object' && typeof (score as scoreResponse).score === 'number')
}

export const gameRouter = router({
  evaluateAnswer: publicProcedure
    .input(z.object({ answer: z.string(), originalQuestion: z.string() }))
    .mutation(async ({ ctx, input }) => {
        const response = await fetch(env.SS_API_URL, {
            method: "POST",
            body: JSON.stringify({
                authorization_token: env.SS_TOKEN,
                original: input.originalQuestion,
                answer: input.answer
            })
        });
        const score = await response.json();
        if(isCorrectScore(score)) {
            return score.score * 100
        } else return 0
    })
});
