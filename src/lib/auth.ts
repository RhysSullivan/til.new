import { betterAuth } from 'better-auth';
import Database from 'better-sqlite3';

export const auth = betterAuth({
	database: new Database('./sqlite.db'),
	socialProviders: {
		github: {
			clientId: process.env.GITHUB_CLIENT_ID!,
			clientSecret: process.env.GITHUB_CLIENT_SECRET!,
		},
	},
});
