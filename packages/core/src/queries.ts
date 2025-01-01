import { eq } from 'drizzle-orm';
import { account } from './schema';
import { db } from './db';
import { Octokit } from '@octokit/rest';

export async function getAccount(userId: string) {
	const found = await db.query.account.findFirst({
		where: eq(account.userId, userId),
	});
	if (!found) {
		return null;
	}
	const accessToken = found.accessToken;
	console.log('accessToken', accessToken);
	const octokit = new Octokit({
		auth: accessToken,
	});
	const user = await octokit.rest.users.getAuthenticated();
	return user.data;
}
