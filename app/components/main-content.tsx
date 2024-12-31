import { Button } from '@/components/ui/button';
import {  useRepositories } from '@/hooks/data';
import { GitFork } from 'lucide-react';
import { NoteInput } from './note-input';
import { ContributionHeatmap } from './heatmap';

export function MainContent() {
	const { data } = useRepositories();

	return (
		<main className="flex min-h-screen flex-col items-center pt-0 p-24">
			<NoteInput />
		</main>
	);
}
