

import { useRepositories } from './hooks/data';
import { NoteInput } from './note-input';

export function MainContent() {
	const { data } = useRepositories();

	return (
		<main className="flex min-h-screen flex-col items-center pt-0 p-24">
			<NoteInput />
		</main>
	);
}
