import { appRouter, createContext } from '@til/api/index';
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';

const handler = (req: Request) =>
	fetchRequestHandler({
		req,
		router: appRouter,
		endpoint: '/api/trpc',
		createContext: createContext,
		onError: (opts) => {
			console.error(opts.error);
		},
	});

export { handler as GET, handler as POST };
