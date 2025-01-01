import { z } from 'zod';
import { publicProcedure, router } from './trpc';
import { listReposForUser } from '@til/core/github';
export const githubRouter = router({
	listReposForUser: publicProcedure.query(async ({ ctx, input }) => {
		return listReposForUser('rhyssullivan');
	}),
});
