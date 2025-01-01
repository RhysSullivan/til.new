import { sharedEnvs } from '@til/env/env';
import dotenv from 'dotenv';
import type { Config } from 'drizzle-kit';
dotenv.config({
	path: '../../.env',
});

// ps proxy has some issues w/ db push, so here's a workaround
let dbUrl =
	// eslint-disable-next-line n/no-process-env
	sharedEnvs.DATABASE_URL ?? 'http://root:nonNullPassword@localhost:3900';
export default {
	schema: './src/schema.ts',
	out: './drizzle',
	dbCredentials: {
		url: dbUrl,
	},
	dialect: 'mysql',
} satisfies Config;
