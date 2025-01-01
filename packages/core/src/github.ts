import { Octokit } from '@octokit/rest';

import { createAppAuth } from '@octokit/auth-app';
import { sharedEnvs } from '@til/env/env';

export async function listReposForUser(username: string) {
	const octokit = new Octokit({
		authStrategy: createAppAuth,
		auth: {
			appId: 1074737,
			privateKey: sharedEnvs.GITHUB_PRIVATE_KEY,
			type: 'app',
		},
	});
	const installationResponse = await octokit.apps.getUserInstallation({
		username,
	});

	// Create a new authenticated client for the installation
	const installationOctokit = new Octokit({
		authStrategy: createAppAuth,
		auth: {
			appId: 1074737,
			privateKey: sharedEnvs.GITHUB_PRIVATE_KEY,
			installationId: installationResponse.data.id,
		},
	});

	// Now get the repositories using the installation-authenticated client
	const reposResponse =
		await installationOctokit.apps.listReposAccessibleToInstallation({
			per_page: 100,
		});

	return reposResponse.data;
}
