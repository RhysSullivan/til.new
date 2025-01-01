import { authProcedure, router } from './trpc';
import { listReposWithFiles } from '@til/core/github';
export const githubRouter = router({
	listReposForUser: authProcedure.query(async ({ ctx, input }) => {
		return listReposWithFiles(ctx.account.login);
	}),
});
