import { router } from "../trpc";
import { authRouter } from "./auth";
import { questionsRouter } from "./questions";
import { answersRouter } from "./answers";

export const appRouter = router({
  auth: authRouter,
  questions: questionsRouter,
  answers: answersRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
