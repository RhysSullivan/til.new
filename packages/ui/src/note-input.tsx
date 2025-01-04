'use client';
import Editor from './editor/advanced-editor';
import { useMemo, useState } from 'react';
import { save, useIsAuthenticated } from './hooks/data';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { signIn } from './utils/auth';
import frontMatter from 'front-matter';

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

	const [markdown, setMarkdown] = useState<string>(() => {
		if (!initialContent) return '';
		const { body } = frontMatter<FrontMatterAttributes>(initialContent);
		return body;
	});

	const isAuthenticated = useIsAuthenticated();
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

	const handleSave = () => {
		if (!markdown || !metadata.title) return;

		const frontmatterStr = createFrontmatterString(metadata);
		const fullContent = `${frontmatterStr}\n${markdown}`;
		save({ title: metadata.title, value: fullContent });
	};

	const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setMetadata((prev) => ({ ...prev, title: e.target.value }));
	};

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
				<Button
					disabled={!markdown || !metadata.title}
					variant="outline"
					onClick={handleSave}
				>
					Publish
				</Button>
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
