import { githubRouter } from './github';
import { authRouter } from './auth';
import { router } from './trpc';

export const appRouter = router({
	github: githubRouter,
	auth: authRouter,
});

export type AppRouter = typeof appRouter;
