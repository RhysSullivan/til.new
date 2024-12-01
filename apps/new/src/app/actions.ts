'use server';

import { auth, db, ProviderAccount } from '@/server/auth';
import { GitHubCMS } from '@/server/github';
import { headers } from 'next/headers';

export async function save(value: string) {
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
	const cms = await GitHubCMS.initialize('');
	console.log(value);
	const repo = await cms.createCommit(
		'rhyssullivan',
		'til',
		'content/hello-world.md',
		value,
		'Edit: hello-world.md via til.new',
	);
}
