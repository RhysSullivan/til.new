'use client';

import {
	ChevronDown,
	ChevronRight,
	FileText,
	Folder,
	FolderClosed,
	LogOut,
	Plus,
	Settings,
} from 'lucide-react';
import { useState } from 'react';
import { useAuthedUser, useRepositories } from './hooks/data';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuItem,
} from './ui/dropdown-menu';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from './ui/collapsible';
import { signOut } from './utils/auth';
import { FileTree } from './file-tree';

function UserDropdown() {
	const { data: user } = useAuthedUser();

	if (!user) return null;
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" className="w-full justify-start h-12">
					<Avatar className="h-5 w-5 mr-2">
						<AvatarImage src={user.avatar_url} />
						<AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
					</Avatar>
					{user.name}
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="center" className="w-56">
				{/* <DropdownMenuItem>
					<Settings className="mr-2 h-4 w-4" />
					Settings
				</DropdownMenuItem> */}
				<DropdownMenuItem onClick={() => signOut()}>
					<LogOut className="mr-2 h-4 w-4" />
					Sign out
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

function RepositoryItem({
	repo,
}: {
	repo: { name: string; files: { path?: string }[] };
}) {
	const [isOpen, setIsOpen] = useState(false);
	return (
		<div className="space-y-2">
			<Collapsible open={isOpen} onOpenChange={setIsOpen}>
				<CollapsibleTrigger className="flex items-center space-x-1 hover:bg-accent hover:text-accent-foreground rounded p-1 w-full text-left">
					{isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
					<Folder size={16} className="text-blue-500 dark:text-blue-400" />
					<span className="truncate">{repo.name}</span>
				</CollapsibleTrigger>
				<CollapsibleContent>
					<div className="pl-2">
						<FileTree paths={repo.files.map((file) => file.path ?? '')} />
					</div>
				</CollapsibleContent>
			</Collapsible>
		</div>
	);
}

export function Sidebar() {
	const [openRepos, setOpenRepos] = useState<string[]>([]);

	const toggleRepo = (name: string) => {
		setOpenRepos((prev) =>
			prev.includes(name)
				? prev.filter((repo) => repo !== name)
				: [...prev, name],
		);
	};
	const { data: repos } = useRepositories();
	const { data: user } = useAuthedUser();

	return (
		<div className="w-64 border-r bg-muted/50 flex flex-col">
			<div className="border-b max-h-12 min-h-12">
				<UserDropdown />
			</div>
			<ScrollArea className="flex-1 px-2 py-4 overflow-x-auto w-64 max-w-64">
				<div className="space-y-2">
					{repos?.map((repo) => (
						<RepositoryItem key={repo.name} repo={repo} />
					))}

					<Button
						variant="ghost"
						className="w-full justify-start text-muted-foreground"
						asChild
					>
						<a
							href="https://github.com/apps/til-new-dev/installations/new"
							target="_blank"
						>
							<Plus className="mr-2 h-4 w-4" />
							Add Repository
						</a>
					</Button>
				</div>
			</ScrollArea>
		</div>
	);
}
