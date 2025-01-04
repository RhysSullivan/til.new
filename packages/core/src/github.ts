import { Octokit } from '@octokit/rest';
import { createAppAuth } from '@octokit/auth-app';
import { sharedEnvs } from '@til/env/env';
import type { Repository } from '@octokit/webhooks-types';

export async function getInstallation(username: string) {
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

	return installationResponse.data;
}

export async function listReposForUser(username: string) {
	const installation = await getInstallation(username);

	// Create a new authenticated client for the installation
	const installationOctokit = new Octokit({
		authStrategy: createAppAuth,
		auth: {
			appId: 1074737,
			privateKey: sharedEnvs.GITHUB_PRIVATE_KEY,
			installationId: installation.id,
		},
	});

	// Now get the repositories using the installation-authenticated client
	const reposResponse =
		await installationOctokit.apps.listReposAccessibleToInstallation({
			per_page: 100,
		});

	return {
		repositories: reposResponse.data.repositories as Repository[],
	};
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

export async function getFile(input: {
	username: string;
	repo: string;
	file: string;
}) {
	const { username, repo, file } = input;
	const installation = await getInstallation(username);

	const octokit = new Octokit({
		authStrategy: createAppAuth,
		auth: {
			appId: 1074737,
			privateKey: sharedEnvs.GITHUB_PRIVATE_KEY,
			installationId: installation.id,
			type: 'app',
		},
	});

	const { data } = await octokit.repos.getContent({
		owner: username,
		repo,
		path: file,
	});

	return data;
}

export async function saveFile(input: {
	username: string;
	repo: string;
	path: string;
	content: string;
	message?: string;
}) {
	const { username, repo, path, content, message } = input;
	const installation = await getInstallation(username);

	const octokit = new Octokit({
		authStrategy: createAppAuth,
		auth: {
			appId: 1074737,
			privateKey: sharedEnvs.GITHUB_PRIVATE_KEY,
			installationId: installation.id,
			type: 'app',
		},
	});

	try {
		// Try to get the current file to get its SHA
		const { data: existingFile } = await octokit.repos.getContent({
			owner: username,
			repo,
			path,
		});

		if (!('sha' in existingFile)) {
			throw new Error('Unexpected response format');
		}

		// Update existing file
		await octokit.repos.createOrUpdateFileContents({
			owner: username,
			repo,
			path,
			message: message || `Update ${path}`,
			content: Buffer.from(content).toString('base64'),
			sha: existingFile.sha,
		});
	} catch (error) {
		if ((error as any).status === 404) {
			// File doesn't exist, create it
			await octokit.repos.createOrUpdateFileContents({
				owner: username,
				repo,
				path,
				message: message || `Create ${path}`,
				content: Buffer.from(content).toString('base64'),
			});
		} else {
			throw error;
		}
	}
}
