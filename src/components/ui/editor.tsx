import './style.css'
import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import { TextStyle } from "@tiptap/extension-text-style"
import { useEditorState } from "@tiptap/react"
import { Button } from "./button"
import { Separator } from "./separator"
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  RemoveFormatting,
} from "lucide-react"

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

const MenuBar = ({ editor }: any) => {
  const state = useEditorState({
    editor,
    selector: (ctx) => ({
      isBold: ctx.editor.isActive("bold"),
      isItalic: ctx.editor.isActive("italic"),
      isStrike: ctx.editor.isActive("strike"),
      isCode: ctx.editor.isActive("code"),
      isH1: ctx.editor.isActive("heading", { level: 1 }),
      isH2: ctx.editor.isActive("heading", { level: 2 }),
      isH3: ctx.editor.isActive("heading", { level: 3 }),
      isBulletList: ctx.editor.isActive("bulletList"),
      isOrderedList: ctx.editor.isActive("orderedList"),
      isBlockquote: ctx.editor.isActive("blockquote"),
      canUndo: ctx.editor.can().undo(),
      canRedo: ctx.editor.can().redo(),
    }),
  })

  if (!editor) return null

  return (
    <div className="flex flex-wrap items-center gap-1 p-2 border-b bg-gray-50 rounded-t-lg">
      <Button
        variant={state.isBold ? "default" : "ghost"}
        size="icon"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className="h-8 w-8"
      >
        <Bold className="h-4 w-4" />
      </Button>
      <Button
        variant={state.isItalic ? "default" : "ghost"}
        size="icon"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className="h-8 w-8"
      >
        <Italic className="h-4 w-4" />
      </Button>
      <Button
        variant={state.isStrike ? "default" : "ghost"}
        size="icon"
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className="h-8 w-8"
      >
        <Strikethrough className="h-4 w-4" />
      </Button>
      <Button
        variant={state.isCode ? "default" : "ghost"}
        size="icon"
        onClick={() => editor.chain().focus().toggleCode().run()}
        className="h-8 w-8"
      >
        <Code className="h-4 w-4" />
      </Button>

      <Separator orientation="vertical" className="h-6 mx-1" />

      <Button
        variant={state.isH1 ? "default" : "ghost"}
        size="sm"
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className="h-8"
      >
        <Heading1 className="h-4 w-4 mr-1" /> H1
      </Button>
      <Button
        variant={state.isH2 ? "default" : "ghost"}
        size="sm"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className="h-8"
      >
        <Heading2 className="h-4 w-4 mr-1" /> H2
      </Button>
      <Button
        variant={state.isH3 ? "default" : "ghost"}
        size="sm"
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className="h-8"
      >
        <Heading3 className="h-4 w-4 mr-1" /> H3
      </Button>

      <Separator orientation="vertical" className="h-6 mx-1" />

      <Button
        variant={state.isBulletList ? "default" : "ghost"}
        size="icon"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className="h-8 w-8"
      >
        <List className="h-4 w-4" />
      </Button>
      <Button
        variant={state.isOrderedList ? "default" : "ghost"}
        size="icon"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className="h-8 w-8"
      >
        <ListOrdered className="h-4 w-4" />
      </Button>
      <Button
        variant={state.isBlockquote ? "default" : "ghost"}
        size="icon"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className="h-8 w-8"
      >
        <Quote className="h-4 w-4" />
      </Button>

      <Separator orientation="vertical" className="h-6 mx-1" />

      <Button
        variant="ghost"
        size="icon"
        onClick={() => editor.chain().focus().unsetAllMarks().run()}
        className="h-8 w-8"
      >
        <RemoveFormatting className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!state.canUndo}
        className="h-8 w-8"
      >
        <Undo className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!state.canRedo}
        className="h-8 w-8"
      >
        <Redo className="h-4 w-4" />
      </Button>
    </div>
  )
}

export const RichTextEditor = ({ value, onChange, placeholder }: RichTextEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      TextStyle,
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: "prose prose-sm max-w-none p-4 min-h-64 focus:outline-none bg-white",
      },
    },
  })

  if (!editor) return null

  return (
    <div className="border rounded-lg overflow-hidden shadow-sm">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  )
}