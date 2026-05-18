import './style.css'
import { useEditor, EditorContent, NodeViewWrapper, ReactNodeViewRenderer } from "@tiptap/react"
import { Node, mergeAttributes } from "@tiptap/core"
import StarterKit from "@tiptap/starter-kit"
import Link from "@tiptap/extension-link"
import Underline from "@tiptap/extension-underline"
import Placeholder from "@tiptap/extension-placeholder"
import { TextStyle } from "@tiptap/extension-text-style"
import { useEditorState } from "@tiptap/react"
import { Button } from "./button"
import { Separator } from "./separator"
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  ImageIcon,
  Heading1,
  Heading2,
  Heading3,
  Pilcrow,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  RemoveFormatting,
  Link as LinkIcon,
  Minus,
  Loader2,
  Underline as UnderlineIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
} from "lucide-react"
import { useEffect, useRef, useState } from "react"

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  uploadImage?: (file: File) => Promise<string>
  disabled?: boolean
}

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max)

const parseWidthPercent = (width: string | undefined) => {
  if (!width) return 100
  const parsed = Number.parseInt(width, 10)
  return Number.isFinite(parsed) ? parsed : 100
}

const ResizableImageView = ({ node, selected, updateAttributes, editor }: any) => {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const dragStartRef = useRef<{ x: number; y: number; align: string } | null>(null)
  const resizeStartRef = useRef<{ x: number; width: number; direction: "left" | "right" } | null>(null)
  const [dragOffset, setDragOffset] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState(false)

  const width = node.attrs.width || "100%"
  const align = node.attrs.dataAlign || "center"

  const updateAlignFromPointer = (clientX: number) => {
    const parent = wrapperRef.current?.parentElement
    if (!parent) return

    const rect = parent.getBoundingClientRect()
    const relativeX = clientX - rect.left
    const third = rect.width / 3

    if (relativeX < third) {
      updateAttributes({ dataAlign: "left" })
    } else if (relativeX > third * 2) {
      updateAttributes({ dataAlign: "right" })
    } else {
      updateAttributes({ dataAlign: "center" })
    }
  }

  const startDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!editor.isEditable || isResizing) return
    event.preventDefault()
    event.currentTarget.setPointerCapture(event.pointerId)
    dragStartRef.current = { x: event.clientX, y: event.clientY, align }
    setIsDragging(true)
  }

  const dragImage = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!dragStartRef.current || !isDragging) return
    setDragOffset(clamp(event.clientX - dragStartRef.current.x, -180, 180))
  }

  const endDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!dragStartRef.current) return
    const distance = Math.abs(event.clientX - dragStartRef.current.x)
    if (distance > 24) {
      updateAlignFromPointer(event.clientX)
    }
    dragStartRef.current = null
    setDragOffset(0)
    setIsDragging(false)
  }

  const startResize = (direction: "left" | "right") => (event: React.PointerEvent<HTMLButtonElement>) => {
    if (!editor.isEditable) return
    event.preventDefault()
    event.stopPropagation()
    event.currentTarget.setPointerCapture(event.pointerId)
    resizeStartRef.current = {
      x: event.clientX,
      width: parseWidthPercent(width),
      direction,
    }
    setIsResizing(true)
  }

  const resizeImage = (event: React.PointerEvent<HTMLButtonElement>) => {
    if (!resizeStartRef.current) return
    event.preventDefault()
    event.stopPropagation()

    const parent = wrapperRef.current?.parentElement
    const parentWidth = parent?.getBoundingClientRect().width || 800
    const deltaPixels = event.clientX - resizeStartRef.current.x
    const directionMultiplier = resizeStartRef.current.direction === "right" ? 1 : -1
    const deltaPercent = (deltaPixels / parentWidth) * 100 * directionMultiplier
    const nextWidth = clamp(Math.round(resizeStartRef.current.width + deltaPercent), 20, 100)

    updateAttributes({ width: `${nextWidth}%` })
  }

  const endResize = (event: React.PointerEvent<HTMLButtonElement>) => {
    event.preventDefault()
    event.stopPropagation()
    resizeStartRef.current = null
    setIsResizing(false)
  }

  return (
    <NodeViewWrapper
      ref={wrapperRef}
      className={`tiptap-image-node tiptap-image-node--${align} ${selected ? "is-selected" : ""} ${isDragging ? "is-dragging" : ""}`}
      data-drag-handle
    >
      <div
        className="tiptap-image-frame"
        style={{ width, transform: dragOffset ? `translateX(${dragOffset}px)` : undefined }}
        onPointerDown={startDrag}
        onPointerMove={dragImage}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        <img
          src={node.attrs.src}
          alt={node.attrs.alt || ""}
          title={node.attrs.title || ""}
          draggable={false}
        />
        {(selected || isResizing || isDragging) && (
          <>
            <button
              type="button"
              className="tiptap-image-resize-handle tiptap-image-resize-handle--left"
              aria-label="Resize image from left"
              onPointerDown={startResize("left")}
              onPointerMove={resizeImage}
              onPointerUp={endResize}
              onPointerCancel={endResize}
            />
            <button
              type="button"
              className="tiptap-image-resize-handle tiptap-image-resize-handle--right"
              aria-label="Resize image from right"
              onPointerDown={startResize("right")}
              onPointerMove={resizeImage}
              onPointerUp={endResize}
              onPointerCancel={endResize}
            />
          </>
        )}
      </div>
    </NodeViewWrapper>
  )
}

const Image = Node.create({
  name: "image",
  group: "block",
  inline: false,
  atom: true,
  draggable: true,

  addAttributes() {
    return {
      src: {
        default: null,
      },
      alt: {
        default: null,
      },
      title: {
        default: null,
      },
      width: {
        default: "100%",
        parseHTML: (element: HTMLElement) => element.getAttribute("width") || element.style.width || "100%",
      },
      dataAlign: {
        default: "center",
        parseHTML: (element: HTMLElement) => element.getAttribute("data-align") || "center",
      },
    }
  },

  parseHTML() {
    return [{ tag: "img[src]" }]
  },

  renderHTML({ HTMLAttributes }) {
    const { dataAlign, width, style, ...attrs } = HTMLAttributes
    const alignmentStyles: Record<string, string> = {
      left: "margin-left:0;margin-right:auto;",
      center: "margin-left:auto;margin-right:auto;",
      right: "margin-left:auto;margin-right:0;",
    }

    return ["img", mergeAttributes(attrs, {
      "data-align": dataAlign,
      width,
      style: `width:${width};${alignmentStyles[dataAlign] || alignmentStyles.center}${style || ""}`,
    })]
  },

  addCommands() {
    return {
      setImage:
        (options: { src: string; alt?: string; title?: string; width?: string; dataAlign?: string }) =>
        ({ commands }: any) => {
          return commands.insertContent({
            type: this.name,
            attrs: options,
          })
        },
    } as any
  },

  addNodeView() {
    return ReactNodeViewRenderer(ResizableImageView)
  },
})

const MenuBar = ({ editor, uploadImage, disabled }: any) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isUploadingImage, setIsUploadingImage] = useState(false)

  const state = useEditorState({
    editor,
    selector: (ctx) => ({
      isBold: ctx.editor.isActive("bold"),
      isItalic: ctx.editor.isActive("italic"),
      isUnderline: ctx.editor.isActive("underline"),
      isStrike: ctx.editor.isActive("strike"),
      isCode: ctx.editor.isActive("code"),
      isH1: ctx.editor.isActive("heading", { level: 1 }),
      isH2: ctx.editor.isActive("heading", { level: 2 }),
      isH3: ctx.editor.isActive("heading", { level: 3 }),
      isBulletList: ctx.editor.isActive("bulletList"),
      isOrderedList: ctx.editor.isActive("orderedList"),
      isBlockquote: ctx.editor.isActive("blockquote"),
      isLink: ctx.editor.isActive("link"),
      isImage: ctx.editor.isActive("image"),
      imageWidth: ctx.editor.getAttributes("image").width || "100%",
      imageAlign: ctx.editor.getAttributes("image").dataAlign || "center",
      canUndo: ctx.editor.can().undo(),
      canRedo: ctx.editor.can().redo(),
    }),
  })

  const buttonDisabled = disabled || isUploadingImage

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href
    const url = window.prompt('URL', previousUrl)

    if (url === null) {
      return
    }

    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url, target: '_blank' }).run()
  }

  const addImageByUrl = () => {
    const src = window.prompt("Image URL")
    if (!src) return

    const alt = window.prompt("Image alt text", "") || ""
    ;(editor.chain().focus() as any).setImage({ src, alt, width: "100%", dataAlign: "center" }).run()
  }

  const uploadImageFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ""
    if (!file || !uploadImage) return

    try {
      setIsUploadingImage(true)
      const src = await uploadImage(file)
      ;(editor.chain().focus() as any).setImage({ src, alt: file.name, width: "100%", dataAlign: "center" }).run()
    } catch (error: any) {
      window.alert(error?.message || "Failed to upload image")
    } finally {
      setIsUploadingImage(false)
    }
  }

  if (!editor) return null

  return (
    <div className="flex flex-wrap items-center gap-1 p-2 border-b bg-muted rounded-t-lg">
      <Button
        type="button"
        variant={state.isBold ? "default" : "ghost"}
        size="icon"
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={buttonDisabled}
        className="h-8 w-8"
        title="Bold"
      >
        <Bold className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant={state.isItalic ? "default" : "ghost"}
        size="icon"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={buttonDisabled}
        className="h-8 w-8"
        title="Italic"
      >
        <Italic className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant={state.isUnderline ? "default" : "ghost"}
        size="icon"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        disabled={buttonDisabled}
        className="h-8 w-8"
        title="Underline"
      >
        <UnderlineIcon className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant={state.isStrike ? "default" : "ghost"}
        size="icon"
        onClick={() => editor.chain().focus().toggleStrike().run()}
        disabled={buttonDisabled}
        className="h-8 w-8"
        title="Strikethrough"
      >
        <Strikethrough className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant={state.isCode ? "default" : "ghost"}
        size="icon"
        onClick={() => editor.chain().focus().toggleCode().run()}
        disabled={buttonDisabled}
        className="h-8 w-8"
        title="Inline code"
      >
        <Code className="h-4 w-4" />
      </Button>

      <Separator orientation="vertical" className="h-6 mx-1" />

      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => editor.chain().focus().setParagraph().run()}
        disabled={buttonDisabled}
        className="h-8 w-8"
        title="Paragraph"
      >
        <Pilcrow className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant={state.isH1 ? "default" : "ghost"}
        size="sm"
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        disabled={buttonDisabled}
        className="h-8"
        title="Heading 1"
      >
        <Heading1 className="h-4 w-4 mr-1" /> H1
      </Button>
      <Button
        type="button"
        variant={state.isH2 ? "default" : "ghost"}
        size="sm"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        disabled={buttonDisabled}
        className="h-8"
        title="Heading 2"
      >
        <Heading2 className="h-4 w-4 mr-1" /> H2
      </Button>
      <Button
        type="button"
        variant={state.isH3 ? "default" : "ghost"}
        size="sm"
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        disabled={buttonDisabled}
        className="h-8"
        title="Heading 3"
      >
        <Heading3 className="h-4 w-4 mr-1" /> H3
      </Button>

      <Separator orientation="vertical" className="h-6 mx-1" />

      <Button
        type="button"
        variant={state.isBulletList ? "default" : "ghost"}
        size="icon"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        disabled={buttonDisabled}
        className="h-8 w-8"
        title="Bullet list"
      >
        <List className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant={state.isOrderedList ? "default" : "ghost"}
        size="icon"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        disabled={buttonDisabled}
        className="h-8 w-8"
        title="Numbered list"
      >
        <ListOrdered className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant={state.isBlockquote ? "default" : "ghost"}
        size="icon"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        disabled={buttonDisabled}
        className="h-8 w-8"
        title="Quote"
      >
        <Quote className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        disabled={buttonDisabled}
        className="h-8 w-8"
        title="Divider"
      >
        <Minus className="h-4 w-4" />
      </Button>

      <Separator orientation="vertical" className="h-6 mx-1" />

      <Button
        type="button"
        variant={state.isLink ? "default" : "ghost"}
        size="icon"
        onClick={setLink}
        disabled={buttonDisabled}
        className="h-8 w-8"
        title="Add Link"
      >
        <LinkIcon className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => fileInputRef.current?.click()}
        disabled={!uploadImage || buttonDisabled}
        className="h-8 w-8"
        title="Upload image"
      >
        {isUploadingImage ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImageIcon className="h-4 w-4" />}
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={addImageByUrl}
        disabled={buttonDisabled}
        className="h-8"
        title="Insert image URL"
      >
        <ImageIcon className="h-4 w-4 mr-1" /> URL
      </Button>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={uploadImageFile}
      />

      {state.isImage && (
        <>
          <Separator orientation="vertical" className="h-6 mx-1" />
          {["25%", "50%", "75%", "100%"].map((width) => (
            <Button
              key={width}
              type="button"
              variant={state.imageWidth === width ? "default" : "ghost"}
              size="sm"
              onClick={() => editor.chain().focus().updateAttributes("image", { width }).run()}
              disabled={buttonDisabled}
              className="h-8 px-2"
              title={`Image width ${width}`}
            >
              {width}
            </Button>
          ))}
          <Button
            type="button"
            variant={state.imageAlign === "left" ? "default" : "ghost"}
            size="icon"
            onClick={() => editor.chain().focus().updateAttributes("image", { dataAlign: "left" }).run()}
            disabled={buttonDisabled}
            className="h-8 w-8"
            title="Align image left"
          >
            <AlignLeft className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant={state.imageAlign === "center" ? "default" : "ghost"}
            size="icon"
            onClick={() => editor.chain().focus().updateAttributes("image", { dataAlign: "center" }).run()}
            disabled={buttonDisabled}
            className="h-8 w-8"
            title="Align image center"
          >
            <AlignCenter className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant={state.imageAlign === "right" ? "default" : "ghost"}
            size="icon"
            onClick={() => editor.chain().focus().updateAttributes("image", { dataAlign: "right" }).run()}
            disabled={buttonDisabled}
            className="h-8 w-8"
            title="Align image right"
          >
            <AlignRight className="h-4 w-4" />
          </Button>
        </>
      )}

      <Separator orientation="vertical" className="h-6 mx-1" />

      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => editor.chain().focus().unsetAllMarks().run()}
        disabled={buttonDisabled}
        className="h-8 w-8"
        title="Clear formatting"
      >
        <RemoveFormatting className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => editor.chain().focus().undo().run()}
        disabled={buttonDisabled || !state.canUndo}
        className="h-8 w-8"
        title="Undo"
      >
        <Undo className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => editor.chain().focus().redo().run()}
        disabled={buttonDisabled || !state.canRedo}
        className="h-8 w-8"
        title="Redo"
      >
        <Redo className="h-4 w-4" />
      </Button>
    </div>
  )
}

export const RichTextEditor = ({ value, onChange, placeholder, uploadImage, disabled }: RichTextEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Underline,
      Image,
      Placeholder.configure({
        placeholder: placeholder || "Write your content here...",
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          target: '_blank',
          rel: 'noopener noreferrer',
        },
      }),
      TextStyle,
    ],
    content: value,
    editable: !disabled,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: "prose prose-sm dark:prose-invert max-w-none p-4 min-h-64 focus:outline-none bg-background",
      },
    },
  })

  useEffect(() => {
    if (!editor) return

    if (value !== editor.getHTML()) {
      editor.commands.setContent(value || "", { emitUpdate: false })
    }
  }, [editor, value])

  useEffect(() => {
    editor?.setEditable(!disabled)
  }, [disabled, editor])

  if (!editor) return null

  return (
    <div className="border border-border rounded-lg overflow-hidden shadow-sm bg-background">
      <MenuBar editor={editor} uploadImage={uploadImage} disabled={disabled} />
      <EditorContent editor={editor} />
    </div>
  )
}
