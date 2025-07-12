"use client";

import {useState, useEffect} from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import {Prism as SyntaxHighlighter} from "react-syntax-highlighter";
import {nord} from "react-syntax-highlighter/dist/esm/styles/prism";

export default function EditorComponent({activeNote, onSaveNote, onCloseNote}) {
    const [inputText, setInputText] = useState("");
    const [isEdited, setIsEdited] = useState(false);

    useEffect(() => {
        if (activeNote) {
            setInputText(activeNote.content);
            setIsEdited(false);
        } else {
            setInputText("");
        }
    }, [activeNote]);

    const handleTextChange = (e) => {
        setInputText(e.target.value);
        setIsEdited(true);
    };

    const handleSave = () => {
        if (activeNote && isEdited) {
            onSaveNote(activeNote.id, inputText);
            setIsEdited(false);
        }
    };

    if (!activeNote) {
        return (
            <div className="flex items-center justify-center h-full bg-[var(--surface)]">
                <div className="text-center p-8 max-w-md">
                    <h2 className="text-2xl font-bold text-[var(--on-surface)] mb-4">
                        No Note Selected
                    </h2>
                    <p className="text-[var(--on-surface-variant)]">
                        Select a note from the sidebar or create a new one to start editing.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-8 px-4 bg-[var(--surface)]">
            <div className="max-w-6xl mx-auto">
                <header
                    className="flex justify-between items-center mb-8 bg-[var(--secondary)] text-[var(--on-secondary)] rounded-2xl py-2 px-6 w-full">
                    <h1 className="text-2xl font-bold font-serif">
                        {activeNote.title || "Untitled Note"}
                    </h1>
                    <div className="flex gap-2">
                        <button
                            onClick={onCloseNote}
                            className="px-3 py-1 border border-[var(--outline-variant)] rounded hover:bg-[var(--surface-container-high)] text-[var(--on-surface)]"
                        >
                            Close
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={!isEdited}
                            className={`px-3 py-1 rounded ${isEdited ? 'bg-[var(--primary)] text-[var(--on-primary)] hover:bg-[var(--primary-container)]' : 'bg-[var(--surface-container-high)] text-[var(--on-surface-variant)] cursor-not-allowed'}`}
                        >
                            Save
                        </button>
                    </div>
                </header>

                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Editor */}
                    <div className="flex-1">
                        <div
                            className="bg-[var(--surface-variant)] rounded-lg shadow-md overflow-hidden border border-[var(--primary)]">
                            <div className="bg-[var(--secondary)] px-4 py-2 border-b border-[var(--primary)]">
                                <h2 className="font-medium text-[var(--on-secondary)]">Editor</h2>
                            </div>
                            <textarea
                                value={inputText}
                                onChange={handleTextChange}
                                className="w-full h-96 lg:h-[800px] p-4 font-serif focus:outline-none resize-none bg-[var(--surface-variant)] text-[var(--on-surface-variant)]"
                                placeholder="Write your markdown here..."
                                spellCheck="false"
                            />
                        </div>
                    </div>

                    {/* Preview */}
                    <div className="flex-1 select-text">
                        <div
                            className="bg-[var(--surface-variant)] rounded-lg shadow-md overflow-hidden border border-[var(--primary)] h-full">
                            <div className="bg-[var(--secondary)] px-4 py-2 border-b border-[var(--primary)]">
                                <h2 className="font-medium text-[var(--on-secondary)]">Preview</h2>
                            </div>
                            <div
                                className="p-4 overflow-y-auto h-96 lg:h-[800px] prose max-w-none bg-[var(--primary-fixed)]">
                                <Markdown
                                    remarkPlugins={[remarkGfm]}
                                    rehypePlugins={[rehypeRaw]}
                                    components={{
                                        code({node, inline, className, children, ...props}) {
                                            const match = /language-(\w+)/.exec(className || "");
                                            return !inline && match ? (
                                                <SyntaxHighlighter
                                                    style={nord}
                                                    language={match[1]}
                                                    PreTag="div"
                                                    showLineNumbers
                                                    wrapLines
                                                    {...props}
                                                    className="rounded-md text-sm"
                                                >
                                                    {String(children).replace(/\n$/, "")}
                                                </SyntaxHighlighter>
                                            ) : (
                                                <code
                                                    className={`${className} px-1.5 py-0.5 rounded text-sm`}
                                                    {...props}
                                                >
                                                    {children}
                                                </code>
                                            );
                                        },
                                    }}
                                >
                                    {inputText}
                                </Markdown>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}