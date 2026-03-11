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
        <div className="px-4 py-2 text-xs flex justify-between items-center bg-(--surface-container-high) border-t border-(--outline-variant) text-(--on-surface-variant)">
            <div>
                {activeNote?.title && (
                    <span className="truncate max-w-xs inline-block align-middle font-medium">
                        {activeNote.title}
                    </span>
                )}
            </div>
            <div className="flex flex-wrap items-center space-x-4">
                <span className="hidden sm:inline-block">{new Date().toLocaleDateString()}</span>
                <span>{wordCount} {t("editor.words")}</span>
                <span className="hidden sm:inline-block">{inputText.length} {t("editor.characters")}</span>
                <span className="capitalize px-2 py-0.5 rounded-full bg-(--surface-container-highest) font-medium text-(--on-surface)">
                    {viewMode} {t("editor.mode")}
                </span>
                {isFullscreen && (
                    <span className="text-(--primary) font-medium tracking-wide uppercase text-[10px]">
                        {t("editor.fullscreen")}
                    </span>
                )}
            </div>
        </div>
    );
}
