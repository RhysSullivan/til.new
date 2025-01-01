import { createTRPCReact } from '@trpc/react-query';

import { type AppRouter } from '@til/api/index';

export const trpc = createTRPCReact<AppRouter>({});
