import { authProcedure, router } from './trpc';
import { listReposWithFiles, saveFile } from '@til/core/github';
import { z } from 'zod';

export const githubRouter = router({
	listReposForUser: authProcedure.query(async ({ ctx }) => {
		return listReposWithFiles(ctx.account.login);
	}),
	saveFile: authProcedure
		.input(
			z.object({
				repo: z.string(),
				path: z.string(),
				content: z.string(),
				message: z.string().optional(),
			}),
		)
		.mutation(async ({ input, ctx }) => {
			await saveFile({
				...input,
				username: ctx.account.login,
			});
		}),
});
