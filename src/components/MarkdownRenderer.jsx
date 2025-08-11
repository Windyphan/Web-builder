import React from 'react';

const MarkdownRenderer = ({ content, className = "" }) => {
    // Enhanced markdown rendering function
    const renderContent = (content) => {
        if (!content) return [];

        return content
            .split('\n\n')
            .map((paragraph, index) => {
                // Handle headers
                if (paragraph.startsWith('# ')) {
                    return (
                        <h1 key={index} className="text-3xl font-bold mt-8 mb-4 text-gray-900 dark:text-gray-100">
                            {paragraph.replace('# ', '')}
                        </h1>
                    );
                }
                if (paragraph.startsWith('## ')) {
                    return (
                        <h2 key={index} className="text-2xl font-semibold mt-6 mb-3 text-gray-900 dark:text-gray-100">
                            {paragraph.replace('## ', '')}
                        </h2>
                    );
                }
                if (paragraph.startsWith('### ')) {
                    return (
                        <h3 key={index} className="text-xl font-semibold mt-4 mb-2 text-gray-900 dark:text-gray-100">
                            {paragraph.replace('### ', '')}
                        </h3>
                    );
                }
                if (paragraph.startsWith('#### ')) {
                    return (
                        <h4 key={index} className="text-lg font-semibold mt-3 mb-2 text-gray-900 dark:text-gray-100">
                            {paragraph.replace('#### ', '')}
                        </h4>
                    );
                }

                // Handle blockquotes
                if (paragraph.startsWith('> ')) {
                    const quote = paragraph.replace(/^> /gm, '');
                    return (
                        <blockquote key={index} className="border-l-4 border-primary-500 pl-4 py-2 my-4 bg-gray-50 dark:bg-gray-800 italic text-gray-700 dark:text-gray-300">
                            {quote}
                        </blockquote>
                    );
                }

                // Handle code blocks
                if (paragraph.startsWith('```')) {
                    const lines = paragraph.split('\n');
                    const language = lines[0].replace('```', '');
                    const code = lines.slice(1, -1).join('\n');
                    return (
                        <div key={index} className="my-4">
                            {language && (
                                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1 font-mono">
                                    {language}
                                </div>
                            )}
                            <pre className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 overflow-x-auto border">
                                <code className="text-sm text-gray-800 dark:text-gray-200 font-mono">
                                    {code}
                                </code>
                            </pre>
                        </div>
                    );
                }

                // Handle tables
                if (paragraph.includes('|')) {
                    const lines = paragraph.split('\n').filter(line => line.trim());
                    if (lines.length >= 2 && lines[1].includes('---')) {
                        const headers = lines[0].split('|').map(h => h.trim()).filter(h => h);
                        const rows = lines.slice(2).map(line =>
                            line.split('|').map(cell => cell.trim()).filter(cell => cell)
                        );

                        return (
                            <div key={index} className="my-4 overflow-x-auto">
                                <table className="min-w-full border border-gray-200 dark:border-gray-700 rounded-lg">
                                    <thead className="bg-gray-50 dark:bg-gray-800">
                                        <tr>
                                            {headers.map((header, i) => (
                                                <th key={i} className="px-4 py-2 text-left text-sm font-semibold text-gray-900 dark:text-gray-100 border-b">
                                                    {header}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {rows.map((row, i) => (
                                            <tr key={i} className="border-b border-gray-200 dark:border-gray-700">
                                                {row.map((cell, j) => (
                                                    <td key={j} className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">
                                                        {cell}
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        );
                    }
                }

                // Handle lists
                if (paragraph.includes('- ') || paragraph.includes('1. ')) {
                    const items = paragraph.split('\n').filter(line => line.trim());
                    const isOrdered = items[0].match(/^\d+\./);
                    const ListTag = isOrdered ? 'ol' : 'ul';

                    return (
                        <ListTag key={index} className={`my-4 space-y-2 ${isOrdered ? 'list-decimal' : 'list-disc'} list-inside text-gray-700 dark:text-gray-300`}>
                            {items.map((item, i) => (
                                <li key={i} className="leading-relaxed">
                                    {renderInlineMarkdown(item.replace(/^[-\d+\.]\s/, ''))}
                                </li>
                            ))}
                        </ListTag>
                    );
                }

                // Handle horizontal rules
                if (paragraph.trim() === '---' || paragraph.trim() === '***') {
                    return <hr key={index} className="my-8 border-gray-300 dark:border-gray-600" />;
                }

                // Regular paragraphs with inline formatting
                return (
                    <p
                        key={index}
                        className="mb-4 leading-relaxed text-gray-700 dark:text-gray-300"
                    >
                        {renderInlineMarkdown(paragraph)}
                    </p>
                );
            });
    };

    // Handle inline markdown formatting
    const renderInlineMarkdown = (text) => {
        // Handle images
        text = text.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="max-w-full h-auto rounded-lg my-4" />');

        // Handle links
        text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-primary-600 dark:text-primary-400 hover:underline">$1</a>');

        // Handle bold text
        text = text.replace(/\*\*([^*]+)\*\*/g, '<strong class="font-semibold">$1</strong>');
        text = text.replace(/__([^_]+)__/g, '<strong class="font-semibold">$1</strong>');

        // Handle italic text
        text = text.replace(/\*([^*]+)\*/g, '<em class="italic">$1</em>');
        text = text.replace(/_([^_]+)_/g, '<em class="italic">$1</em>');

        // Handle inline code
        text = text.replace(/`([^`]+)`/g, '<code class="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-sm font-mono">$1</code>');

        // Handle strikethrough
        text = text.replace(/~~([^~]+)~~/g, '<del class="line-through">$1</del>');

        return <span dangerouslySetInnerHTML={{ __html: text }} />;
    };

    return (
        <div className={`prose dark:prose-invert max-w-none ${className}`}>
            {renderContent(content)}
        </div>
    );
};

export default MarkdownRenderer;
