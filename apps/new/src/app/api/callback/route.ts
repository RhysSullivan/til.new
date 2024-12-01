import { GitHubCMS } from '@/server/github';
import { NextResponse } from 'next/server';

// url example: https://localhost:3000/api/webhook?code=a156aae4b602ebed3fee&installation_id=57843813&setup_action=install
export async function GET(request: Request) {
	const url = new URL(request.url);
	const code = url.searchParams.get('code');
	const installation_id = url.searchParams.get('installation_id');
	const setup_action = url.searchParams.get('setup_action');

	console.log(code, installation_id, setup_action);

	const cms = await GitHubCMS.initialize(installation_id!);
	const repo = await cms.createCommit(
		'rhyssullivan',
		'til',
		'content/hello-world.md',
		'New content',
		'Add new file via GitHub App',
	);
	return NextResponse.json({ message: 'Hello, world!' });
}
