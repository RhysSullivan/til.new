import { getFile } from '@til/core/github';
import { NoteInput } from '@til/ui/note-input';

export default async function Page(props: {
	params: Promise<{ repo: string; filename: string }>;
}) {
	const { repo: encodedRepo, filename: encodedFilename } = await props.params;
	const repo = decodeURIComponent(encodedRepo);
	const filename = decodeURIComponent(encodedFilename);
	const file = await getFile({
		username: 'rhyssullivan',
		repo,
		file: filename,
	});
	if (!('content' in file)) {
		return <div>File not found</div>;
	}
	const content = Buffer.from(file.content, 'base64').toString('utf-8');
	return <NoteInput initialContent={content} />;
}
