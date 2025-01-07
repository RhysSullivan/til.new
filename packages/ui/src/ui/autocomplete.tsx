import { Command as CommandPrimitive } from 'cmdk';
import { Check } from 'lucide-react';
import { useMemo, useState } from 'react';
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandItem,
	CommandList,
} from './command';
import { Input } from './input';
import { Popover, PopoverAnchor, PopoverContent } from './popover';
import { Skeleton } from './skeleton';

type Props<T extends string> = {
	selectedValue: T;
	onSelectedValueChange: (value: T) => void;
	searchValue: string;
	onSearchValueChange: (value: string) => void;
	items: { value: T; label: string }[];
	isLoading?: boolean;
	emptyMessage?: string;
	placeholder?: string;
};

export function AutoComplete<T extends string>({
	selectedValue,
	onSelectedValueChange,
	searchValue,
	onSearchValueChange,
	items,
	isLoading,
	emptyMessage = 'No items.',
	placeholder = 'Search...',
}: Props<T>) {
	const [open, setOpen] = useState(false);

	const filteredItems = useMemo(() => {
		return items.filter((item) =>
			item.label.toLowerCase().includes(searchValue.toLowerCase()),
		);
	}, [items, searchValue]);

	const labels = useMemo(
		() =>
			items.reduce(
				(acc, item) => {
					acc[item.value] = item.label;
					return acc;
				},
				{} as Record<string, string>,
			),
		[items],
	);

	const reset = () => {
		onSelectedValueChange('' as T);
		onSearchValueChange('');
	};

	const onInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
		if (
			!e.relatedTarget?.hasAttribute('cmdk-list') &&
			labels[selectedValue] !== searchValue
		) {
			reset();
		}
	};

	const onSelectItem = (inputValue: string) => {
		if (inputValue === selectedValue) {
			reset();
		} else {
			onSelectedValueChange(inputValue as T);
			onSearchValueChange(labels[inputValue] ?? '');
		}
		setOpen(false);
	};

	return (
		<div className="flex items-center">
			<Popover open={open} onOpenChange={setOpen}>
				<Command shouldFilter={false}>
					<PopoverAnchor asChild>
						<CommandPrimitive.Input
							asChild
							value={searchValue}
							onValueChange={onSearchValueChange}
							onKeyDown={(e) => setOpen(e.key !== 'Escape')}
							onMouseDown={() => setOpen((open) => !!searchValue || !open)}
							onFocus={() => setOpen(true)}
							onBlur={onInputBlur}
						>
							<Input className="border-none" placeholder={placeholder} />
						</CommandPrimitive.Input>
					</PopoverAnchor>
					{!open && <CommandList aria-hidden="true" className="hidden" />}
					<PopoverContent
						asChild
						onOpenAutoFocus={(e) => e.preventDefault()}
						onInteractOutside={(e) => {
							if (
								e.target instanceof Element &&
								e.target.hasAttribute('cmdk-input')
							) {
								e.preventDefault();
							}
						}}
						className="w-[--radix-popover-trigger-width] p-0"
					>
						<CommandList>
							{isLoading && (
								<CommandPrimitive.Loading>
									<div className="p-1">
										<Skeleton className="h-6 w-full" />
									</div>
								</CommandPrimitive.Loading>
							)}
							{filteredItems.length > 0 && !isLoading ? (
								<CommandGroup>
									{filteredItems.map((option) => (
										<CommandItem
											key={option.value}
											value={option.value}
											onMouseDown={(e) => e.preventDefault()}
											onSelect={onSelectItem}
										>
											{option.label}
										</CommandItem>
									))}
								</CommandGroup>
							) : null}
							{!isLoading ? (
								<CommandEmpty>{emptyMessage ?? 'No items.'}</CommandEmpty>
							) : null}
						</CommandList>
					</PopoverContent>
				</Command>
			</Popover>
		</div>
	);
}
