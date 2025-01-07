interface TreeNode {
	name: string;
	children: Record<string, TreeNode>;
	isFile: boolean;
}

import React, { useEffect } from 'react';
import { ChevronRight, ChevronDown, Folder, File } from 'lucide-react';
import {
	Collapsible,
	CollapsibleTrigger,
	CollapsibleContent,
} from './ui/collapsible';
import { ScrollArea, ScrollBar } from './ui/scroll-area';
import { cn } from './utils/utils';
import { Link } from './ui/link';

interface TreeNode {
	name: string;
	children: Record<string, TreeNode>;
	isFile: boolean;
}

function parseFileTree(paths: string[]): TreeNode {
	const root: TreeNode = { name: 'root', children: {}, isFile: false };

	paths.forEach((path) => {
		const parts = path.split('/');
		let currentNode = root;

		parts.forEach((part, index) => {
			if (part === '') return;
			const safeName = part.replace(/[[\]]/g, '_');

			if (!currentNode.children[safeName]) {
				currentNode.children[safeName] = {
					name: part,
					children: {},
					isFile: index === parts.length - 1,
				};
			}
			currentNode = currentNode.children[safeName];
		});
	});

	return root;
}

interface FileTreeNodeProps {
	node: TreeNode;
	level: number;
	selectedPath: string;
	onSelect: (path: string) => void;
	path: string;
	repoName: string;
}

const getStorageKey = (repoName: string) => `file-tree-state-${repoName}`;

const FileTreeNode: React.FC<FileTreeNodeProps> = ({
	node,
	level,
	selectedPath,
	onSelect,
	path,
	repoName,
}) => {
	const [isOpen, setIsOpen] = React.useState(false);

	useEffect(() => {
		const storageKey = getStorageKey(repoName);
		const savedState = localStorage.getItem(storageKey);
		if (savedState) {
			const openPaths = JSON.parse(savedState) as string[];
			setIsOpen(openPaths.includes(path));
		}
	}, [path, repoName]);

	const handleOpenChange = (open: boolean) => {
		setIsOpen(open);
		const storageKey = getStorageKey(repoName);
		const savedState = localStorage.getItem(storageKey);
		const openPaths = savedState ? (JSON.parse(savedState) as string[]) : [];

		if (open) {
			if (!openPaths.includes(path)) {
				localStorage.setItem(storageKey, JSON.stringify([...openPaths, path]));
			}
		} else {
			localStorage.setItem(
				storageKey,
				JSON.stringify(openPaths.filter((p: string) => p !== path)),
			);
		}
	};

	const hasChildren = Object.keys(node.children).length > 0;
	const isSelected = path === selectedPath;

	const displayName =
		node.name.length > 30 ? node.name.slice(0, 30) + '...' : node.name;

	return (
		<div className="w-full">
			{hasChildren ? (
				<Collapsible
					open={isOpen}
					onOpenChange={handleOpenChange}
					className="w-full"
				>
					<CollapsibleTrigger
						className={cn(
							'flex items-center w-full rounded-sm py-1 text-sm text-foreground/70 hover:bg-accent hover:text-accent-foreground text-left',
							isSelected && 'bg-accent text-accent-foreground',
						)}
						style={{ paddingLeft: `${level * 12}px` }}
						onClick={() => onSelect(path)}
					>
						{isOpen ? (
							<ChevronDown size={16} className="shrink-0 text-foreground/50" />
						) : (
							<ChevronRight size={16} className="shrink-0 text-foreground/50" />
						)}
						<Folder
							size={16}
							className="shrink-0 text-blue-500 dark:text-blue-400 ml-2"
						/>
						<span className="truncate ml-2" title={node.name}>
							{displayName}
						</span>
					</CollapsibleTrigger>
					<CollapsibleContent>
						{Object.entries(node.children).map(([key, child]) => (
							<FileTreeNode
								key={key}
								node={child}
								level={level + 1}
								selectedPath={selectedPath}
								onSelect={onSelect}
								path={`${path}/${child.name}`}
								repoName={repoName}
							/>
						))}
					</CollapsibleContent>
				</Collapsible>
			) : (
				<Link
					href={`/${encodeURIComponent(repoName)}/${encodeURIComponent(path)}`}
					className={cn(
						'flex items-center w-full rounded-sm py-1 text-sm text-foreground/70 hover:bg-accent hover:text-accent-foreground text-left',
						isSelected && 'bg-accent text-accent-foreground',
					)}
					style={{ paddingLeft: `${level * 12 + 24}px` }}
					title={node.name}
				>
					<File size={16} className="shrink-0 text-foreground/50" />
					<span className="truncate ml-2">{displayName}</span>
				</Link>
			)}
		</div>
	);
};

interface FileTreeProps {
	paths: string[];
	repoName: string;
}

const REPO_OPEN_STATE_KEY = 'repo-open-state';

export function FileTree({ paths, repoName }: FileTreeProps) {
	const [selectedPath, setSelectedPath] = React.useState('');
	const [isRepoOpen, setIsRepoOpen] = React.useState(false);
	const tree = parseFileTree(paths);

	useEffect(() => {
		const savedState = localStorage.getItem(REPO_OPEN_STATE_KEY);
		if (savedState) {
			const openRepos = JSON.parse(savedState) as string[];
			setIsRepoOpen(openRepos.includes(repoName));
		}
	}, [repoName]);

	const handleRepoOpenChange = (open: boolean) => {
		setIsRepoOpen(open);
		const savedState = localStorage.getItem(REPO_OPEN_STATE_KEY);
		const openRepos = savedState ? (JSON.parse(savedState) as string[]) : [];

		if (open) {
			if (!openRepos.includes(repoName)) {
				localStorage.setItem(
					REPO_OPEN_STATE_KEY,
					JSON.stringify([...openRepos, repoName]),
				);
			}
		} else {
			localStorage.setItem(
				REPO_OPEN_STATE_KEY,
				JSON.stringify(openRepos.filter((name) => name !== repoName)),
			);
		}
	};

	return (
		<div className="flex-1">
			<Collapsible open={isRepoOpen} onOpenChange={handleRepoOpenChange}>
				<CollapsibleTrigger className="flex items-center space-x-1 hover:bg-accent hover:text-accent-foreground rounded p-1 w-full text-left">
					{isRepoOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
					<Folder size={16} className="text-blue-500 dark:text-blue-400 mr-2" />
					<div className="truncate pl-[1px]">{repoName}</div>
				</CollapsibleTrigger>
				<CollapsibleContent>
					<div className="p-2 pl-6 max-w-[300px] max-h-[500px] overflow-y-auto">
						{Object.entries(tree.children).map(([key, child]) => (
							<FileTreeNode
								key={key}
								node={child}
								level={0}
								selectedPath={selectedPath}
								onSelect={setSelectedPath}
								path={child.name}
								repoName={repoName}
							/>
						))}
					</div>
				</CollapsibleContent>
			</Collapsible>
		</div>
	);
}
