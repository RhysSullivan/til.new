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
		title: string,
		content: string,
		message: string,
	) {
		const existingFile = await this.octokit.rest.repos
			.getContent({
				owner,
				repo,
				path: `content/${title}`,
				ref: 'main',
			})
			.catch(() => null);
		// if the file doesn't exist, add the date to the file name, i.e. hello-world-2024-01-01.md
		if (!existingFile) {
			title = `${new Date().toISOString().split('T')[0]}-${title}.md`;
		}
		await this.octokit.repos.createOrUpdateFileContents({
			owner,
			repo,
			path: `content/${title}`,
			message,
			branch: 'main',
			content: Buffer.from(content).toString('base64'),
			// @ts-expect-error
			sha: existingFile?.data.sha,
		});
	}
}
