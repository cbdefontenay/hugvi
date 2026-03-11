import {useCallback, useEffect, useState} from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import {useTranslation} from "react-i18next";
import ExportPopup from "./ExportPopup.jsx";
import SyntaxHighlighterComponent from "./SyntaxHighlighterComponent.jsx";
import ThemeSelector, {THEMES} from "./ThemeSelector.jsx";
import EditorHeader from "./editor/EditorHeader.jsx";
import EditorStatusBar from "./editor/EditorStatusBar.jsx";
import MarkdownSyntaxOverlay from "./editor/MarkdownSyntaxOverlay.jsx";
import {FileEdit, Columns, Eye} from "lucide-react";

// View modes
const VIEW_MODES = {
    EDIT: 'edit',
    PREVIEW: 'preview',
    SPLIT: 'split'
};

export default function EditorComponent({activeNote, onSaveNote, onCloseNote, isFullscreen, toggleFullscreen}) {
    const {t} = useTranslation();
    const [inputText, setInputText] = useState("");
    const [isEdited, setIsEdited] = useState(false);
    const [wordCount, setWordCount] = useState(0);
    const [showExportPopup, setShowExportPopup] = useState(false);
    const [selectedTheme, setSelectedTheme] = useState(() => {
        const savedTheme = localStorage.getItem("syntaxTheme");
        return THEMES.some(t => t.name === savedTheme) ? savedTheme : "nord";
    });
    const [viewMode, setViewMode] = useState(VIEW_MODES.SPLIT);

    const handleExport = () => {
        console.log("Export clicked, content length:", inputText.length);
        if (inputText.trim()) {
            setShowExportPopup(true);
        } else {
            console.log("No content to export");
        }
    };

    const handleKeyDown = useCallback((e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 's') {
            e.preventDefault();
            if (activeNote && isEdited) {
                onSaveNote(activeNote.id, inputText);
                setIsEdited(false);
            }
        }
        // Add F11 or Escape for fullscreen (optional)
        if (e.key === 'F11') {
            e.preventDefault();
            toggleFullscreen();
        }
    }, [activeNote, isEdited, inputText, onSaveNote]);

    useEffect(() => {
        console.log("EditorComponent mounted, activeNote:", activeNote);
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    useEffect(() => {
        const savedTheme = localStorage.getItem("syntaxTheme");
        if (savedTheme && THEMES.some(t => t.name === savedTheme)) {
            setSelectedTheme(savedTheme);
        }
    }, []);

    useEffect(() => {
        if (selectedTheme) localStorage.setItem("syntaxTheme", selectedTheme);
    }, [selectedTheme]);

    useEffect(() => {
        console.log("activeNote changed:", activeNote);
        if (activeNote) {
            setInputText(activeNote.content);
            setIsEdited(false);
            updateWordCount(activeNote.content);
        } else {
            setInputText("");
            setWordCount(0);
        }
    }, [activeNote]);

    const handleTextChange = (value) => {
        if (value === undefined || value === null) return;
        const text = typeof value === 'string' ? value : (value.target ? value.target.value : "");
        setInputText(text);
        setIsEdited(true);
        updateWordCount(text);
    };

    const updateWordCount = (text) => {
        const words = text.trim() ? text.trim().split(/\s+/).length : 0;
        setWordCount(words);
    };

    const handleSave = () => {
        if (activeNote && isEdited) {
            onSaveNote(activeNote.id, inputText);
            setIsEdited(false);
        }
    };

    const setViewModeHandler = (mode) => {
        setViewMode(mode);
    };

    // Add debug logging
    console.log("EditorComponent render - activeNote:", activeNote, "inputText length:", inputText.length);

    if (!activeNote) {
        console.log("No active note, showing placeholder");
        return (
            <div className="flex items-center justify-center h-full bg-(--surface-container-low)">
                <div className="text-center p-8 max-w-md">
                    <div className="flex justify-center text-(--primary) mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none"
                             stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                            <path d="M14 2v6h6"/>
                            <path d="M16 13H8"/>
                            <path d="M16 17H8"/>
                            <path d="M10 9H8"/>
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-(--on-surface) mb-2">
                        {t("editor.noNoteSelected")}
                    </h2>
                    <p className="text-(--on-surface-variant) mb-6">
                        {t("editor.selectNotePrompt")}
                    </p>
                </div>
            </div>
        );
    }

    console.log("Rendering editor with active note:", activeNote.title);

    return (
        <div className={`h-full flex flex-col bg-(--surface-container-low) ${isFullscreen ? 'fixed inset-0 z-[9999]' : ''}`}>
            {/* Header Bar */}
            <EditorHeader 
                activeNote={activeNote}
                wordCount={wordCount}
                inputText={inputText}
                isFullscreen={isFullscreen}
                toggleFullscreen={toggleFullscreen}
                viewMode={viewMode}
                setViewModeHandler={setViewModeHandler}
                isEdited={isEdited}
                handleSave={handleSave}
                handleExport={handleExport}
                onCloseNote={onCloseNote}
                selectedTheme={selectedTheme}
                setSelectedTheme={setSelectedTheme}
            />

            {/* Editor/Preview Area */}
            <div className="select-text flex-1 overflow-hidden flex">
                {/* Editor Panel - Show in edit mode or split mode */}
                {(viewMode === VIEW_MODES.EDIT || viewMode === VIEW_MODES.SPLIT) && (
                    <div className={`${viewMode === VIEW_MODES.SPLIT ? 'flex-1' : 'flex-1'} h-full flex flex-col border-r border-(--outline-variant)`}>
                        <div
                            className="p-2 bg-(--surface-container) border-b border-(--outline-variant) flex items-center justify-between">
                            <span className="select-none text-xs font-medium text-(--on-surface-variant)">
                                {t("editor.markdown")}
                            </span>
                            {viewMode === VIEW_MODES.EDIT && (
                                <button
                                    onClick={() => setViewModeHandler(VIEW_MODES.SPLIT)}
                                    className="p-1 rounded hover:bg-(--surface-container) text-(--on-surface-variant)"
                                    aria-label={t("editor.switchToSplit")}
                                    title={t("editor.switchToSplit")}
                                >
                                    <Columns size={14} />
                                </button>
                            )}
                        </div>
                        <MarkdownSyntaxOverlay
                            value={inputText}
                            onChange={handleTextChange}
                            placeholder={t("editor.markdownPlaceholder")}
                        />
                    </div>
                )}

                {/* Preview Panel - Show in preview mode or split mode */}
                {(viewMode === VIEW_MODES.PREVIEW || viewMode === VIEW_MODES.SPLIT) && (
                    <div className={`${viewMode === VIEW_MODES.SPLIT ? 'flex-1' : 'flex-1'} h-full flex flex-col overflow-hidden`}>
                        <div
                            className="p-2 bg-(--surface-container) border-b border-(--outline-variant) flex items-center justify-between">
                            <span className="select-none text-xs font-medium text-(--on-surface-variant)">
                                {t("editor.preview")}
                            </span>
                            {viewMode === VIEW_MODES.PREVIEW && (
                                <button
                                    onClick={() => setViewModeHandler(VIEW_MODES.SPLIT)}
                                    className="p-1 rounded hover:bg-(--surface-container) text-(--on-surface-variant)"
                                    aria-label={t("editor.switchToSplit")}
                                    title={t("editor.switchToSplit")}
                                >
                                    <Columns size={14} />
                                </button>
                            )}
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 bg-(--surface-container-high)">
                            <Markdown
                                remarkPlugins={[remarkGfm]}
                                rehypePlugins={[rehypeRaw]}
                                components={{
                                    code({node, inline, className, children, ...props}) {
                                        const match = /language-(\w+)/.exec(className || "");
                                        const codeText = String(children).replace(/\n$/, '');

                                        if (!inline && match) {
                                            return (
                                                <SyntaxHighlighterComponent
                                                    language={match[1]}
                                                    theme={selectedTheme}
                                                    {...props}
                                                >
                                                    {codeText}
                                                </SyntaxHighlighterComponent>
                                            );
                                        }

                                        return (
                                            <code
                                                className="bg-(--surface-container-high) text-(--on-surface-container-high) px-1.5 py-0.5 rounded text-sm font-mono border border-(--outline)/30 break-words max-w-full"
                                                {...props}
                                            >
                                                {children}
                                            </code>
                                        );
                                    },

                                    // ... (keep all your other Markdown components as before)
                                    h1: ({node, ...props}) => <h1 className="text-2xl font-bold text-(--on-surface) pb-2 mb-3 mt-4" {...props} />,
                                    h2: ({node, ...props}) => <h2 className="text-xl font-bold text-(--on-surface) pb-1 mb-2 mt-3" {...props} />,
                                    h3: ({node, ...props}) => <h3 className="text-lg font-bold text-(--on-surface) mb-1 mt-2" {...props} />,
                                    h4: ({node, ...props}) => <h4 className="text-base font-bold text-(--on-surface) mb-1 mt-2" {...props} />,
                                    p: ({node, ...props}) => <p className="text-(--on-surface) leading-relaxed mb-3 text-sm" {...props} />,
                                    a: ({node, ...props}) => <a className="text-(--primary) hover:text-(--secondary) transition-colors duration-200 font-medium underline text-sm" {...props} />,
                                    blockquote: ({node, ...props}) => <blockquote className="border-l-3 border-(--primary) pl-3 py-1 my-3 bg-(--surface-container) text-(--on-surface-container) not-italic rounded-r text-sm" {...props} />,
                                    ul: ({node, ...props}) => <ul className="text-(--on-surface) leading-6 mb-3 list-disc list-inside text-sm" {...props} />,
                                    ol: ({node, ...props}) => <ol className="text-(--on-surface) leading-6 mb-3 list-decimal list-inside text-sm" {...props} />,
                                    li: ({node, children, ...props}) => {
                                        const taskListItem = node?.children?.[0]?.type === 'element' && node?.children?.[0]?.tagName === 'input';

                                        if (taskListItem) {
                                            return (
                                                <li className="flex items-start gap-2 list-none ml-0 my-1" {...props}>
                                                    {children}
                                                </li>
                                            );
                                        }

                                        return <li className="text-(--on-surface) marker:text-(--primary) my-1" {...props}>{children}</li>;
                                    },
                                    input: ({node, checked, ...props}) => {
                                        if (props.type === "checkbox") {
                                            return (
                                                <input
                                                    type="checkbox"
                                                    checked={checked}
                                                    readOnly
                                                    className={`w-3.5 h-3.5 rounded border-2 mt-0.5 flex-shrink-0 transition-all duration-200
                                                        ${checked
                                                        ? "bg-(--primary) border-(--primary) text-(--on-primary)"
                                                        : "bg-(--surface) border-(--outline) hover:border-(--primary)"}
                                                    `}
                                                    {...props}
                                                />
                                            );
                                        }
                                        return <input {...props} />;
                                    },
                                    strong: ({node, ...props}) => <strong className="text-(--primary) font-bold" {...props} />,
                                    em: ({node, ...props}) => <em className="text-(--secondary) italic" {...props} />,
                                    table: ({node, ...props}) => (
                                        <div className="overflow-x-auto my-3 border border-(--outline) rounded text-xs">
                                            <table className="w-full border-collapse" {...props} />
                                        </div>
                                    ),
                                    th: ({node, ...props}) => (
                                        <th className="bg-(--surface-container-high) text-(--on-surface-container-high) px-3 py-2 border-b border-(--outline) font-semibold text-left text-xs" {...props} />
                                    ),
                                    td: ({node, ...props}) => (
                                        <td className="px-3 py-2 border-b border-(--outline) text-(--on-surface) text-xs" {...props} />
                                    ),
                                    hr: ({node, ...props}) => (
                                        <hr className="my-4 border-t border-(--outline) opacity-30" {...props} />
                                    ),
                                    img: ({node, ...props}) => (
                                        <img className="rounded border border-(--outline) max-w-full h-auto my-3" {...props} />
                                    ),
                                }}
                            >
                                {inputText}
                            </Markdown>
                        </div>
                    </div>
                )}
            </div>

            {/* Status Bar */}
            <EditorStatusBar
                activeNote={activeNote}
                wordCount={wordCount}
                inputText={inputText}
                viewMode={viewMode}
                isFullscreen={isFullscreen}
            />
            <ExportPopup
                isOpen={showExportPopup}
                onClose={() => setShowExportPopup(false)}
                content={inputText}
            />
        </div>
    );
}