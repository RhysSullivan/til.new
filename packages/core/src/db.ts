import { drizzle } from 'drizzle-orm/mysql2';
import { sharedEnvs } from '@til/env/env';
import * as schema from './schema';

export const db = drizzle(sharedEnvs.DATABASE_URL, {
	schema: schema,
	mode: 'default',
});
