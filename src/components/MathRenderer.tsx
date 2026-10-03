'use client';

import React, { useMemo } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

interface MathRendererProps {
  content: string;
  className?: string;
}

/**
 * MathRenderer parses Markdown and LaTeX formulas:
 * - $$formula$$ for block equations
 * - $formula$ for inline equations
 */
export const MathRenderer: React.FC<MathRendererProps> = ({ content, className = '' }) => {
  const renderedHtml = useMemo(() => {
    if (!content) return '';

    // First replace block math $$...$$
    let formatted = content.replace(/\$\$([\s\S]*?)\$\$/g, (_, math) => {
      try {
        return `<div class="my-3 overflow-x-auto py-1 text-center font-serif">${katex.renderToString(
          math.trim(),
          { displayMode: true, throwOnError: false }
        )}</div>`;
      } catch (e) {
        return `<pre class="text-rose-400 font-mono text-xs">${math}</pre>`;
      }
    });

    // Next replace inline math $...$
    formatted = formatted.replace(/\$([^\$\n]+?)\$/g, (_, math) => {
      try {
        return katex.renderToString(math.trim(), { displayMode: false, throwOnError: false });
      } catch (e) {
        return `<code class="font-mono text-xs">${math}</code>`;
      }
    });

    // Replace newlines with <br /> when appropriate
    formatted = formatted.replace(/\n\n/g, '<div class="h-3"></div>').replace(/\n/g, '<br />');

    return formatted;
  }, [content]);

  return (
    <div
      className={`leading-relaxed ${className}`}
      dangerouslySetInnerHTML={{ __html: renderedHtml }}
    />
  );
};
