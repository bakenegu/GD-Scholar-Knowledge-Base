"use client"

import React from "react"
import { cn } from "@/lib/utils"

function escapeHtml(str: string) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
}

function simpleMarkdownToHtml(md: string) {
  if (!md) return ""
  // Escape first
  let html = escapeHtml(md)

  // Headings
  html = html.replace(/^###\s?(.+)$/gm, '<h3 class="text-base font-semibold mt-3 mb-1">$1</h3>')
  html = html.replace(/^##\s?(.+)$/gm, '<h2 class="text-lg font-semibold mt-4 mb-2">$1</h2>')
  html = html.replace(/^#\s?(.+)$/gm, '<h1 class="text-xl font-bold mt-5 mb-2">$1</h1>')

  // Bold and italic
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>')

  // Links [text](url)
  html = html.replace(/\[(.+?)\]\((https?:[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-primary underline">$1</a>')

  // Unordered lists: lines starting with - or *
  html = html.replace(/(^|\n)(?:[-*])\s+(.+)(?=\n|$)/g, '$1<li>$2</li>')
  html = html.replace(/(?:<li>.*<\/li>\n?)+/g, (m) => `<ul class="list-disc pl-5 my-2 space-y-1">${m}</ul>`) // wrap consecutive lis

  // Paragraphs: split by two newlines
  html = html
    .split(/\n{2,}/)
    .map((block) => {
      // If block already contains heading/list, return as is
      if (/(<h\d|<ul|<li)/.test(block)) return block
      const trimmed = block.trim()
      if (!trimmed) return ""
      return `<p class=\"leading-relaxed\">${trimmed.replace(/\n/g, '<br/>')}</p>`
    })
    .join("\n")

  return html
}

export function MarkdownRenderer({ content, className }: { content: string, className?: string }) {
  const html = simpleMarkdownToHtml(content)
  return (
    <div className={cn("prose prose-sm max-w-none [&_h1]:text-foreground [&_h2]:text-foreground [&_h3]:text-foreground", className)} dangerouslySetInnerHTML={{ __html: html }} />
  )
}
