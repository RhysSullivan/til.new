import type { inferAsyncReturnType } from '@trpc/server';

/**
 * Replace this with an object if you want to pass things to createContextInner
 */

export const sourceTypes = ['web-client', 'discord-bot'] as const;
export type Source = (typeof sourceTypes)[number];

type CreateContextOptions = {
	// session: Auth.Session | null;
};

export const createContextInner = async (opts: CreateContextOptions) => {
	return {}
};

export const createSSGContext = async () => {
	return await createContextInner({ source: 'web-client', session: null });
};

export type AppRouterCreate = Omit<CreateContextOptions, 'source'>;

/**
 * This is the actual context you'll use in your router
 * @link https://trpc.io/docs/context
 **/
export const createContext = async () => {
	// const session = await Auth.getServerSession();

	return await createContextInner({
		// session,
	});
};

export type Context = inferAsyncReturnType<typeof createContext>;
