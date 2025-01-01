import { z } from 'zod';
import { publicProcedure, router } from './trpc';
import { headers } from 'next/headers';
import { auth } from '@til/core/auth';
import { getAccount } from '@til/core/queries';

export const authRouter = router({
	getSession: publicProcedure.query(async ({ ctx, input }) => {
		const session = await auth.api.getSession({
			headers: await headers(), // you need to pass the headers object.
		});
		const user = session?.user;
		if (!user) {
			return null;
		}
		const account = await getAccount(user.id);
		return account;
	}),
});
