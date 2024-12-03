'use server';

import { sanitizeFileName } from '@/lib/utils';
import { auth, db, ProviderAccount } from '@/server/auth';
import { GitHubCMS } from '@/server/github';
import { headers } from 'next/headers';

export async function save(input: { title: string; value: string }) {
	const accounts = await auth.api.listUserAccounts({
		headers: await headers(),
	});
	const firstAccount = accounts[0];
	if (!firstAccount) {
		throw new Error('No account found');
	}
	const account = db
		.prepare('SELECT * FROM account WHERE id = ?')
		.get(firstAccount.id) as ProviderAccount;
	if (!account) {
		throw new Error('Account not found');
	}
	const fileName = sanitizeFileName(input.title, {
		replacement: '-',
	});
	const cms = await GitHubCMS.initialize('57843813');
	console.log(input.value);
	const repo = await cms.createCommit(
		'rhyssullivan',
		'til',
		fileName,
		input.value,
		'Edit: hello-world.md via til.new',
	);
}
