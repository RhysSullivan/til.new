import { trpc } from '../utils/client';
import { toast } from 'sonner';

export function useRepositories() {
	const data = trpc.github.listReposForUser.useQuery();
	return data;
}

export function useAuthedUser() {
	return trpc.auth.getSession.useQuery();
}

export function useIsAuthenticated() {
	const user = trpc.auth.getSession.useQuery();
	return !!user.data;
}
