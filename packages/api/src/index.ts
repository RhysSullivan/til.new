export type { AppRouter } from './router';
export { appRouter as appRouter } from './router';
export { createContext } from './router/context';
export type { Context, AppRouterCreate } from './router/context';
import { inferRouterOutputs } from '@trpc/server';
import { AppRouter } from './router';
export type RouterOutputs = inferRouterOutputs<AppRouter>;
export { createCaller } from './router/trpc';
