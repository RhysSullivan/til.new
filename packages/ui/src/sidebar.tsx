'use client';

import { LogOut, Plus } from 'lucide-react';
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
import { signOut } from './utils/auth';
import { FileTree } from './file-tree';
import { GitHubInstallButton } from './github-install';

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
	return (
		<div className="space-y-2">
			<FileTree
				paths={repo.files.map((file) => file.path ?? '')}
				repoName={repo.name}
			/>
		</div>
	);
}

export function Sidebar() {
	const { data: repos } = useRepositories();

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

					<GitHubInstallButton />
				</div>
			</ScrollArea>
		</div>
	);
}
