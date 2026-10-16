import React from 'react';

export default function MarkdownSyntaxOverlay({
    value,
    onChange,
    placeholder
}) {
    return (
        <div className="editor-area flex-1 w-full h-full overflow-y-auto thin-scrollbar">
            <textarea
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                spellCheck={false}
                className="w-full h-full resize-none outline-none p-5 font-mono text-[14px] leading-[1.5] bg-transparent"
                style={{
                    fontFamily: '"JetBrains Mono", "Fira Code", "Cascadia Code", "Source Code Pro", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                    minHeight: '100%',
                    color: 'var(--editor-text)',
                    caretColor: 'var(--editor-caret)',
                }}
            />
        </div>
    );
}
