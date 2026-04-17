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
        <header className="flex flex-wrap items-center justify-between p-3 md:p-4 border-b border-(--outline-variant) bg-(--surface) gap-2">
            <div className="flex items-center space-x-2 flex-1 min-w-0">
                {/* 
                  When in fullscreen, 'X' acts as a 'Back' to gallery/normal view (Exit Fullscreen).
                  When NOT in fullscreen, on mobile it acts as 'Close Note', on desktop it is hidden 
                  since the sidebar is visible.
                */}
                <button
                    onClick={isFullscreen ? toggleFullscreen : onCloseNote}
                    className={`cursor-pointer p-2 rounded-lg hover:bg-(--surface-container-high) text-(--on-surface) transition-all ${isFullscreen ? 'block bg-(--surface-container-high)/50' : 'md:hidden'}`}
                    aria-label={isFullscreen ? t("editor.exitFullscreen") : t("editor.closeNote")}
                    title={isFullscreen ? t("editor.exitFullscreen") : t("editor.closeNote")}
                >
                    <X size={18} />
                </button>
                <h1 className="text-base md:text-lg font-semibold text-(--on-surface) truncate max-w-[calc(100%-80px)] sm:max-w-xs md:max-w-md">
                    {activeNote.title || t("editor.defaultNoteTitle")}
                </h1>
            </div>

            <div className="flex flex-wrap items-center justify-end space-x-1 sm:space-x-2 gap-y-2 flex-1 min-w-0">
                <button
                    onClick={handleSave}
                    disabled={!isEdited}
                    className={`px-3 py-1.5 rounded-lg text-sm flex items-center space-x-1 sm:space-x-2 transition-colors ${isEdited ? 'bg-(--primary) text-(--on-primary) hover:bg-(--primary-container) hover:text-(--on-primary-container) cursor-pointer' : 'bg-(--surface-container-low) text-(--on-surface-variant) cursor-not-allowed border border-(--outline-variant)'}`}
                >
                    <Save size={14} className="sm:hidden" />
                    <Save size={16} className="hidden sm:block" />
                    <span className="hidden sm:inline">{t("editor.save")}</span>
                </button>

                <div className="flex bg-(--surface-container-high) rounded-lg p-0.5">
                    <button
                        onClick={() => setViewModeHandler(VIEW_MODES.EDIT)}
                        className={`cursor-pointer px-2 py-1 rounded-md text-xs sm:text-sm flex items-center space-x-1 transition-colors ${viewMode === VIEW_MODES.EDIT ? 'bg-(--primary) text-(--on-primary)' : 'text-(--on-surface-variant) hover:text-(--on-surface)'}`}
                        title={t("editor.edit")}
                        aria-label={t("editor.edit")}
                    >
                        <Edit3 size={14} />
                    </button>
                    <button
                        onClick={() => setViewModeHandler(VIEW_MODES.SPLIT)}
                        className={`cursor-pointer px-2 py-1 rounded-md text-xs sm:text-sm flex items-center space-x-1 transition-colors ${viewMode === VIEW_MODES.SPLIT ? 'bg-(--primary) text-(--on-primary)' : 'text-(--on-surface-variant) hover:text-(--on-surface)'}`}
                        title={t("editor.split")}
                        aria-label={t("editor.split")}
                    >
                        <Columns size={14} />
                    </button>
                    <button
                        onClick={() => setViewModeHandler(VIEW_MODES.PREVIEW)}
                        className={`cursor-pointer px-2 py-1 rounded-md text-xs sm:text-sm flex items-center space-x-1 transition-colors ${viewMode === VIEW_MODES.PREVIEW ? 'bg-(--primary) text-(--on-primary)' : 'text-(--on-surface-variant) hover:text-(--on-surface)'}`}
                        title={t("editor.preview")}
                        aria-label={t("editor.preview")}
                    >
                        <Eye size={14} />
                    </button>
                </div>

                <ThemeSelector
                    selectedTheme={selectedTheme}
                    onThemeChange={setSelectedTheme}
                />

                <button
                    onClick={toggleFullscreen}
                    className="cursor-pointer p-2 rounded-lg hover:bg-(--surface-container-high) text-(--on-surface) transition-colors"
                    aria-label={isFullscreen ? t("editor.exitFullscreen") : t("editor.enterFullscreen")}
                    title={isFullscreen ? t("editor.exitFullscreen") : t("editor.enterFullscreen")}
                >
                    {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                </button>

                <button
                    onClick={handleExport}
                    disabled={!inputText.trim()}
                    className={`cursor-pointer flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm transition-colors ${inputText.trim() ? 'bg-(--surface-variant) text-(--on-surface-variant) hover:bg-(--primary-container) hover:text-(--on-primary-container)' : 'bg-(--surface-container-high) text-(--on-surface-variant) cursor-not-allowed opacity-50'}`}
                >
                    <Download size={14} />
                    <span className="hidden sm:inline">{t("editor.export")}</span>
                </button>
            </div>
        </header>
    );
}
