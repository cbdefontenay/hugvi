import {useTranslation} from "react-i18next";
import {
    Save,
    X,
    Maximize2,
    Minimize2,
    Edit3,
    Columns,
    Eye,
    Download,
    FileText
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
        <header className="flex flex-wrap items-center justify-between px-4 md:px-6 py-3 border-b border-(--outline-variant) bg-(--surface)/80 backdrop-blur-sm gap-3">
            <div className="flex items-center gap-3 flex-1 min-w-0">
                <button
                    onClick={isFullscreen ? toggleFullscreen : onCloseNote}
                    className={`cursor-pointer p-2 rounded-xl hover:bg-(--surface-container-high) text-(--on-surface) transition-all ${isFullscreen ? 'block bg-(--surface-container-high)/50' : 'md:hidden'}`}
                    aria-label={isFullscreen ? t("editor.exitFullscreen") : t("editor.closeNote")}
                    title={isFullscreen ? t("editor.exitFullscreen") : t("editor.closeNote")}
                >
                    <X size={18} />
                </button>
                <div className="flex items-center gap-2 min-w-0">
                    <FileText size={18} className="text-(--primary) flex-shrink-0" />
                    <h1 className="text-sm md:text-base font-semibold text-(--on-surface) truncate">
                        {activeNote.title || t("editor.defaultNoteTitle")}
                    </h1>
                    {isEdited && (
                        <span className="w-2 h-2 rounded-full bg-(--primary) flex-shrink-0 animate-pulse" title="Unsaved changes"></span>
                    )}
                </div>
            </div>

            <div className="flex flex-wrap items-center justify-end gap-2 flex-1 min-w-0">
                <button
                    onClick={handleSave}
                    disabled={!isEdited}
                    className={`px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 transition-all ${
                        isEdited 
                            ? 'bg-(--primary) text-(--on-primary) hover:opacity-90 shadow-sm cursor-pointer' 
                            : 'bg-(--surface-container-low) text-(--on-surface-variant) cursor-not-allowed border border-(--outline-variant) opacity-60'
                    }`}
                >
                    <Save size={15} />
                    <span className="hidden sm:inline">{t("editor.save")}</span>
                </button>

                <div className="flex bg-(--surface-container-high) rounded-xl p-1 shadow-inner">
                    <button
                        onClick={() => setViewModeHandler(VIEW_MODES.EDIT)}
                        className={`cursor-pointer px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
                            viewMode === VIEW_MODES.EDIT 
                                ? 'bg-(--primary) text-(--on-primary) shadow-sm' 
                                : 'text-(--on-surface-variant) hover:text-(--on-surface) hover:bg-(--surface-container)'
                        }`}
                        title={t("editor.edit")}
                        aria-label={t("editor.edit")}
                    >
                        <Edit3 size={14} />
                        <span className="hidden md:inline">{t("editor.edit")}</span>
                    </button>
                    <button
                        onClick={() => setViewModeHandler(VIEW_MODES.SPLIT)}
                        className={`cursor-pointer px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
                            viewMode === VIEW_MODES.SPLIT 
                                ? 'bg-(--primary) text-(--on-primary) shadow-sm' 
                                : 'text-(--on-surface-variant) hover:text-(--on-surface) hover:bg-(--surface-container)'
                        }`}
                        title={t("editor.split")}
                        aria-label={t("editor.split")}
                    >
                        <Columns size={14} />
                        <span className="hidden md:inline">{t("editor.split")}</span>
                    </button>
                    <button
                        onClick={() => setViewModeHandler(VIEW_MODES.PREVIEW)}
                        className={`cursor-pointer px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
                            viewMode === VIEW_MODES.PREVIEW 
                                ? 'bg-(--primary) text-(--on-primary) shadow-sm' 
                                : 'text-(--on-surface-variant) hover:text-(--on-surface) hover:bg-(--surface-container)'
                        }`}
                        title={t("editor.preview")}
                        aria-label={t("editor.preview")}
                    >
                        <Eye size={14} />
                        <span className="hidden md:inline">{t("editor.preview")}</span>
                    </button>
                </div>

                <ThemeSelector
                    selectedTheme={selectedTheme}
                    onThemeChange={setSelectedTheme}
                />

                <button
                    onClick={toggleFullscreen}
                    className="cursor-pointer p-2.5 rounded-xl hover:bg-(--surface-container-high) text-(--on-surface) transition-all hover:scale-105"
                    aria-label={isFullscreen ? t("editor.exitFullscreen") : t("editor.enterFullscreen")}
                    title={isFullscreen ? t("editor.exitFullscreen") : t("editor.enterFullscreen")}
                >
                    {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                </button>

                <button
                    onClick={handleExport}
                    disabled={!inputText.trim()}
                    className={`cursor-pointer flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                        inputText.trim() 
                            ? 'bg-(--surface-variant) text-(--on-surface-variant) hover:bg-(--primary-container) hover:text-(--on-primary-container) hover:scale-105' 
                            : 'bg-(--surface-container-high) text-(--on-surface-variant) cursor-not-allowed opacity-50'
                    }`}
                >
                    <Download size={15} />
                    <span className="hidden sm:inline">{t("editor.export")}</span>
                </button>
            </div>
        </header>
    );
}
