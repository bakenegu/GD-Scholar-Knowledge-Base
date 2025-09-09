"use client"

import React, { useRef } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

interface MarkdownEditorProps {
  value: string
  onChange: (v: string) => void
  placeholder?: string
  className?: string
}

export function MarkdownEditor({ value, onChange, placeholder, className }: MarkdownEditorProps) {
  const ref = useRef<HTMLTextAreaElement | null>(null)

  const insert = (syntax: (selected: string) => string) => {
    const el = ref.current
    if (!el) return
    const start = el.selectionStart ?? value.length
    const end = el.selectionEnd ?? value.length
    const before = value.slice(0, start)
    const selected = value.slice(start, end)
    const after = value.slice(end)
    const inserted = syntax(selected || "")
    const next = `${before}${inserted}${after}`
    onChange(next)
    requestAnimationFrame(() => {
      el.focus()
      const cursor = before.length + inserted.length
      el.setSelectionRange(cursor, cursor)
    })
  }

  return (
    <div className={cn("border rounded-lg overflow-hidden", className)}>
      <div className="flex items-center gap-1 px-2 py-1 border-b bg-muted/30">
        <Button type="button" size="sm" variant="ghost" className="h-7 px-2" onClick={() => insert(sel => `**${sel || "bold"}**`)}>B</Button>
        <Button type="button" size="sm" variant="ghost" className="h-7 px-2 italic" onClick={() => insert(sel => `*${sel || "italic"}*`)}>I</Button>
        <Button type="button" size="sm" variant="ghost" className="h-7 px-2" onClick={() => insert(sel => `# ${sel || "Heading 1"}`)}>
          H1
        </Button>
        <Button type="button" size="sm" variant="ghost" className="h-7 px-2" onClick={() => insert(sel => `## ${sel || "Heading 2"}`)}>
          H2
        </Button>
        <Button type="button" size="sm" variant="ghost" className="h-7 px-2" onClick={() => insert(sel => `### ${sel || "Heading 3"}`)}>
          H3
        </Button>
        <Button type="button" size="sm" variant="ghost" className="h-7 px-2" onClick={() => insert(sel => `- ${sel || "List item"}`)}>
          •
        </Button>
        <Button type="button" size="sm" variant="ghost" className="h-7 px-2" onClick={() => insert(sel => `[${sel || "text"}](https://example.com)`)}>
          Link
        </Button>
      </div>
      <Textarea
        ref={ref}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="min-h-40 rounded-none border-0 focus-visible:ring-0"
      />
    </div>
  )
}
