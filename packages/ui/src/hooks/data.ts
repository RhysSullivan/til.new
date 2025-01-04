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

export function save(note: {
	title: string;
	value: string;
	repo?: string;
}) {
	const mutation = trpc.github.saveFile.useMutation();
	const user = trpc.auth.getSession.useQuery();

	if (!user.data?.login || !note.repo) {
		toast.error('User not authenticated or repo not selected');
		return;
	}

	try {
		const path = `${note.title.toLowerCase().replace(/\s+/g, '-')}.md`;
		return mutation.mutateAsync({
			username: user.data.login,
			repo: note.repo,
			path,
			content: note.value,
			message: `Add note: ${note.title}`,
		});
	} catch (error) {
		toast.error('Failed to save note');
		console.error('Error saving note:', error);
		throw error;
	}
}
