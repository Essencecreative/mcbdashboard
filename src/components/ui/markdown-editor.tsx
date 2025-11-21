"use client"

import { useState, useRef } from "react"
import { Bold, Italic, List, ListOrdered, ImageIcon, LinkIcon, Code, Heading1, Heading2, Heading3 } from "lucide-react"
import { Button } from "./button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs"
import { Textarea } from "./textarea"
import { cn } from "../../lib/utils"
import ReactMarkdown from "react-markdown"

interface MarkdownEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  minHeight?: string
}

export function MarkdownEditor({
  value,
  onChange,
  placeholder = "Write your content here...",
  className,
  minHeight = "300px",
}: MarkdownEditorProps) {
  const [activeTab, setActiveTab] = useState<"write" | "preview">("write")
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Insert markdown syntax at cursor position
  const insertMarkdown = (syntax: string, placeholder = "") => {
    if (!textareaRef.current) return

    const textarea = textareaRef.current
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = value.substring(start, end)
    const beforeText = value.substring(0, start)
    const afterText = value.substring(end)

    let newText = ""
    let newCursorPos = 0

    if (selectedText) {
      // If text is selected, wrap it with the syntax
      newText = beforeText + syntax.replace(placeholder, selectedText) + afterText
      newCursorPos = start + syntax.replace(placeholder, selectedText).length
    } else {
      // If no text is selected, insert syntax with placeholder
      newText = beforeText + syntax + afterText
      newCursorPos = start + syntax.indexOf(placeholder) + placeholder.length
    }

    onChange(newText)

    // Set focus back to textarea and position cursor
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(
        syntax.includes(placeholder) ? start + syntax.indexOf(placeholder) : start + syntax.length,
        newCursorPos,
      )
    }, 0)
  }

  // Toolbar button handlers
  const handleBold = () => insertMarkdown("**placeholder**", "placeholder")
  const handleItalic = () => insertMarkdown("*placeholder*", "placeholder")
  const handleH1 = () => insertMarkdown("# placeholder\n", "placeholder")
  const handleH2 = () => insertMarkdown("## placeholder\n", "placeholder")
  const handleH3 = () => insertMarkdown("### placeholder\n", "placeholder")
  const handleLink = () => insertMarkdown("[placeholder](url)", "placeholder")
  const handleImage = () => insertMarkdown("![alt text](image-url)", "alt text")
  const handleCode = () => insertMarkdown("```\nplaceholder\n```", "placeholder")
  const handleList = () => insertMarkdown("\n- Item 1\n- Item 2\n- Item 3\n")
  const handleOrderedList = () => insertMarkdown("\n1. Item 1\n2. Item 2\n3. Item 3\n")

  return (
    <div className={cn("border rounded-md", className)}>
      <div className="flex items-center gap-1 p-2 border-b bg-muted/50">
        <Button variant="ghost" size="icon" onClick={handleBold} title="Bold">
          <Bold className="h-4 w-4" />
          <span className="sr-only">Bold</span>
        </Button>
        <Button variant="ghost" size="icon" onClick={handleItalic} title="Italic">
          <Italic className="h-4 w-4" />
          <span className="sr-only">Italic</span>
        </Button>
        <Button variant="ghost" size="icon" onClick={handleH1} title="Heading 1">
          <Heading1 className="h-4 w-4" />
          <span className="sr-only">Heading 1</span>
        </Button>
        <Button variant="ghost" size="icon" onClick={handleH2} title="Heading 2">
          <Heading2 className="h-4 w-4" />
          <span className="sr-only">Heading 2</span>
        </Button>
        <Button variant="ghost" size="icon" onClick={handleH3} title="Heading 3">
          <Heading3 className="h-4 w-4" />
          <span className="sr-only">Heading 3</span>
        </Button>
        <Button variant="ghost" size="icon" onClick={handleLink} title="Link">
          <LinkIcon className="h-4 w-4" />
          <span className="sr-only">Link</span>
        </Button>
        <Button variant="ghost" size="icon" onClick={handleImage} title="Image">
          <ImageIcon className="h-4 w-4" />
          <span className="sr-only">Image</span>
        </Button>
        <Button variant="ghost" size="icon" onClick={handleList} title="Bullet List">
          <List className="h-4 w-4" />
          <span className="sr-only">Bullet List</span>
        </Button>
        <Button variant="ghost" size="icon" onClick={handleOrderedList} title="Numbered List">
          <ListOrdered className="h-4 w-4" />
          <span className="sr-only">Numbered List</span>
        </Button>
        <Button variant="ghost" size="icon" onClick={handleCode} title="Code Block">
          <Code className="h-4 w-4" />
          <span className="sr-only">Code Block</span>
        </Button>
      </div>

      <Tabs
        defaultValue="write"
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as "write" | "preview")}
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="write">Write</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>
        <TabsContent value="write" className="p-0 border-0">
          <Textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="border-0 rounded-none focus-visible:ring-0 resize-none"
            style={{ minHeight }}
          />
        </TabsContent>
        <TabsContent value="preview" className="p-4 prose max-w-none min-h-[300px] border-0">
          {value ? <ReactMarkdown>{value}</ReactMarkdown> : <p className="text-muted-foreground">Nothing to preview</p>}
        </TabsContent>
      </Tabs>
    </div>
  )
}
