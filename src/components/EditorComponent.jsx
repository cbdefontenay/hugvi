import {useCallback, useEffect, useState} from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import {Prism as SyntaxHighlighter} from "react-syntax-highlighter";
import {
    atomDark,
    darcula,
    ghcolors,
    gruvboxDark,
    materialDark,
    materialLight,
    nord,
    solarizedlight,
    tomorrow,
    vs,
    vscDarkPlus
} from "react-syntax-highlighter/dist/esm/styles/prism";
import {useTranslation} from "react-i18next";
import ExportPopup from "./ExportPopup.jsx";
import {FaFileExport} from "react-icons/fa";

// Available themes with display names
const THEMES = [
    {name: "nord", display: "Nord"},
    {name: "atomDark", display: "Atom Dark"},
    {name: "darcula", display: "Darcula"},
    {name: "ghcolors", display: "GitHub"},
    {name: "gruvboxDark", display: "Gruvbox Dark"},
    {name: "materialDark", display: "Material Dark"},
    {name: "materialLight", display: "Material Light"},
    {name: "solarizedlight", display: "Solarized Light"},
    {name: "tomorrow", display: "Tomorrow"},
    {name: "vs", display: "VS"},
    {name: "vscDarkPlus", display: "VS Code Dark+"}
];

export default function EditorComponent({activeNote, onSaveNote, onCloseNote}) {
    const {t} = useTranslation();
    const [inputText, setInputText] = useState("");
    const [isEdited, setIsEdited] = useState(false);
    const [isPreview, setIsPreview] = useState(false);
    const [wordCount, setWordCount] = useState(0);
    const [showThemeMenu, setShowThemeMenu] = useState(false);
    const [showExportPopup, setShowExportPopup] = useState(false);
    const [selectedTheme, setSelectedTheme] = useState(() => {
        const savedTheme = localStorage.getItem("syntaxTheme");
        return THEMES.some(t => t.name === savedTheme) ? savedTheme : "nord";
    });

    // Add the missing handleExport function
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
    }, [activeNote, isEdited, inputText, onSaveNote]);

    useEffect(() => {
        console.log("EditorComponent mounted, activeNote:", activeNote);
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    const getThemeStyle = (themeName) => {
        switch (themeName) {
            case "atomDark":
                return atomDark;
            case "darcula":
                return darcula;
            case "ghcolors":
                return ghcolors;
            case "gruvboxDark":
                return gruvboxDark;
            case "materialDark":
                return materialDark;
            case "materialLight":
                return materialLight;
            case "solarizedlight":
                return solarizedlight;
            case "tomorrow":
                return tomorrow;
            case "vs":
                return vs;
            case "vscDarkPlus":
                return vscDarkPlus;
            default:
                return nord;
        }
    };

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

    const toggleView = () => setIsPreview(!isPreview);
    const toggleThemeMenu = () => setShowThemeMenu(!showThemeMenu);
    const selectTheme = (themeName) => {
        setSelectedTheme(themeName);
        setShowThemeMenu(false);
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
        <div className="h-full flex flex-col bg-(--surface-container-low)">
            {/* Header Bar */}
            <header
                className="flex items-center justify-between p-4 border-b border-(--outline-variant) bg-(--surface)">
                <div className="flex items-center space-x-2">
                    <button
                        onClick={onCloseNote}
                        className="cursor-pointer p-2 rounded-lg hover:bg-(--surface-container-high) text-(--on-surface)"
                        aria-label={t("editor.closeNote")}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                             stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M19 12H5M12 19l-7-7 7-7"/>
                        </svg>
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
                        className={`cursor-pointer flex items-center space-x-2 px-3 py-2 rounded-lg text-sm ${inputText.trim() ? 'bg-(--tertiary) text-(--on-tertiary) hover:bg-(--tertiary-container) hover:text-(--on-tertiary-container)' : 'bg-(--surface-container-high) text-(--on-surface-variant) cursor-not-allowed'}`}
                    >
                        <FaFileExport className="text-(--background) hover:text-(--on-background)" size={15}/>
                        <span>{t("editor.export")}</span>
                    </button>

                    {/* Theme Selector */}
                    <div className="relative">
                        <button
                            onClick={toggleThemeMenu}
                            className="cursor-pointer flex items-center space-x-1 px-3 py-1 rounded-md text-sm bg-(--surface-container-high) text-(--on-surface-variant) hover:bg-(--surface-container)"
                            aria-label={t("editor.selectTheme")}
                        >
                            <span>{t("editor.theme")}</span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                                 fill="none"
                                 stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M6 9l6 6 6-6"/>
                            </svg>
                        </button>

                        {showThemeMenu && (
                            <div
                                className="absolute right-0 mt-1 w-48 bg-(--surface) rounded-md shadow-lg z-50 border border-(--outline-variant)">
                                <div className="py-1 max-h-60 overflow-y-auto">
                                    {THEMES.map((theme) => (
                                        <button
                                            key={theme.name}
                                            onClick={() => selectTheme(theme.name)}
                                            className={`cursor-pointer block w-full text-left px-4 py-2 text-sm ${selectedTheme === theme.name ? 'bg-(--primary-container) text-(--on-primary-container)' : 'text-(--on-surface) hover:bg-(--surface-container-high)'}`}
                                        >
                                            {theme.display}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex bg-(--surface-container-high) rounded-lg p-1">
                        <button
                            onClick={() => setIsPreview(false)}
                            className={`cursor-pointer px-3 py-1 rounded-md text-sm ${!isPreview ? 'bg-(--primary-container) text-(--on-primary-container)' : 'text-(--on-surface-variant)'}`}
                        >
                            {t("editor.edit")}
                        </button>
                        <button
                            onClick={() => setIsPreview(true)}
                            className={`cursor-pointer px-3 py-1 rounded-md text-sm ${isPreview ? 'bg-(--primary-container) text-(--on-primary-container)' : 'text-(--on-surface-variant)'}`}
                        >
                            {t("editor.preview")}
                        </button>
                    </div>
                    <button
                        onClick={handleSave}
                        disabled={!isEdited}
                        className={`px-4 py-2 rounded-lg text-sm ${isEdited ? 'bg-(--primary) text-(--on-primary) hover:bg-(--primary-container) hover:text-(--on-primary-container) cursor-pointer' : 'bg-(--surface-container-high) text-(--on-surface-variant) cursor-not-allowed'}`}
                    >
                        {t("editor.save")}
                    </button>
                </div>
            </header>

            {/* Editor/Preview Area */}
            <div className="select-text flex-1 overflow-hidden flex flex-col md:flex-row">
                {/* Editor Panel */}
                {!isPreview && (
                    <div className="flex-1 h-full flex flex-col border-r border-(--outline-variant)">
                        <div
                            className="p-2 bg-(--surface-container) border-b border-(--outline-variant) flex items-center justify-between">
                            <span className="select-none text-xs font-medium text-(--on-surface-variant)">
                                {t("editor.markdown")}
                            </span>
                            <button
                                onClick={toggleView}
                                className="p-1 rounded hover:bg-(--surface-container) text-(--on-surface-variant)"
                                aria-label={t("editor.switchToPreview")}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                                     fill="none"
                                     stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
                                    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
                                </svg>
                            </button>
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

                {/* Preview Panel */}
                {isPreview && (
                    <div className="flex-1 h-full flex flex-col overflow-hidden">
                        <div
                            className="p-2 bg-(--surface-container) border-b border-(--outline-variant) flex items-center justify-between">
                            <span className="select-none text-xs font-medium text-(--on-surface-variant)">
                                {t("editor.preview")}
                            </span>
                            <button
                                onClick={toggleView}
                                className="p-1 rounded hover:bg-(--surface-container) text-(--on-surface-variant)"
                                aria-label={t("editor.switchToEditor")}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                                     fill="none"
                                     stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                                </svg>
                            </button>
                        </div>
                        <div
                            className="flex-1 overflow-y-auto p-6 prose prose-sm max-w-none bg-(--surface-container-high) dark:prose-invert">
                            <Markdown
                                remarkPlugins={[remarkGfm]}
                                rehypePlugins={[rehypeRaw]}
                                components={{
                                    code({node, inline, className, children, ...props}) {
                                        const match = /language-(\w+)/.exec(className || "");
                                        return !inline && match ? (
                                            <SyntaxHighlighter
                                                style={getThemeStyle(selectedTheme)}
                                                language={match[1]}
                                                PreTag="div"
                                                showLineNumbers={false}
                                                wrapLines
                                                {...props}
                                                className="rounded-md text-sm bg-(--surface-container-high)"
                                            >
                                                {String(children).replace(/\n$/, "")}
                                            </SyntaxHighlighter>
                                        ) : (
                                            <code
                                                className={`${className} px-1.5 py-0.5 rounded text-sm bg-(--surface-container-high)`}
                                                {...props}
                                            >
                                                {children}
                                            </code>
                                        );
                                    },
                                    h1: ({node, ...props}) => <h1
                                        className="text-2xl font-bold mt-6 mb-4 text-(--on-surface)" {...props} />,
                                    h2: ({node, ...props}) => <h2
                                        className="text-xl font-bold mt-5 mb-3 text-(--on-surface)" {...props} />,
                                    h3: ({node, ...props}) => <h3
                                        className="text-lg font-bold mt-4 mb-2 text-(--on-surface)" {...props} />,
                                    h4: ({node, ...props}) => <h4
                                        className="text-base font-bold mt-3 mb-2 text-(--on-surface)" {...props} />,
                                    h5: ({node, ...props}) => <h5
                                        className="text-sm font-bold mt-2 mb-1 text-(--on-surface)" {...props} />,
                                    p: ({node, ...props}) => <p className="my-3 text-(--on-surface)" {...props} />,
                                    a: ({node, ...props}) => <a
                                        className="text-(--primary) hover:underline" {...props} />,
                                    blockquote: ({node, ...props}) => <blockquote
                                        className="border-l-4 border-(--primary) pl-4 italic text-(--on-surface-variant)" {...props} />,
                                    ul: ({node, ...props}) => <ul
                                        className="my-3 pl-6 list-disc text-(--on-surface)" {...props} />,
                                    ol: ({node, ...props}) => <ol
                                        className="my-3 pl-6 list-decimal text-(--on-surface)" {...props} />,
                                    li: ({node, className, children, ...props}) => {
                                        const isTaskItem = className?.includes('task-list-item');
                                        return (
                                            <li
                                                className={`text-(--on-surface) my-1 ${isTaskItem ? 'flex items-start' : ''} ${className || ''}`}
                                                {...props}
                                            >
                                                {children}
                                            </li>
                                        );
                                    },
                                    input: ({node, className, checked, ...props}) => {
                                        if (props.type === 'checkbox') {
                                            return (
                                                <input
                                                    type="checkbox"
                                                    className={`h-4 w-4 mt-1 mr-2 rounded text-(--primary) border-(--outline) focus:ring-(--primary) ${className || ''}`}
                                                    checked={checked}
                                                    {...props}
                                                />
                                            );
                                        }
                                        return <input {...props} />;
                                    },
                                    del: ({node, ...props}) => <del className="text-(--on-surface)" {...props} />,
                                    em: ({node, ...props}) => <em className="italic text-(--on-surface)" {...props} />,
                                    strong: ({node, ...props}) => <strong
                                        className="font-semibold text-(--on-surface)" {...props} />,
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