import React from "react";

interface MarkdownRendererProps {
  content?: string | null;
  className?: string;
}

/**
 * Parses and renders Markdown text safely without external dependencies.
 * Supports headings, bold, italic, bullet & numbered lists, inline code, and links.
 */
export function MarkdownRenderer({ content, className = "" }: MarkdownRendererProps) {
  if (!content || !content.trim()) {
    return <p className="text-on-surface-variant italic text-xs">No description provided.</p>;
  }

  const lines = content.split(/\r?\n/);
  const elements: React.ReactNode[] = [];
  let currentList: { type: "ul" | "ol"; items: string[] } | null = null;

  const flushList = () => {
    if (!currentList) return;
    const ListTag = currentList.type;
    elements.push(
      <ListTag
        key={`list-${elements.length}`}
        className={`my-2 space-y-1.5 pl-5 ${
          currentList.type === "ul" ? "list-disc marker:text-primary" : "list-decimal marker:text-primary"
        } text-xs text-on-surface leading-relaxed`}
      >
        {currentList.items.map((item, idx) => (
          <li key={idx}>{renderInlineMarkdown(item)}</li>
        ))}
      </ListTag>
    );
    currentList = null;
  };

  lines.forEach((line, index) => {
    const trimmed = line.trim();

    if (!trimmed) {
      flushList();
      return;
    }

    // Heading 1 (# ...)
    if (trimmed.startsWith("# ")) {
      flushList();
      elements.push(
        <h1 key={index} className="text-base font-bold text-on-surface mt-4 mb-2 first:mt-0 tracking-tight">
          {renderInlineMarkdown(trimmed.slice(2))}
        </h1>
      );
      return;
    }

    // Heading 2 (## ...)
    if (trimmed.startsWith("## ")) {
      flushList();
      elements.push(
        <h2 key={index} className="text-sm font-bold text-primary mt-3.5 mb-1.5 first:mt-0 tracking-tight">
          {renderInlineMarkdown(trimmed.slice(3))}
        </h2>
      );
      return;
    }

    // Heading 3 (### ...)
    if (trimmed.startsWith("### ")) {
      flushList();
      elements.push(
        <h3 key={index} className="text-xs font-bold text-on-surface-variant mt-3 mb-1 first:mt-0 uppercase tracking-wider">
          {renderInlineMarkdown(trimmed.slice(4))}
        </h3>
      );
      return;
    }

    // Bullet list (- ... or * ...)
    if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      if (!currentList || currentList.type !== "ul") {
        flushList();
        currentList = { type: "ul", items: [] };
      }
      currentList.items.push(trimmed.slice(2));
      return;
    }

    // Numbered list (1. ...)
    const numMatch = trimmed.match(/^\d+\.\s+(.+)$/);
    if (numMatch) {
      if (!currentList || currentList.type !== "ol") {
        flushList();
        currentList = { type: "ol", items: [] };
      }
      currentList.items.push(numMatch[1]);
      return;
    }

    // Standard paragraph
    flushList();
    elements.push(
      <p key={index} className="text-xs text-on-surface leading-relaxed my-1">
        {renderInlineMarkdown(trimmed)}
      </p>
    );
  });

  flushList();

  return <div className={`space-y-1 font-sans ${className}`}>{elements}</div>;
}

function renderInlineMarkdown(text: string): React.ReactNode {
  const tokens = text.split(/(\*\*.*?\*\*|\*.*?\*|`.*?`|\[.*?\]\(.*?\))/g);

  return tokens.map((token, i) => {
    if (!token) return null;

    if (token.startsWith("**") && token.endsWith("**")) {
      return <strong key={i} className="font-semibold text-on-surface">{token.slice(2, -2)}</strong>;
    }
    if (token.startsWith("*") && token.endsWith("*")) {
      return <em key={i} className="italic text-on-surface-variant">{token.slice(1, -1)}</em>;
    }
    if (token.startsWith("`") && token.endsWith("`")) {
      return (
        <code key={i} className="px-1.5 py-0.5 rounded-md bg-surface-container border border-outline-variant/30 text-[11px] font-mono text-primary">
          {token.slice(1, -1)}
        </code>
      );
    }
    const linkMatch = token.match(/^\[(.*?)\]\((.*?)\)$/);
    if (linkMatch) {
      return (
        <a
          key={i}
          href={linkMatch[2]}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline font-medium"
        >
          {linkMatch[1]}
        </a>
      );
    }

    return token;
  });
}
