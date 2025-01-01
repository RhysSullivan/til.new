import {  initTRPC } from '@trpc/server';
import superjson from 'superjson';
import type { Context } from './context';

export interface Meta {
	tenantAuthAccessible: boolean; // Whether this endpoint is accessible by tenant auth
}

const t = initTRPC
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
const procedureBase = t.procedure;
export const publicProcedure = procedureBase;
