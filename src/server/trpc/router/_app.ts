import { router } from "../trpc";
import { authRouter } from "./auth";
import { questionsRouter } from "./questions";
import { answersRouter } from "./answers";
import { gameRouter } from "./game";

export const appRouter = router({
  auth: authRouter,
  questions: questionsRouter,
  answers: answersRouter,
  game: gameRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
