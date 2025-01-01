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

export async function listReposWithFiles(username: string) {
	const octokit = new Octokit({
		authStrategy: createAppAuth,
		auth: {
			appId: 1074737,
			privateKey: sharedEnvs.GITHUB_PRIVATE_KEY,
			type: 'app',
		},
	});

	// Get installation for the user
	const installationResponse = await octokit.apps.getUserInstallation({
		username,
	});

	// Create installation-authenticated client
	const installationOctokit = new Octokit({
		authStrategy: createAppAuth,
		auth: {
			appId: 1074737,
			privateKey: sharedEnvs.GITHUB_PRIVATE_KEY,
			installationId: installationResponse.data.id,
		},
	});

	// Get repositories
	const reposResponse =
		await installationOctokit.apps.listReposAccessibleToInstallation({
			per_page: 100,
		});

	// Get file tree for each repository
	const reposWithFiles = await Promise.all(
		reposResponse.data.repositories.map(async (repo) => {
			try {
				// Get default branch's latest commit
				const {
					data: { commit },
				} = await installationOctokit.repos.getBranch({
					owner: repo.owner.login,
					repo: repo.name,
					branch: repo.default_branch,
				});

				// Get file tree
				const { data: tree } = await installationOctokit.git.getTree({
					owner: repo.owner.login,
					repo: repo.name,
					tree_sha: commit.sha,
					recursive: '1', // Get all files, including those in subdirectories
				});

				return {
					...repo,
					files: tree.tree,
				};
			} catch (error) {
				console.error(`Error getting files for ${repo.full_name}:`, error);
				return {
					...repo,
					files: [],
				};
			}
		}),
	);

	return reposWithFiles;
}
