import {useCallback, useEffect, useState} from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import {useTranslation} from "react-i18next";
import ExportPopup from "./ExportPopup.jsx";
import {FaFileExport, FaEdit, FaEye, FaColumns, FaSave, FaTimes, FaExpand, FaCompress} from "react-icons/fa";
import SyntaxHighlighterComponent from "./SyntaxHighlighterComponent.jsx";
import ThemeSelector, {THEMES} from "./ThemeSelector.jsx";

// View modes
const VIEW_MODES = {
    EDIT: 'edit',
    PREVIEW: 'preview',
    SPLIT: 'split'
};

export default function EditorComponent({activeNote, onSaveNote, onCloseNote}) {
    const {t} = useTranslation();
    const [inputText, setInputText] = useState("");
    const [isEdited, setIsEdited] = useState(false);
    const [wordCount, setWordCount] = useState(0);
    const [showExportPopup, setShowExportPopup] = useState(false);
    const [selectedTheme, setSelectedTheme] = useState(() => {
        const savedTheme = localStorage.getItem("syntaxTheme");
        return THEMES.some(t => t.name === savedTheme) ? savedTheme : "nord";
    });
    const [viewMode, setViewMode] = useState(VIEW_MODES.EDIT);
    const [isFullscreen, setIsFullscreen] = useState(false);

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

    const toggleFullscreen = () => {
        if (!isFullscreen) {
            // Enter fullscreen
            const elem = document.documentElement;
            if (elem.requestFullscreen) {
                elem.requestFullscreen();
            } else if (elem.webkitRequestFullscreen) {
                elem.webkitRequestFullscreen();
            } else if (elem.msRequestFullscreen) {
                elem.msRequestFullscreen();
            }
            setIsFullscreen(true);
        } else {
            // Exit fullscreen
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
            setIsFullscreen(false);
        }
    };

    // Handle fullscreen change events
    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);
        document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
        document.addEventListener('msfullscreenchange', handleFullscreenChange);

        return () => {
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
            document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
            document.removeEventListener('msfullscreenchange', handleFullscreenChange);
        };
    }, []);

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

    const handleTextChange = (e) => {
        const text = e.target.value;
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
        <div className={`h-full flex flex-col bg-(--surface-container-low) ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
            {/* Header Bar */}
            <header
                className="flex items-center justify-between p-4 border-b border-(--outline-variant) bg-(--surface)">
                <div className="flex items-center space-x-2">
                    <button
                        onClick={onCloseNote}
                        className="cursor-pointer p-2 rounded-lg hover:bg-(--surface-container-high) text-(--on-surface)"
                        aria-label={t("editor.closeNote")}
                    >
                        <FaTimes size={16} />
                    </button>
                    <h1 className="text-lg font-semibold text-(--on-surface) truncate max-w-xs md:max-w-md">
                        {activeNote.title || t("editor.defaultNoteTitle")}
                    </h1>
                </div>

                <div className="flex items-center space-x-2">
                    <span className="text-sm text-(--on-surface-variant)">
                        {wordCount} {t("editor.words")}
                    </span>

                    <button
                        onClick={handleExport}
                        disabled={!inputText.trim()}
                        className={`cursor-pointer flex items-center space-x-2 px-3 py-1 rounded-lg text-sm ${inputText.trim() ? 'bg-(--surface-variant) text-(--on-surface-variant) hover:bg-(--surface) hover:text-(--on-surface)' : 'bg-(--surface-container-high) text-(--on-surface-variant) cursor-not-allowed'}`}
                    >
                        <FaFileExport size={15}/>
                        <span>{t("editor.export")}</span>
                    </button>

                    {/* Fullscreen Toggle */}
                    <button
                        onClick={toggleFullscreen}
                        className="cursor-pointer p-2 rounded-lg hover:bg-(--surface-container-high) text-(--on-surface)"
                        aria-label={isFullscreen ? t("editor.exitFullscreen") : t("editor.enterFullscreen")}
                        title={isFullscreen ? t("editor.exitFullscreen") : t("editor.enterFullscreen")}
                    >
                        {isFullscreen ? <FaCompress size={14} /> : <FaExpand size={14} />}
                    </button>

                    {/* Theme Selector */}
                    <ThemeSelector
                        selectedTheme={selectedTheme}
                        onThemeChange={setSelectedTheme}
                    />

                    {/* View Mode Selector */}
                    <div className="flex bg-(--surface-container-high) rounded-lg p-1">
                        <button
                            onClick={() => setViewModeHandler(VIEW_MODES.EDIT)}
                            className={`cursor-pointer px-3 py-1 rounded-md text-sm flex items-center space-x-1 ${viewMode === VIEW_MODES.EDIT ? 'bg-(--primary-container) text-(--on-primary-container)' : 'text-(--on-surface-variant)'}`}
                            title={t("editor.edit")}
                        >
                            <FaEdit size={12} />
                            <span>{t("editor.edit")}</span>
                        </button>
                        <button
                            onClick={() => setViewModeHandler(VIEW_MODES.SPLIT)}
                            className={`cursor-pointer px-3 py-1 rounded-md text-sm flex items-center space-x-1 ${viewMode === VIEW_MODES.SPLIT ? 'bg-(--primary-container) text-(--on-primary-container)' : 'text-(--on-surface-variant)'}`}
                            title={t("editor.split")}
                        >
                            <FaColumns size={12} />
                            <span>{t("editor.split")}</span>
                        </button>
                        <button
                            onClick={() => setViewModeHandler(VIEW_MODES.PREVIEW)}
                            className={`cursor-pointer px-3 py-1 rounded-md text-sm flex items-center space-x-1 ${viewMode === VIEW_MODES.PREVIEW ? 'bg-(--primary-container) text-(--on-primary-container)' : 'text-(--on-surface-variant)'}`}
                            title={t("editor.preview")}
                        >
                            <FaEye size={12} />
                            <span>{t("editor.preview")}</span>
                        </button>
                    </div>

                    <button
                        onClick={handleSave}
                        disabled={!isEdited}
                        className={`px-4 py-2 rounded-lg text-sm flex items-center space-x-1 ${isEdited ? 'bg-(--primary) text-(--on-primary) hover:bg-(--primary-container) hover:text-(--on-primary-container) cursor-pointer' : 'bg-(--surface-container-high) text-(--on-surface-variant) cursor-not-allowed'}`}
                    >
                        <FaSave size={14} />
                        <span>{t("editor.save")}</span>
                    </button>
                </div>
            </header>

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
                                    <FaColumns size={14} />
                                </button>
                            )}
                        </div>
                        <textarea
                            value={inputText}
                            onChange={handleTextChange}
                            className="flex-1 w-full p-6 font-mono text-sm focus:outline-none resize-none bg-(--surface-container-high) text-(--on-surface) whitespace-pre-wrap"
                            placeholder={t("editor.markdownPlaceholder")}
                            spellCheck="false"
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
                                    <FaColumns size={14} />
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
                                        const taskListItem = node?.children?.[0]?.type === 'input';

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
            <div
                className="px-4 py-2 text-xs flex justify-between items-center bg-(--surface-container-high) border-t border-(--outline-variant) text-(--on-surface-variant)">
                <div>
                    {activeNote.title && (
                        <span className="truncate max-w-xs inline-block align-middle">
                            {activeNote.title}
                        </span>
                    )}
                </div>
                <div className="flex items-center space-x-4">
                    <span>{new Date().toLocaleDateString()}</span>
                    <span>{wordCount} {t("editor.words")}</span>
                    <span>{inputText.length} {t("editor.characters")}</span>
                    <span className="capitalize">{viewMode} {t("editor.mode")}</span>
                    {isFullscreen && (
                        <span className="text-(--primary) font-medium">{t("editor.fullscreen")}</span>
                    )}
                </div>
            </div>
            <ExportPopup
                isOpen={showExportPopup}
                onClose={() => setShowExportPopup(false)}
                content={inputText}
            />
        </div>
    );
}