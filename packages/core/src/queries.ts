import { eq } from 'drizzle-orm';
import { account } from './schema';
import { db } from './db';
import { Octokit } from '@octokit/rest';
import { auth } from './auth';
import { headers } from 'next/headers';

export async function getAccount(userId: string) {
	const found = await db.query.account.findFirst({
		where: eq(account.userId, userId),
	});
	if (!found) {
		return null;
	}
	let {
		accessToken,
		accessTokenExpiresAt,
		refreshToken,
		refreshTokenExpiresAt,
	} = found;

	// Check if access token is expired
	if (new Date(accessTokenExpiresAt!) <= new Date()) {
		// Check if refresh token is also expired
		if (new Date(refreshTokenExpiresAt!) <= new Date()) {
			await auth.api.signOut({
				headers: await headers(),
			});
		}

		// Refresh the access token
		try {
			const response = await fetch(
				'https://github.com/login/oauth/access_token',
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						Accept: 'application/json',
					},
					body: JSON.stringify({
						client_id: process.env.GITHUB_CLIENT_ID,
						client_secret: process.env.GITHUB_CLIENT_SECRET,
						refresh_token: refreshToken,
						grant_type: 'refresh_token',
					}),
				},
			);

			const data = (await response.json()) as {
				access_token: string;
				expires_in: number;
				refresh_token: string;
				refresh_token_expires_in: number;
			};

			// Update tokens in database
			await db
				.update(account)
				.set({
					accessToken: data.access_token,
					accessTokenExpiresAt: new Date(Date.now() + data.expires_in * 1000),
					refreshToken: data.refresh_token || refreshToken,
					refreshTokenExpiresAt: data.refresh_token
						? new Date(Date.now() + data.refresh_token_expires_in * 1000)
						: refreshTokenExpiresAt,
				})
				.where(eq(account.userId, userId));

			accessToken = data.access_token;
		} catch (error) {
			throw new Error(
				'Failed to refresh access token: ' + (error as Error).message,
			);
		}
	}

	const octokit = new Octokit({
		auth: accessToken,
	});
	const user = await octokit.rest.users.getAuthenticated();
	return user.data;
}
