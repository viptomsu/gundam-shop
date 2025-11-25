"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import { Toggle } from "@/components/ui/toggle";
import { cn } from "@/lib/utils";
import {
	Bold,
	Italic,
	Underline as UnderlineIcon,
	Strikethrough,
	List,
	ListOrdered,
	Heading1,
	Heading2,
	Heading3,
} from "lucide-react";

interface EditorProps {
	value: string;
	onChange: (value: string) => void;
	disabled?: boolean;
	className?: string;
	"aria-invalid"?: boolean;
}

export function Editor({
	value,
	onChange,
	disabled,
	className,
	"aria-invalid": ariaInvalid,
}: EditorProps) {
	const editor = useEditor({
		extensions: [
			StarterKit,
			Underline,
			Link.configure({
				openOnClick: false,
			}),
		],
		content: value,
		editorProps: {
			attributes: {
				class:
					"min-h-[150px] w-full bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 rich-text",
			},
		},
		onUpdate: ({ editor }) => {
			onChange(editor.getHTML());
		},
		editable: !disabled,
		immediatelyRender: false,
	});

	if (!editor) {
		return null;
	}

	return (
		<div
			className={cn(
				"flex flex-col gap-2 tech-input-base bg-transparent p-2",
				className
			)}
			aria-invalid={ariaInvalid}>
			<div className="flex items-center gap-1 p-1 bg-transparent">
				<Toggle
					size="sm"
					pressed={editor.isActive("heading", { level: 1 })}
					onPressedChange={() =>
						editor.chain().focus().toggleHeading({ level: 1 }).run()
					}
					disabled={disabled}>
					<Heading1 className="h-4 w-4" />
				</Toggle>
				<Toggle
					size="sm"
					pressed={editor.isActive("heading", { level: 2 })}
					onPressedChange={() =>
						editor.chain().focus().toggleHeading({ level: 2 }).run()
					}
					disabled={disabled}>
					<Heading2 className="h-4 w-4" />
				</Toggle>
				<Toggle
					size="sm"
					pressed={editor.isActive("heading", { level: 3 })}
					onPressedChange={() =>
						editor.chain().focus().toggleHeading({ level: 3 }).run()
					}
					disabled={disabled}>
					<Heading3 className="h-4 w-4" />
				</Toggle>
				<div className="w-px h-6 bg-border mx-1" />
				<Toggle
					size="sm"
					pressed={editor.isActive("bold")}
					onPressedChange={() => editor.chain().focus().toggleBold().run()}
					disabled={disabled}>
					<Bold className="h-4 w-4" />
				</Toggle>
				<Toggle
					size="sm"
					pressed={editor.isActive("italic")}
					onPressedChange={() => editor.chain().focus().toggleItalic().run()}
					disabled={disabled}>
					<Italic className="h-4 w-4" />
				</Toggle>
				<Toggle
					size="sm"
					pressed={editor.isActive("underline")}
					onPressedChange={() => editor.chain().focus().toggleUnderline().run()}
					disabled={disabled}>
					<UnderlineIcon className="h-4 w-4" />
				</Toggle>
				<Toggle
					size="sm"
					pressed={editor.isActive("strike")}
					onPressedChange={() => editor.chain().focus().toggleStrike().run()}
					disabled={disabled}>
					<Strikethrough className="h-4 w-4" />
				</Toggle>
				<div className="w-[1px] h-6 bg-border mx-1" />
				<Toggle
					size="sm"
					pressed={editor.isActive("bulletList")}
					onPressedChange={() =>
						editor.chain().focus().toggleBulletList().run()
					}
					disabled={disabled}>
					<List className="h-4 w-4" />
				</Toggle>
				<Toggle
					size="sm"
					pressed={editor.isActive("orderedList")}
					onPressedChange={() =>
						editor.chain().focus().toggleOrderedList().run()
					}
					disabled={disabled}>
					<ListOrdered className="h-4 w-4" />
				</Toggle>
			</div>
			<EditorContent editor={editor} />
		</div>
	);
}
