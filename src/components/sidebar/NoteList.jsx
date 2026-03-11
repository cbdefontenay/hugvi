import {useTranslation} from "react-i18next";
import {MoreVertical} from "lucide-react";

export function NoteList({
    folder,
    notes,
    activeNote,
    handleNoteClick,
    noteToModify,
    setNoteToModify,
    setNewNoteTitle,
    setIsRenameNoteModalOpen,
    setIsDeleteNoteConfirmOpen,
    menuRefs
}) {
    const {t} = useTranslation();

    return (
        <div className="space-y-1 pl-2 ml-4">
            {notes.map((note) => (
                <div
                    key={note.id}
                    className={`mb-[2px] group relative p-2 pl-3 text-sm rounded-lg cursor-pointer transition-colors ${
                        activeNote?.id === note.id
                            ? "bg-(--primary-container) text-(--on-primary-container)"
                            : "hover:bg-(--surface-container-highest) text-(--on-surface-variant) hover:text-(--on-surface)"
                    }`}
                    onClick={() => handleNoteClick(note)}
                >
                    <div className="flex items-center justify-between">
                        <span className="truncate pr-4 flex-1">
                            {note.title || t("panel.untitledNote")}
                        </span>
                        
                        <button
                            className={`cursor-pointer absolute right-1 p-1 rounded transition-opacity ${
                                noteToModify?.id === note.id ? "opacity-100 bg-(--surface-variant)" : "opacity-0 group-hover:opacity-100 hover:bg-(--surface-variant)"
                            }`}
                            onClick={(e) => {
                                e.stopPropagation();
                                if (noteToModify?.id === note.id) {
                                    setNoteToModify(null);
                                } else {
                                    setNoteToModify({
                                        ...note,
                                        folder_id: folder.id,
                                    });
                                    setNewNoteTitle(note.title);
                                }
                            }}
                            aria-label={t("panel.noteOptions")}
                        >
                            <MoreVertical size={14} className="text-(--on-surface-variant)" />
                        </button>
                    </div>

                    {/* Note context menu */}
                    {noteToModify?.id === note.id && (
                        <div
                            className="absolute right-0 top-8 z-50 bg-(--surface-container-highest) border border-(--outline-variant) rounded-lg shadow-xl text-sm p-1 space-y-1 min-w-[150px]"
                            ref={(el) => (menuRefs.current[`note-${note.id}`] = el)}
                        >
                            <div
                                className="hover:bg-(--surface-container) px-3 py-2 rounded-md cursor-pointer text-(--on-surface) flex items-center transition-colors"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsRenameNoteModalOpen(true);
                                }}
                            >
                                {t("panel.renameNote")}
                            </div>
                            <div
                                className="hover:bg-(--error-container) hover:text-(--on-error-container) px-3 py-2 rounded-md cursor-pointer text-(--error) flex items-center transition-colors"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsDeleteNoteConfirmOpen(true);
                                }}
                            >
                                {t("panel.deleteNote")}
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
