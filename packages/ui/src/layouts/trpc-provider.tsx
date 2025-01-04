'use client';
import { QueryClient } from '@tanstack/react-query';
import { httpBatchLink, loggerLink } from '@trpc/client';
import React, { useState } from 'react';
import { trpc } from '../utils/client';

import { transformer } from '@til/api/transformer';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';

const getBaseUrl = () => {
	if (typeof window !== 'undefined') return ''; // browser should use relative url
	// eslint-disable-next-line n/no-process-env
	if (process.env.NEXT_PUBLIC_VERCEL_URL)
		// eslint-disable-next-line n/no-process-env
		return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`; // SSR should use vercel url
	// eslint-disable-next-line n/no-process-env
	return `http://localhost:${process.env.NEXT_PUBLIC_PORT ?? 3000}`; // dev SSR should use localhost
};

export function TRPCProvider(props: { children?: React.ReactNode } | null) {
	const [queryClient] = useState(
		() =>
			new QueryClient({
				defaultOptions: {
					queries: {
						cacheTime: 0, //1000 * 60 * 60 * 24, // 24 hours
						refetchOnReconnect: false,
						refetchOnMount: false,
						refetchOnWindowFocus: false,
					},
				},
			}),
	);

	const [persister] = useState(
		typeof window !== 'undefined'
			? createSyncStoragePersister({
					storage: window.localStorage,
				})
			: null,
	);

	const [trpcClient] = useState(() =>
		trpc.createClient({
			transformer,
			links: [
				loggerLink({
					enabled: () =>
						// process.env.NODE_ENV === 'development' ||
						// (opts.direction === 'down' && opts.result instanceof Error),
						false,
				}),
				httpBatchLink({
					url: `${getBaseUrl()}/api/trpc`,
				}),
			],
		}),
	);
	return (
		<trpc.Provider client={trpcClient} queryClient={queryClient}>
			<PersistQueryClientProvider
				client={queryClient}
				persistOptions={{ persister }}
			>
				<ToastContainer />
				{props && props.children}
			</PersistQueryClientProvider>
		</trpc.Provider>
	);
}
