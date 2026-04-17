import {useTranslation} from "react-i18next";

export default function EditorStatusBar({
    activeNote,
    wordCount,
    inputText,
    viewMode,
    isFullscreen
}) {
    const {t} = useTranslation();

    return (
        <div className="px-3 py-2 text-[10px] sm:text-xs flex flex-wrap justify-between items-center bg-(--surface-container-high) border-t border-(--outline-variant) text-(--on-surface-variant) gap-2">
            <div className="truncate min-w-0">
                {activeNote?.title && (
                    <span className="inline-block align-middle font-medium max-w-full truncate">
                        {activeNote.title}
                    </span>
                )}
            </div>
            <div className="flex flex-wrap items-center justify-end space-x-2 sm:space-x-4">
                <span className="hidden md:inline-block">{new Date().toLocaleDateString()}</span>
                <span>{wordCount} {t("editor.words")}</span>
                <span className="hidden sm:inline-block">{inputText.length} {t("editor.characters")}</span>
                <span className="capitalize px-1.5 py-0.5 rounded-full bg-(--surface-container-highest) font-medium text-(--on-surface)">
                    {viewMode} {t("editor.mode")}
                </span>
                {isFullscreen && (
                    <span className="text-(--primary) font-medium uppercase">
                        {t("editor.fullscreen")}
                    </span>
                )}
            </div>
        </div>
    );
}
