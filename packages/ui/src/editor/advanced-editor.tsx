'use client';
import React, { useRef, useState } from 'react';
import {
	EditorRoot,
	EditorCommand,
	EditorCommandItem,
	EditorCommandEmpty,
	EditorContent,
	type JSONContent,
	EditorCommandList,
	EditorBubble,
	useEditor,
} from 'novel';
import { ImageResizer, handleCommandNavigation } from 'novel/extensions';
import { defaultExtensions } from './extensions';
import { NodeSelector } from './selectors/node-selector';
import { LinkSelector } from './selectors/link-selector';
import { TextButtons } from './selectors/text-buttons';
import { slashCommand, suggestionItems } from './slash-command';
import { handleImageDrop, handleImagePaste } from 'novel/plugins';
import { uploadFn } from './image-upload';
import { Separator } from '../ui/separator';

const extensions = [...defaultExtensions, slashCommand];

interface EditorProp {
	initialValue?: string;
	onChange?: (value: string) => void;
}

// we need to access editor inside of editor content
// but useEditor hook is not available inside of editor content
// so we need to create a new hook that will be passed to editor content
// and will be used to access the editor via global context
import { createContext, useContext } from 'react';

const EditorContext = createContext<{
	editorRef: React.RefObject<ReturnType<typeof useEditor>['editor']>;
	setEditor: (editor: ReturnType<typeof useEditor>['editor']) => void;
} | null>(null);

function EditorProvider({ children }: { children: React.ReactNode }) {
	const editorRef = useRef<ReturnType<typeof useEditor>['editor']>(null);
	const setEditor = (editor: ReturnType<typeof useEditor>['editor']) => {
		editorRef.current = editor;
	};
	return (
		<EditorContext.Provider value={{ editorRef, setEditor }}>
			{children}
		</EditorContext.Provider>
	);
}

function useEditorContext() {
	const ctx = useContext(EditorContext);
	if (!ctx) {
		throw new Error('Editor context not found');
	}
	return ctx;
}

function EditorRaiser() {
	const { editor } = useEditor();
	const { setEditor, editorRef } = useEditorContext();
	if (editorRef.current === undefined) {
		setEditor(editor);
	}
	return null;
}

function EditorInternal({ initialValue, onChange }: EditorProp) {
	const [openNode, setOpenNode] = useState(false);
	const [openColor, setOpenColor] = useState(false);
	const [openLink, setOpenLink] = useState(false);
	const { editorRef } = useEditorContext();
	return (
		<EditorContent
			className="h-full min-h-[500px] prose"
			extensions={extensions}
			key="editor-content"
			initialContent={initialValue as unknown as JSONContent}
			ref={(ref) => {
				// onclick
				ref?.addEventListener('click', (el) => {
					// only focus if the click is on this specific element
					if (el.target === ref) {
						const editor = editorRef.current;
						if (editor) {
							editor.commands.focus('end');
						}
					}
				});
			}}
			editorProps={{
				handleDOMEvents: {
					keydown: (_view, event) => handleCommandNavigation(event),
				},
				handlePaste: (view, event) => handleImagePaste(view, event, uploadFn),
				handleDrop: (view, event, _slice, moved) =>
					handleImageDrop(view, event, moved, uploadFn),
				attributes: {
					class: `prose prose-lg dark:prose-invert prose-headings:font-title font-sans focus:outline-none max-w-full`,
				},
			}}
			onUpdate={({ editor }) => {
				onChange?.(editor.storage.markdown?.getMarkdown() ?? '');
			}}
			slotAfter={<ImageResizer />}
		>
			<EditorCommand className="z-50 h-auto max-h-[330px] overflow-y-auto rounded-md border border-muted bg-background px-1 py-2 shadow-md transition-all">
				<EditorCommandEmpty className="px-2 text-muted-foreground">
					No results
				</EditorCommandEmpty>
				<EditorCommandList>
					{suggestionItems.map((item) => (
						<EditorCommandItem
							value={item.title}
							onCommand={(val) => item.command?.(val)}
							className={`flex w-full items-center space-x-2 rounded-md px-2 py-1 text-left text-sm hover:bg-accent aria-selected:bg-accent `}
							key={item.title}
						>
							<div className="flex h-10 w-10 items-center justify-center rounded-md border border-muted bg-background">
								{item.icon}
							</div>
							<div>
								<p className="font-medium">{item.title}</p>
								<p className="text-xs text-muted-foreground">
									{item.description}
								</p>
							</div>
						</EditorCommandItem>
					))}
				</EditorCommandList>
			</EditorCommand>

			<EditorBubble
				tippyOptions={{
					placement: 'top',
				}}
				className="flex w-fit max-w-[90vw] overflow-hidden rounded-md border border-muted bg-background shadow-xl text-primary"
			>
				<Separator orientation="vertical" />
				<NodeSelector open={openNode} onOpenChange={setOpenNode} />
				<Separator orientation="vertical" />

				<LinkSelector open={openLink} onOpenChange={setOpenLink} />
				<Separator orientation="vertical" />
				<TextButtons />
			</EditorBubble>
			<EditorRaiser />
		</EditorContent>
	);
}
const Editor = ({ initialValue, onChange }: EditorProp) => {
	return (
		<EditorProvider>
			<EditorRoot>
				<EditorInternal initialValue={initialValue} onChange={onChange} />
			</EditorRoot>
		</EditorProvider>
	);
};

export default Editor;
