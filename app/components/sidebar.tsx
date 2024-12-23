'use client';

import { Button } from '@/components/ui/button';
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
	ChevronRight,
	FileText,
	FolderClosed,
	LogOut,
	Plus,
	Settings,
} from 'lucide-react';
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuthedUser, useRepositories } from '@/hooks/data';
import { useAuthActions } from '@convex-dev/auth/react';

function UserDropdown(){
	const { data: user } = useAuthedUser();
	const { signOut } = useAuthActions();

	if(!user) return null;
	return (
		<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" className="w-full justify-start h-12">
							<Avatar className="h-5 w-5 mr-2">
								<AvatarImage src={user.image} />
								<AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
							</Avatar>
							{user.name}
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="center" className="w-56">
						<DropdownMenuItem>
							<Settings className="mr-2 h-4 w-4" />
							Settings
						</DropdownMenuItem>
						<DropdownMenuItem onClick={() => signOut()}>
							<LogOut className="mr-2 h-4 w-4" />
							Sign out
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
	)
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
	const { repositories } = useRepositories();
	const { data: user } = useAuthedUser();
	return (
		<div className="w-64 border-r bg-muted/50 flex flex-col">
			<div className="border-b max-h-12 min-h-12">
				<UserDropdown />
			</div>
			<ScrollArea className="flex-1 px-2 py-4">
				<div className="space-y-2">
					{repositories.map((repo) => (
						<Collapsible
							key={repo.name}
							open={openRepos.includes(repo.name)}
							onOpenChange={() => toggleRepo(repo.name)}
						>
							<CollapsibleTrigger asChild>
								<Button
									variant="ghost"
									className="w-full justify-start font-normal"
								>
									<ChevronRight
										className={`h-4 w-4 mr-2 transition-transform ${
											openRepos.includes(repo.name) ? 'rotate-90' : ''
										}`}
									/>
									<FolderClosed className="h-4 w-4 mr-2" />
									{repo.name}
								</Button>
							</CollapsibleTrigger>
							<CollapsibleContent className="pl-8 space-y-1">
								{repo.files.map((file) => (
									<Button
										key={file}
										variant="ghost"
										className="w-full justify-start h-8 font-normal"
									>
										<FileText className="h-4 w-4 mr-2" />
										{file.split('/').pop()}
									</Button>
								))}
							</CollapsibleContent>
						</Collapsible>
					))}
					<Button
						variant="ghost"
						className="w-full justify-start text-muted-foreground"
					>
						<Plus className="mr-2 h-4 w-4" />
						Add Repository
					</Button>
				</div>
			</ScrollArea>
		</div>
	);
}
