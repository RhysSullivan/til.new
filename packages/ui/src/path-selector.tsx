'use client';

import * as React from 'react';
import {
	Select,
	SelectTrigger,
	SelectValue,
	SelectContent,
	SelectItem,
} from './ui/select';
import { AutoComplete } from './ui/autocomplete';
import { Repository } from '@til/api/index';

export function PathSelector({
	repositories,
	selectedRepoName,
	setSelectedRepoName,
	selectedPath,
	setSelectedPath,
}: {
	repositories: Repository[];
	selectedRepoName: string;
	setSelectedRepoName: (name: string) => void;
	selectedPath: string;
	setSelectedPath: (path: string) => void;
}) {
	const [searchValue, setSearchValue] = React.useState('');
	const selectedRepo = repositories.find(
		(repo) => repo.name === selectedRepoName,
	);
	const paths =
		selectedRepo?.files
			.filter((file) => file.type === 'tree')
			.map((file) => file.path)
			.filter(Boolean) ?? [];
	return (
		<div className="flex items-center gap-1 rounded-md border bg-background p-1">
			<div className="flex items-center">
				<span className="px-2 text-sm text-muted-foreground">/</span>
				<Select value={selectedRepoName} onValueChange={setSelectedRepoName}>
					<SelectTrigger className="w-[180px] border-0 bg-transparent focus:ring-0">
						<SelectValue placeholder="Select repository" />
					</SelectTrigger>
					<SelectContent>
						{repositories.map((repository) => (
							<SelectItem key={repository.name} value={repository.name}>
								{repository.name}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
				<span className="px-2 text-sm text-muted-foreground">/</span>
			</div>
			<AutoComplete
				items={paths.map((path) => ({
					value: path,
					label: path,
				}))}
				selectedValue={selectedPath}
				onSelectedValueChange={setSelectedPath}
				searchValue={searchValue}
				onSearchValueChange={setSearchValue}
			/>
		</div>
	);
}
