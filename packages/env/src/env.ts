/* eslint-disable n/no-process-env */
process.env = {
	...process.env,
	NODE_ENV: process.env.NODE_ENV ?? 'development',
	NEXT_PUBLIC_DEPLOYMENT_ENV: process.env.NEXT_PUBLIC_DEPLOYMENT_ENV ?? 'local',
};

import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const envNumber = z
	.string()
	.transform((s) => parseInt(s, 10))
	.pipe(z.number());

export const zStringRequiredInProduction = z
	.string()
	.optional()
	.refine(
		(token) => {
			if (
				process.env.NEXT_PUBLIC_DEPLOYMENT_ENV === 'local' ||
				process.env.NEXT_PUBLIC_DEPLOYMENT_ENV === 'ci' ||
				process.env.NODE_ENV === 'development' ||
				process.env.NODE_ENV === 'test'
			) {
				return true;
			}
			return token ? token.length > 0 : false;
		},
		{ message: 'Required in production' },
	);

export const zNumberRequiredInProduction = z
	.string()
	.optional()
	.refine(
		(token) => {
			if (
				process.env.NEXT_PUBLIC_DEPLOYMENT_ENV === 'local' ||
				process.env.NEXT_PUBLIC_DEPLOYMENT_ENV === 'ci' ||
				process.env.NODE_ENV === 'development' ||
				process.env.NODE_ENV === 'test'
			) {
				return true;
			}
			return token ? token.length > 0 : false;
		},
		{ message: 'Required in production' },
	)
	.transform((s) => {
		if (s) {
			return parseInt(s, 10);
		}
		return undefined;
	})
	.pipe(z.number().optional());

export const nodeEnv = z
	.string()
	.optional()
	.default('development')
	.pipe(z.enum(['development', 'production', 'test']));

const zStringBase64 = z
	.string()
	.transform((s) => Buffer.from(s).toString('base64'));

export function zStringDefaultInDev(defaultValue: string) {
	const isDev =
		process.env.NEXT_PUBLIC_DEPLOYMENT_ENV === 'local' ||
		process.env.NEXT_PUBLIC_DEPLOYMENT_ENV === 'ci' ||
		process.env.NODE_ENV === 'development' ||
		process.env.NODE_ENV === 'test';
	if (!isDev) {
		return z.string();
	}
	return z.string().optional().default(defaultValue);
}

export const sharedClientEnvs = {
	NEXT_PUBLIC_POSTHOG_TOKEN: zStringRequiredInProduction,
	NEXT_PUBLIC_DEPLOYMENT_ENV: zStringDefaultInDev('local').pipe(
		z.enum(['local', 'staging', 'production', 'ci']),
	),
	NEXT_PUBLIC_SITE_URL: zStringDefaultInDev('http://localhost:3000'),
};

export const sharedEnvs = createEnv({
	server: {
		NODE_ENV: nodeEnv,
		DATABASE_URL: zStringDefaultInDev(
			'http://root:nonNullPassword@localhost:3306',
		),
		/*
      Analytics
     */
		POSTHOG_PROJECT_ID: zNumberRequiredInProduction,
		POSTHOG_PERSONAL_API_KEY: zStringRequiredInProduction,
		AXIOM_API_KEY: zStringRequiredInProduction,
		// auth
		GITHUB_CLIENT_ID: zStringRequiredInProduction,
		GITHUB_CLIENT_SECRET: zStringRequiredInProduction,
		GITHUB_APP_ID: zNumberRequiredInProduction,
		// prefix with `-----BEGIN RSA PRIVATE KEY-----` and `-----END RSA PRIVATE KEY-----`
		GITHUB_PRIVATE_KEY: z.string().transform((s) => {
			return `-----BEGIN RSA PRIVATE KEY-----\n${s}\n-----END RSA PRIVATE KEY-----`;
		}),
		// redis
		REDIS_URL: zStringRequiredInProduction,
	},
	client: sharedClientEnvs,
	experimental__runtimeEnv: {
		NEXT_PUBLIC_DEPLOYMENT_ENV: process.env.NEXT_PUBLIC_DEPLOYMENT_ENV,
		NEXT_PUBLIC_POSTHOG_TOKEN: process.env.NEXT_PUBLIC_POSTHOG_TOKEN,
		NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
	},

	skipValidation: process.env.SKIP_ENV_CHECK === 'true',
});
