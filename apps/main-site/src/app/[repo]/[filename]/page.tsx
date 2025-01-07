import { appRouter, createCaller } from '@til/api/index';
import { getFile } from '@til/core/github';
import { NoteInput } from '@til/ui/note-input';

export default async function Page(props: {
	params: Promise<{ repo: string; filename: string }>;
}) {
	const { repo: encodedRepo, filename: encodedFilename } = await props.params;
	const repo = decodeURIComponent(encodedRepo);
	const filename = decodeURIComponent(encodedFilename);
	const caller = createCaller(appRouter);
	const session = await caller({}).auth.getSession();
	const file = await getFile({
		username: session.login,
		repo,
		file: filename,
	});
	if (!('content' in file)) {
		return <div>File not found</div>;
	}
	const content = Buffer.from(file.content, 'base64').toString('utf-8');
	return <NoteInput initialContent={content} />;
}
