import { Button } from '@/components/ui/button';
import {  useRepositories } from '@/hooks/data';
import { GitFork } from 'lucide-react';
import { NoteInput } from './note-input';

export function MainContent() {
	const { repositories } = useRepositories();
	if (repositories.length === 0) {
		return (
			<div className="flex-1 overflow-auto">
				<div className="h-full flex items-center justify-center flex-col gap-4 p-4">
					<div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
						<GitFork className="h-8 w-8 text-muted-foreground" />
					</div>
					<h1 className="text-2xl font-semibold">Welcome to til.new</h1>
					<p className="text-muted-foreground text-center max-w-md">
						Get started by connecting a Git repository. Your files will appear
						in the sidebar, and you can start editing them right here.
					</p>
					<Button>
						<GitFork className="mr-2 h-4 w-4" />
						Add Repository
					</Button>
				</div>
			</div>
		);
	}
	return (
		<main className="flex min-h-screen flex-col items-center justify-between p-24">
			<NoteInput />
		</main>
	);
}
