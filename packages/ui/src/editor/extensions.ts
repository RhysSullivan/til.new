import {
	TiptapImage,
	TiptapLink,
	UpdatedImage,
	TaskList,
	TaskItem,
	HorizontalRule,
	StarterKit,
	Placeholder,
	AIHighlight,
	MarkdownExtension,
} from 'novel/extensions';
import { UploadImagesPlugin } from 'novel/plugins';
import { cx } from 'class-variance-authority';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { createLowlight, all } from 'lowlight';

const lowlight = createLowlight(all);

const aiHighlight = AIHighlight;
const placeholder = Placeholder.configure({
	placeholder: 'Write something …',
});
const tiptapLink = TiptapLink.configure({
	HTMLAttributes: {
		class: cx(
			'text-muted-foreground underline underline-offset-[3px] hover:text-primary transition-colors cursor-pointer',
		),
	},
});

const tiptapImage = TiptapImage.extend({
	addProseMirrorPlugins() {
		return [
			UploadImagesPlugin({
				imageClass: cx('opacity-40 rounded-lg border border-stone-200'),
			}),
		];
	},
}).configure({
	allowBase64: true,
	HTMLAttributes: {
		class: cx('rounded-lg border border-muted'),
	},
});

const updatedImage = UpdatedImage.configure({
	HTMLAttributes: {
		class: cx('rounded-lg border border-muted'),
	},
});

const taskList = TaskList.configure({
	HTMLAttributes: {
		class: cx('not-prose pl-2 '),
	},
});
const taskItem = TaskItem.configure({
	HTMLAttributes: {
		class: cx('flex gap-2 items-start my-4'),
	},
	nested: true,
});

const horizontalRule = HorizontalRule.configure({
	HTMLAttributes: {
		class: cx('mt-4 mb-6 border-t border-muted-foreground'),
	},
});

const starterKit = StarterKit.configure({
	bulletList: {
		HTMLAttributes: {
			class: cx('list-disc list-outside leading-3 -mt-2'),
		},
	},
	orderedList: {
		HTMLAttributes: {
			class: cx('list-decimal list-outside leading-3 -mt-2'),
		},
	},
	listItem: {
		HTMLAttributes: {
			class: cx('leading-normal -mb-2'),
		},
	},
	blockquote: {
		HTMLAttributes: {
			class: cx('border-l-4 border-primary'),
		},
	},
	codeBlock: false,
	code: {
		HTMLAttributes: {
			class: cx(
				'rounded-md bg-muted px-1.5 py-1 font-mono font-medium whitespace-pre',
			),
			spellcheck: 'false',
		},
	},
	horizontalRule: false,
	dropcursor: {
		color: '#DBEAFE',
		width: 4,
	},
	gapcursor: false,
});

const codeBlockLowlight = CodeBlockLowlight.configure({
	lowlight,
	HTMLAttributes: {
		class: cx(
			'rounded-md bg-muted text-muted-foreground border p-5 font-mono font-medium',
			'overflow-x-auto whitespace-pre tab-size-4',
		),
	},
});

const markdownExtension = MarkdownExtension.configure({
	html: true,
	tightLists: true,
	tightListClass: 'tight',
	bulletListMarker: '-',
	linkify: false,
	breaks: true,
	transformPastedText: false,
	transformCopiedText: false,
});

export const defaultExtensions = [
	starterKit,
	placeholder,
	tiptapLink,
	tiptapImage,
	updatedImage,
	taskList,
	taskItem,
	horizontalRule,
	aiHighlight,
	markdownExtension,
	codeBlockLowlight,
];
