'use client';

import React, { useState, useEffect, useRef, KeyboardEvent } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';

interface FolderSelectorProps {
	availablePaths: string[];
	onSelect: (path: string) => void;
}

export function isValidPath(path: string): boolean {
	// More permissive path validation: starts with '/', contains valid characters
	// Allows for multiple segments and file extensions
	const validPathRegex = /^(\/[a-zA-Z0-9_\-. ]+)+\/?$/;
	return validPathRegex.test(path);
}

export function ensureLeadingSlash(path: string): string {
	return path.startsWith('/') ? path : `/${path}`;
}

export function sanitizePath(path: string): string {
	let sanitized = ensureLeadingSlash(path);
	// Remove any double slashes (except at the beginning)
	sanitized = sanitized.replace(/(?!^)\/+/g, '/');
	// Remove trailing slash if it's not the root directory
	sanitized = sanitized.length > 1 ? sanitized.replace(/\/$/, '') : sanitized;
	return sanitized;
}

export function FolderSelector({
	availablePaths,
	onSelect,
}: FolderSelectorProps) {
	const [inputValue, setInputValue] = useState('');
	const [filteredPaths, setFilteredPaths] = useState(availablePaths);
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const [highlightedIndex, setHighlightedIndex] = useState(-1);
	const [error, setError] = useState<string | null>(null);
	const inputRef = useRef<HTMLInputElement>(null);
	const dropdownRef = useRef<HTMLDivElement>(null);
	const optionsRef = useRef<(HTMLDivElement | null)[]>([]);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setIsDropdownOpen(false);
				setHighlightedIndex(-1);
				validateAndUpdateInput();
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

	useEffect(() => {
		const sanitizedInput = sanitizePath(inputValue);
		let filtered = availablePaths.filter((path) =>
			path.toLowerCase().includes(sanitizedInput.toLowerCase()),
		);

		// Add the current input to the end of filtered paths if it's not already there
		if (sanitizedInput && !filtered.includes(sanitizedInput)) {
			filtered = [...filtered, sanitizedInput];
		}

		setFilteredPaths(filtered);
		setHighlightedIndex(filtered.length > 0 ? 0 : -1);
		optionsRef.current = new Array(filtered.length);
	}, [inputValue, availablePaths]);

	useEffect(() => {
		if (highlightedIndex >= 0 && optionsRef.current[highlightedIndex]) {
			optionsRef.current[highlightedIndex]?.focus();
		}
	}, [highlightedIndex]);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newValue = e.target.value;
		setInputValue(newValue);
		// Only show dropdown if actively typing
		if (newValue !== inputValue) {
			setIsDropdownOpen(true);
		}
		if (isValidPath(sanitizePath(newValue)) || newValue.trim() === '') {
			setError(null);
		}
	};

	const handlePathSelect = (path: string) => {
		const sanitizedPath = sanitizePath(path);
		setInputValue(sanitizedPath);
		onSelect(sanitizedPath);
		setIsDropdownOpen(false);
		setHighlightedIndex(-1);
		setError(null);
		inputRef.current?.focus();
	};

	const validateAndUpdateInput = () => {
		const sanitizedPath = sanitizePath(inputValue);
		if (isValidPath(sanitizedPath)) {
			setInputValue(sanitizedPath);
			onSelect(sanitizedPath);
			setError(null);
		} else if (inputValue.trim() !== '') {
			setError('Invalid path. Please enter a valid file path.');
		} else {
			setError(null);
		}
	};

	const toggleDropdown = () => {
		setIsDropdownOpen(!isDropdownOpen);
		if (!isDropdownOpen) {
			inputRef.current?.focus();
		} else {
			setHighlightedIndex(-1);
			validateAndUpdateInput();
		}
	};

	const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
			e.preventDefault();
			if (!isDropdownOpen) {
				setIsDropdownOpen(true);
				return;
			}

			const direction = e.key === 'ArrowDown' ? 1 : -1;
			const lastIndex = filteredPaths.length - 1;
			let newIndex = highlightedIndex + direction;

			if (newIndex < 0) newIndex = lastIndex;
			if (newIndex > lastIndex) newIndex = 0;

			setHighlightedIndex(newIndex);
		} else if (e.key === 'Enter') {
			if (highlightedIndex >= 0) {
				handlePathSelect(filteredPaths[highlightedIndex]!);
			} else {
				validateAndUpdateInput();
			}
			setIsDropdownOpen(false);
		} else if (e.key === 'Escape') {
			setIsDropdownOpen(false);
			setHighlightedIndex(-1);
			validateAndUpdateInput();
		} else if (highlightedIndex !== -1) {
			setHighlightedIndex(-1);
			inputRef.current?.focus();
		}
	};

	const handleOptionKeyDown = (
		e: KeyboardEvent<HTMLDivElement>,
		index: number,
	) => {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			handlePathSelect(filteredPaths[index]!);
		} else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
			e.preventDefault();
			const direction = e.key === 'ArrowDown' ? 1 : -1;
			const lastIndex = filteredPaths.length - 1;
			let newIndex = index + direction;

			if (newIndex < 0) newIndex = lastIndex;
			if (newIndex > lastIndex) newIndex = 0;

			setHighlightedIndex(newIndex);
		} else if (e.key === 'Escape') {
			setIsDropdownOpen(false);
			setHighlightedIndex(-1);
			inputRef.current?.focus();
		} else {
			inputRef.current?.focus();
		}
	};

	return (
		<div className="relative w-full max-w-md" ref={dropdownRef}>
			<div className="flex flex-col">
				<div className="relative">
					<Input
						ref={inputRef}
						type="text"
						value={inputValue}
						onChange={handleInputChange}
						onKeyDown={handleKeyDown}
						onBlur={validateAndUpdateInput}
						placeholder="Select or enter a folder path"
						className={`pr-10 ${error ? 'border-destructive' : ''}`}
						role="combobox"
						aria-expanded={isDropdownOpen}
						aria-controls="folder-options"
						aria-activedescendant={
							highlightedIndex >= 0 ? `option-${highlightedIndex}` : undefined
						}
					/>
					<Button
						variant="ghost"
						size="icon"
						className="absolute right-0 top-0 h-full"
						onClick={toggleDropdown}
						aria-label={
							isDropdownOpen
								? 'Close folder selection'
								: 'Open folder selection'
						}
					>
						{isDropdownOpen ? (
							<ChevronUp className="h-4 w-4" />
						) : (
							<ChevronDown className="h-4 w-4" />
						)}
					</Button>
				</div>
				{error && (
					<p className="text-destructive text-sm mt-1" role="alert">
						{error}
					</p>
				)}
			</div>
			{isDropdownOpen && (
				<div
					className="absolute z-10 w-full mt-1 bg-popover text-popover-foreground border border-input rounded-md shadow-lg"
					role="listbox"
					id="folder-options"
				>
					<ScrollArea className="h-64">
						<div className="py-1">
							{filteredPaths.length > 0 ? (
								filteredPaths.map((path, index) => (
									<div
										key={index}
										ref={(el) => {
											optionsRef.current[index] = el;
										}}
										className={`px-4 py-2 cursor-pointer outline-none ${
											index === highlightedIndex
												? 'bg-accent text-accent-foreground'
												: 'hover:bg-accent hover:text-accent-foreground'
										}`}
										onClick={() => handlePathSelect(path)}
										onMouseEnter={() => setHighlightedIndex(index)}
										onKeyDown={(e) => handleOptionKeyDown(e, index)}
										role="option"
										tabIndex={0}
										aria-selected={index === highlightedIndex}
										id={`option-${index}`}
									>
										{path}
									</div>
								))
							) : (
								<div className="px-4 py-2 text-muted-foreground">
									No matching paths
								</div>
							)}
						</div>
					</ScrollArea>
				</div>
			)}
		</div>
	);
}
