import { Octokit } from '@octokit/rest';
import { createAppAuth } from '@octokit/auth-app';

export class GitHubCMS {
	private octokit: Octokit;

	private constructor(octokit: Octokit) {
		this.octokit = octokit;
	}

	static async initialize(installationId: string): Promise<GitHubCMS> {
		const APP_ID = process.env.GITHUB_APP_ID;
		const PRIVATE_KEY = process.env.GITHUB_PRIVATE_KEY;

		const auth = createAppAuth({
			appId: APP_ID!,
			privateKey: PRIVATE_KEY!,
			installationId,
		});

		const installationAuthentication = await auth({ type: 'installation' });
		const octokit = new Octokit({
			auth: installationAuthentication.token,
		});

		return new GitHubCMS(octokit);
	}

	async createCommit(
		owner: string,
		repo: string,
		filePath: string,
		content: string,
		message: string,
	) {
		try {
			const existingFile = await this.octokit.rest.repos.getContent({
				owner,
				repo,
				path: filePath,
				ref: 'main',
			});
			await this.octokit.repos.createOrUpdateFileContents({
				owner,
				repo,
				path: filePath,
				message,
				branch: 'main',
				content: Buffer.from(content).toString('base64'),
				// @ts-expect-error
				sha: existingFile.data.sha,
			});
		} catch (error) {
			console.error('Error creating commit:', error);
			throw error;
		}
	}
}
