import {useTranslation} from "react-i18next";
import {
    Save,
    X,
    Maximize2,
    Minimize2,
    Edit3,
    Columns,
    Eye,
    Download
} from "lucide-react";
import ThemeSelector from "../ThemeSelector.jsx";

const VIEW_MODES = {
    EDIT: 'edit',
    PREVIEW: 'preview',
    SPLIT: 'split'
};

export default function EditorHeader({
    activeNote,
    wordCount,
    inputText,
    isFullscreen,
    toggleFullscreen,
    viewMode,
    setViewModeHandler,
    isEdited,
    handleSave,
    handleExport,
    onCloseNote,
    selectedTheme,
    setSelectedTheme
}) {
    const {t} = useTranslation();

    return (
        <header className="flex items-center justify-between p-4 border-b border-(--outline-variant) bg-(--surface)">
            <div className="flex items-center space-x-2">
                <button
                    onClick={onCloseNote}
                    className="cursor-pointer p-2 rounded-lg hover:bg-(--surface-container-high) text-(--on-surface)"
                    aria-label={t("editor.closeNote")}
                >
                    <X size={16} />
                </button>
                <h1 className="text-lg font-semibold text-(--on-surface) truncate max-w-xs md:max-w-md">
                    {activeNote.title || t("editor.defaultNoteTitle")}
                </h1>
            </div>

            <div className="flex flex-wrap items-center space-x-2 gap-y-2">
                <span className="text-sm text-(--on-surface-variant) hidden sm:inline-block">
                    {wordCount} {t("editor.words")}
                </span>

                <button
                    onClick={handleExport}
                    disabled={!inputText.trim()}
                    className={`cursor-pointer flex items-center space-x-2 px-3 py-1.5 rounded-lg text-sm transition-colors ${inputText.trim() ? 'bg-(--surface-variant) text-(--on-surface-variant) hover:bg-(--primary-container) hover:text-(--on-primary-container)' : 'bg-(--surface-container-high) text-(--on-surface-variant) cursor-not-allowed opacity-50'}`}
                >
                    <Download size={15}/>
                    <span className="hidden md:inline">{t("editor.export")}</span>
                </button>

                <button
                    onClick={toggleFullscreen}
                    className="cursor-pointer p-2 rounded-lg hover:bg-(--surface-container-high) text-(--on-surface) transition-colors"
                    aria-label={isFullscreen ? t("editor.exitFullscreen") : t("editor.enterFullscreen")}
                    title={isFullscreen ? t("editor.exitFullscreen") : t("editor.enterFullscreen")}
                >
                    {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                </button>

                <ThemeSelector
                    selectedTheme={selectedTheme}
                    onThemeChange={setSelectedTheme}
                />

                <div className="flex bg-(--surface-container-high) rounded-lg p-1">
                    <button
                        onClick={() => setViewModeHandler(VIEW_MODES.EDIT)}
                        className={`cursor-pointer px-3 py-1.5 rounded-md text-sm flex items-center space-x-1 transition-colors ${viewMode === VIEW_MODES.EDIT ? 'bg-(--primary) text-(--on-primary)' : 'text-(--on-surface-variant) hover:text-(--on-surface)'}`}
                        title={t("editor.edit")}
                    >
                        <Edit3 size={14} />
                        <span className="hidden lg:inline">{t("editor.edit")}</span>
                    </button>
                    <button
                        onClick={() => setViewModeHandler(VIEW_MODES.SPLIT)}
                        className={`cursor-pointer px-3 py-1.5 rounded-md text-sm flex items-center space-x-1 transition-colors ${viewMode === VIEW_MODES.SPLIT ? 'bg-(--primary) text-(--on-primary)' : 'text-(--on-surface-variant) hover:text-(--on-surface)'}`}
                        title={t("editor.split")}
                    >
                        <Columns size={14} />
                        <span className="hidden lg:inline">{t("editor.split")}</span>
                    </button>
                    <button
                        onClick={() => setViewModeHandler(VIEW_MODES.PREVIEW)}
                        className={`cursor-pointer px-3 py-1.5 rounded-md text-sm flex items-center space-x-1 transition-colors ${viewMode === VIEW_MODES.PREVIEW ? 'bg-(--primary) text-(--on-primary)' : 'text-(--on-surface-variant) hover:text-(--on-surface)'}`}
                        title={t("editor.preview")}
                    >
                        <Eye size={14} />
                        <span className="hidden lg:inline">{t("editor.preview")}</span>
                    </button>
                </div>

                <button
                    onClick={handleSave}
                    disabled={!isEdited}
                    className={`px-4 py-1.5 rounded-lg text-sm flex items-center space-x-2 transition-colors ${isEdited ? 'bg-(--primary) text-(--on-primary) hover:bg-(--primary-container) hover:text-(--on-primary-container) cursor-pointer' : 'bg-(--surface-container-low) text-(--on-surface-variant) cursor-not-allowed border border-(--outline-variant)'}`}
                >
                    <Save size={16} />
                    <span className="hidden sm:inline">{t("editor.save")}</span>
                </button>
            </div>
        </header>
    );
}
