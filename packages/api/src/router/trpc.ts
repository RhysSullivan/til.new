import { initTRPC, TRPCError } from '@trpc/server';
import superjson from 'superjson';
import type { Context } from './context';
import { auth } from '@til/core/auth';
import { headers } from 'next/headers';
import { getAccount } from '@til/core/queries';

export interface Meta {}

export const t = initTRPC
	.context<Context>()
	.meta<Meta>()
	.create({
		transformer: superjson,
		errorFormatter({ shape }) {
			return shape;
		},
		defaultMeta: {
			tenantAuthAccessible: false,
		},
	});

export const router = t.router;
export const createCaller = t.createCallerFactory;
const procedureBase = t.procedure;

const authenticatedProcedure = procedureBase.use(async ({ ctx, next }) => {
	const session = await auth.api.getSession({
		headers: await headers(), // you need to pass the headers object.
	});
	const user = session?.user;
	if (!user) {
		throw new TRPCError({ code: 'UNAUTHORIZED' });
	}
	const account = await getAccount(user.id);
	if (!account) {
		throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
	}
	return next({ ctx: { account } });
});
export const publicProcedure = procedureBase;
export const authProcedure = authenticatedProcedure;
