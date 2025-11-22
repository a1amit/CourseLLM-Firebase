"use client";

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownRendererProps {
  content: string;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        h1: ({node, ...props}) => <h1 className="text-4xl font-bold font-headline mt-8 mb-4" {...props} />,
        h2: ({node, ...props}) => <h2 className="text-3xl font-semibold font-headline mt-6 mb-3 border-b pb-2" {...props} />,
        h3: ({node, ...props}) => <h3 className="text-2xl font-semibold font-headline mt-4 mb-2" {...props} />,
        p: ({node, ...props}) => <p className="leading-7 my-4" {...props} />,
        ul: ({node, ...props}) => <ul className="list-disc pl-6 my-4" {...props} />,
        ol: ({node, ...props}) => <ol className="list-decimal pl-6 my-4" {...props} />,
        li: ({node, ...props}) => <li className="mb-2" {...props} />,
        blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-primary pl-4 italic my-4" {...props} />,
        code: ({node, className, children, ...props}) => {
          const match = /language-(\w+)/.exec(className || '');
          const inline = !match; // A simple heuristic: if there's no language, it's likely inline.
          return !inline ? (
            <pre className="bg-muted text-muted-foreground p-4 rounded-md my-4 overflow-x-auto">
              <code className={className} {...props}>
                {children}
              </code>
            </pre>
          ) : (
            <code className="bg-muted text-primary font-mono px-1 py-0.5 rounded-sm" {...props}>
              {children}
            </code>
          )
        },
        a: ({node, ...props}) => <a className="text-primary hover:underline" {...props} />,
      }}
    >
      {content}
    </ReactMarkdown>
  );
}