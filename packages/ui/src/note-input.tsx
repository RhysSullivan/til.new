'use client';
import Editor from './editor/advanced-editor';
import { useMemo, useState } from 'react';
import { useIsAuthenticated, useRepositories } from './hooks/data';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { signIn } from './utils/auth';
import frontMatter from 'front-matter';
import { PathSelector } from './path-selector';
import { trpc } from './utils/client';

const SELECTED_REPO_KEY = 'selected-repo';

interface FrontMatterAttributes {
	title?: string;
	date?: string;
	tags?: string[];
	author?: string;
	description?: string;
}

interface NoteInputProps {
	initialContent?: string;
}

export function NoteInput({ initialContent }: NoteInputProps) {
	// Parse initial frontmatter and content
	const [metadata, setMetadata] = useState<FrontMatterAttributes>(() => {
		if (!initialContent) return {};
		const { attributes } = frontMatter<FrontMatterAttributes>(initialContent);
		return attributes;
	});
	const [selectedPath, setSelectedPath] = useState<string>('');
	const mutation = trpc.github.saveFile.useMutation();

	const [markdown, setMarkdown] = useState<string>(() => {
		if (!initialContent) return '';
		const { body } = frontMatter<FrontMatterAttributes>(initialContent);
		return body;
	});

	const repositories = useRepositories();
	const [selectedRepoName, setSelectedRepoName] = useState<string | undefined>(
		repositories.data?.[0]?.name,
	);
	const [isSaving, setIsSaving] = useState(false);
	const isAuthenticated = useIsAuthenticated();

	// Save selected repo to localStorage when it changes
	const handleRepoChange = (repoName: string) => {
		setSelectedRepoName(repoName);
		localStorage.setItem(SELECTED_REPO_KEY, repoName);
	};

	const editor = useMemo(
		() => <Editor initialValue={markdown} onChange={setMarkdown} />,
		[markdown],
	);

	const createFrontmatterString = (metadata: FrontMatterAttributes): string => {
		const updatedMetadata = {
			...metadata,
			date: metadata.date || new Date().toISOString(),
		};

		const frontmatterEntries = Object.entries(updatedMetadata)
			.filter(([_, val]) => val !== undefined)
			.map(([key, val]) => {
				if (Array.isArray(val)) {
					return `${key}: [${val.join(', ')}]`;
				}
				return `${key}: ${val}`;
			})
			.join('\n');

		return `---\n${frontmatterEntries}\n---\n`;
	};

	const handleSave = async () => {
		if (!markdown || !metadata.title || !selectedRepoName || isSaving) return;

		setIsSaving(true);
		try {
			const frontmatterStr = createFrontmatterString(metadata);
			const fullContent = `${frontmatterStr}\n${markdown}`;
			await mutation.mutateAsync({
				repo: selectedRepoName,
				path: `${selectedPath}/${metadata.title.toLowerCase().replace(/\s+/g, '-')}.md`,
				content: fullContent,
				message: `Add note: ${metadata.title}`,
			});
			// Clear the form after successful save
			setMetadata({});
			setMarkdown('');
		} finally {
			setIsSaving(false);
		}
	};

	const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setMetadata((prev) => ({ ...prev, title: e.target.value }));
	};

	const selectedRepo =
		repositories.data?.find((repo) => repo.name === selectedRepoName) ??
		repositories.data?.[0];
	const paths =
		selectedRepo?.files
			.filter((file) => file.type === 'tree')
			.map((file) => file.path)
			.filter(Boolean) ?? [];
	console.log('paths', paths);
	return (
		<div className="flex flex-col p-6 rounded-xl max-w-xl w-full gap-4">
			<Input
				placeholder="New note"
				className="border-none border-b p-0 h-12 md:text-xl focus-visible:ring-0"
				onChange={handleTitleChange}
				value={metadata.title}
			/>
			{editor}
			{isAuthenticated ? (
				<div className="flex flex-col gap-4">
					<PathSelector
						repositories={repositories.data ?? []}
						selectedRepoName={selectedRepoName ?? ''}
						setSelectedRepoName={setSelectedRepoName}
						selectedPath={selectedPath}
						setSelectedPath={setSelectedPath}
					/>
					<Button
						disabled={
							!markdown || !metadata.title || !selectedRepoName || isSaving
						}
						variant="outline"
						onClick={handleSave}
					>
						{isSaving ? 'Publishing...' : 'Publish'}
					</Button>
				</div>
			) : (
				<Button
					variant="outline"
					onClick={() => signIn.social({ provider: 'github' })}
				>
					Sign In to Publish
				</Button>
			)}
		</div>
	);
}
