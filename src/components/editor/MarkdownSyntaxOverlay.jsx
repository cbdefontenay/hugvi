import React, {useCallback} from 'react';
import Editor from 'react-simple-code-editor';
import Prism from 'prismjs';
import 'prismjs/components/prism-markdown';
import 'prismjs/themes/prism.css'; // Minimal default styling

export default function MarkdownSyntaxOverlay({
    value,
    onChange,
    placeholder
}) {
    const highlightWithPrism = useCallback((code) => {
        try {
            if (!code) return "";
            if (!Prism.languages.markdown) {
                return code;
            }
            return Prism.highlight(code, Prism.languages.markdown, 'markdown');
        } catch (e) {
            console.error("Prism highlighting error:", e);
            return code;
        }
    }, []);

    return (
        <div className="flex-1 w-full h-full overflow-y-auto thin-scrollbar">
            <Editor
                value={value}
                onValueChange={onChange}
                highlight={highlightWithPrism}
                padding={20}
                style={{
                    fontFamily: '"JetBrains Mono", "Fira Code", "Cascadia Code", "Source Code Pro", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                    fontSize: '14px',
                    lineHeight: '1.5',
                    minHeight: '100%',
                    backgroundColor: 'transparent',
                    color: 'var(--on-surface)',
                }}
                textareaClassName="focus:outline-none caret-(--primary) outline-none"
                placeholder={placeholder}
            />
        </div>
    );
}
