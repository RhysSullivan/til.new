import { authProcedure, router } from './trpc';

export const authRouter = router({
	getSession: authProcedure.query(async ({ ctx }) => {
		return ctx.account;
	}),
});
