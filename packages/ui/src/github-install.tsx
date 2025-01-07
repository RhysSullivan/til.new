'use client';

import { useState } from 'react';
import { Github, ChevronDown } from 'lucide-react';
import { Button } from './ui/button';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuItem,
} from './ui/dropdown-menu';
import { useIsAuthenticated, useRepositories } from './hooks/data';

const GITHUB_APP_INSTALL_URL =
	process.env.NEXT_PUBLIC_GITHUB_APP_INSTALL_URL ??
	'https://github.com/apps/til-new/installations/new';

function TemplateSteps() {
	const [currentStep, setCurrentStep] = useState(1);

	return (
		<div className="space-y-4">
			<div className="space-y-2">
				<h3 className="text-lg font-semibold">Step 1: Copy the template</h3>
				<p className="text-sm text-muted-foreground">
					First, you'll need to copy our template to your GitHub account.
				</p>
				<Button asChild disabled={currentStep !== 1}>
					<a
						href="https://github.com/new?template_name=til-template&template_owner=RhysSullivan&name=til.new&description=Quick+notes+captured+on+til.new"
						onClick={() => setCurrentStep(2)}
						target="_blank"
					>
						Copy Template
					</a>
				</Button>
			</div>

			<div className="space-y-2">
				<h3 className="text-lg font-semibold">
					Step 2: Install the GitHub App
				</h3>
				<p className="text-sm text-muted-foreground">
					After creating your repository, you'll need to install our GitHub App
					to enable all features.
				</p>
				<Button asChild disabled={currentStep !== 2}>
					<a href={GITHUB_APP_INSTALL_URL} target="_blank">
						Install GitHub App
					</a>
				</Button>
			</div>
		</div>
	);
}

export function GitHubInstallButton() {
	const [isOpen, setIsOpen] = useState(false);
	const [showModal, setShowModal] = useState(false);

	const handleTemplateRepo = () => {
		setShowModal(true);
		setIsOpen(false);
	};

	const isAuthed = useIsAuthenticated();
	const repos = useRepositories();
	if (!isAuthed) {
		return null;
	}
	return (
		<>
			<DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
				<DropdownMenuTrigger asChild>
					<Button variant="ghost" className="w-full justify-start">
						<Github className="mr-2 h-4 w-4" />+{' '}
						{!repos.data?.length ? 'Install GitHub app' : 'Add repository'}
						<ChevronDown className="ml-2 h-4 w-4" />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent className="w-56">
					<DropdownMenuItem onClick={handleTemplateRepo}>
						I need to copy a template
					</DropdownMenuItem>
					<DropdownMenuItem asChild>
						<a href={GITHUB_APP_INSTALL_URL} target="_blank">
							I have my own repo
						</a>
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>

			<Dialog open={showModal} onOpenChange={setShowModal}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Copy a Template and Install GitHub App</DialogTitle>
					</DialogHeader>
					<TemplateSteps />
				</DialogContent>
			</Dialog>
		</>
	);
}
