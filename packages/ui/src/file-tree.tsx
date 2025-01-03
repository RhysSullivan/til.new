interface TreeNode {
	name: string;
	children: Record<string, TreeNode>;
	isFile: boolean;
}

export function parseFileTree(paths: string[]): TreeNode {
	const root: TreeNode = { name: 'root', children: {}, isFile: false };

	paths.forEach((path) => {
		const parts = path.split('/');
		let currentNode = root;

		parts.forEach((part, index) => {
			if (!currentNode.children[part]) {
				currentNode.children[part] = {
					name: part,
					children: {},
					isFile: index === parts.length - 1,
				};
			}
			currentNode = currentNode.children[part];
		});
	});

	return root;
}
import React from 'react';
import { ChevronRight, ChevronDown, Folder, File } from 'lucide-react';
import {
	Collapsible,
	CollapsibleTrigger,
	CollapsibleContent,
} from './ui/collapsible';
import { ScrollArea, ScrollBar } from './ui/scroll-area';

interface FileTreeProps {
	paths: string[];
}

const FileTreeNode: React.FC<{ node: TreeNode; level: number }> = ({
	node,
	level,
}) => {
	const [isOpen, setIsOpen] = React.useState(false);
	const hasChildren = Object.keys(node.children).length > 0;

	return (
		<div style={{ marginLeft: `${level * 16}px` }}>
			{hasChildren ? (
				<Collapsible open={isOpen} onOpenChange={setIsOpen}>
					<CollapsibleTrigger className="flex items-center space-x-1 hover:bg-accent hover:text-accent-foreground rounded p-1 w-full text-left">
						{isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
						<Folder size={16} className="text-blue-500 dark:text-blue-400" />
						<span className="truncate">{node.name}</span>
					</CollapsibleTrigger>
					<CollapsibleContent>
						{Object.values(node.children).map((child, index) => (
							<FileTreeNode key={index} node={child} level={level + 1} />
						))}
					</CollapsibleContent>
				</Collapsible>
			) : (
				<div className="flex items-center space-x-1 hover:bg-accent hover:text-accent-foreground rounded p-1">
					<File size={16} className="text-foreground/70" />
					<span className="truncate">{node.name}</span>
				</div>
			)}
		</div>
	);
};

export const FileTree: React.FC<FileTreeProps> = ({ paths }) => {
	const tree = parseFileTree(paths);

	return (
		<ScrollArea className="max-w-[300px] max-h-[500px] h-full w-full ">
			<div className="p-2">
				{Object.values(tree.children).map((child, index) => (
					<FileTreeNode key={index} node={child} level={0} />
				))}
			</div>
			<ScrollBar orientation="horizontal" className="pb-4" />
		</ScrollArea>
	);
};
