import Editor from '@/components/editor/advanced-editor';
import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { useIsAuthenticated } from '@/hooks/data';
import { save } from '@/hooks/data';
import { useAuthActions } from '@convex-dev/auth/react';

export function NoteInput() {
	const [value, setValue] = useState<string | undefined>(undefined);
	const [title, setTitle] = useState<string | undefined>('');
	const { signIn } = useAuthActions();
	const isAuthenticated = useIsAuthenticated();
	const editor = useMemo(
		() => <Editor initialValue={value} onChange={setValue} />,
		[value],
	);
	return (
		<div className="flex flex-col p-6  rounded-xl max-w-xl w-full gap-4 ">
			<Input
				placeholder="New note"
				className="border-none border-b p-0 h-12 md:text-xl focus-visible:ring-0"
				onChange={(e) => setTitle(e.target.value)}
				value={title}
			/>
			{editor}
			{isAuthenticated ? (
				<Button
					disabled={!value}
					variant="outline"
					onClick={() => value && title && save({ title: title, value: value })}
				>
					Publish
				</Button>
			) : (
				<Button variant="outline" onClick={() => signIn('github')}>
					Sign In to Publish
				</Button>
			)}
		</div>
	);
}
