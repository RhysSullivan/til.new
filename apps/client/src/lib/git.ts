import LightningFS from '@isomorphic-git/lightning-fs';
import http from 'isomorphic-git/http/web';
import git from 'isomorphic-git';
import { Buffer } from 'buffer';

export const REPO_DIR = '/posthog-docs-asdf';
export const repoUrl = 'https://github.com/PostHog/posthog.com';

declare global {
	interface Window {
		Buffer: typeof Buffer;
		fs: LightningFS;
		pfs: any;
	}
}

window.Buffer = Buffer;
window.fs = new LightningFS('fs');
window.pfs = window.fs.promises;
export async function checkRepoExists(
	fs: LightningFS,
	dir: string,
): Promise<boolean> {
	try {
		const files = await fs.promises.readdir(dir);
		return files.length > 0;
	} catch (e) {
		return false;
	}
}

export async function getDefaultBranch(
	fs: LightningFS,
	dir: string,
): Promise<string> {
	try {
		const refs = await git.listServerRefs({
			http,
			url: repoUrl,
			corsProxy: 'https://cors.isomorphic-git.org',
			prefix: 'refs/heads/',
		});

		// Look for main or master first
		const mainBranch = refs.find(
			(ref) => ref.ref === 'refs/heads/main' || ref.ref === 'refs/heads/master',
		);
		if (mainBranch) {
			return mainBranch.ref.replace('refs/heads/', '');
		}

		// If neither main nor master exists, use the first branch
		if (refs.length > 0) {
			return refs[0].ref.replace('refs/heads/', '');
		}

		throw new Error('No branches found');
	} catch (error) {
		console.error('Error getting default branch:', error);
		// Fallback to common branch names
		return 'master';
	}
}

export async function cloneIfStale(repoUrl: string): Promise<void> {
	const fs = window.fs;

	try {
		const repoExists = await checkRepoExists(fs, REPO_DIR);

		if (repoExists) {
			try {
				const defaultBranch = await getDefaultBranch(fs, REPO_DIR);
				const [local, remote] = await Promise.all([
					git.resolveRef({ fs, dir: REPO_DIR, ref: defaultBranch }),
					git.resolveRef({
						fs,
						dir: REPO_DIR,
						ref: `origin/${defaultBranch}`,
					}),
				]);

				if (local === remote) {
					console.log('Repository is up to date');
					return;
				}
			} catch (e) {
				console.log('Error checking refs, will re-clone:', e);
				// @ts-expect-error
				await fs.promises.rmdir(REPO_DIR, { recursive: true });
			}
		}

		// Ensure the directory is empty before cloning
		try {
			// @ts-expect-error
			await fs.promises.rmdir(REPO_DIR, { recursive: true });
		} catch (e) {
			// Directory might not exist, that's okay
		}

		// Get the default branch before cloning
		const defaultBranch = await getDefaultBranch(fs, REPO_DIR);
		console.log(`Using default branch: ${defaultBranch}`);

		// Clone the repository
		await git.clone({
			fs,
			http,
			dir: REPO_DIR,
			url: repoUrl,
			singleBranch: true,
			depth: 1,
			corsProxy: 'https://cors.isomorphic-git.org',
			ref: defaultBranch,
		});
		console.log('Repository cloned successfully!');
	} catch (error) {
		console.error('Error managing repository:', error);
		throw error;
	}
}

export async function listFiles() {
	const defaultBranch = await getDefaultBranch(window.fs, REPO_DIR);
	const files = await git.listFiles({
		fs: window.fs,
		dir: REPO_DIR,
		ref: defaultBranch,
	});
	return files;
}

export async function getFileContents(path: string) {
	const defaultBranch = await getDefaultBranch(window.fs, REPO_DIR);
	const commitOid = await git.resolveRef({
		fs: window.fs,
		dir: REPO_DIR,
		ref: defaultBranch,
	});
	const { blob } = await git.readBlob({
		fs: window.fs,
		dir: REPO_DIR,
		oid: commitOid,
		filepath: path,
	});

	// Convert the blob to a string
	// TODO: Handle images etc
	const content = new TextDecoder().decode(blob);

	// Construct the GitHub URL for the file
	const url = `${repoUrl}/blob/${defaultBranch}/${path}`;

	return { content, url };
}
