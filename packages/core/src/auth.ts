import { betterAuth } from 'better-auth';
import { db } from './db';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { sharedEnvs } from '@til/env/env';

export const auth = betterAuth({
	socialProviders: {
		github: {
			clientId: sharedEnvs.GITHUB_CLIENT_ID!,
			clientSecret: sharedEnvs.GITHUB_CLIENT_SECRET!,
		},
	},
	database: drizzleAdapter(db, {
		provider: 'mysql', // or "pg" or "mysql"
	}),
});
