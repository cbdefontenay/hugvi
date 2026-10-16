import {useTranslation} from "react-i18next";
import {FileText, MoreVertical, Edit, Trash2} from "lucide-react";

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
        <div className="space-y-1 pl-2 ml-4 border-l-2 border-(--outline-variant)/30">
            {notes.map((note) => (
                <div
                    key={note.id}
                    className={`group relative px-3 py-2.5 text-sm rounded-xl cursor-pointer transition-all ${
                        activeNote?.id === note.id
                            ? "bg-(--primary) text-(--on-primary) shadow-sm"
                            : "hover:bg-(--surface-container-high) text-(--on-surface-variant) hover:text-(--on-surface)"
                    }`}
                    onClick={() => handleNoteClick(note)}
                >
                    <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                            <FileText size={14} className="flex-shrink-0 opacity-70" />
                            <span className="truncate font-medium">
                                {note.title || t("panel.untitledNote")}
                            </span>
                        </div>
                        
                        <button
                            className={`cursor-pointer p-1 rounded-lg transition-all flex-shrink-0 ${
                                noteToModify?.id === note.id 
                                    ? "opacity-100 bg-(--surface-variant)" 
                                    : "opacity-0 group-hover:opacity-100 hover:bg-(--surface-variant)"
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
                            className="absolute right-0 top-full mt-1 z-50 bg-(--surface-container-highest) border border-(--outline-variant) rounded-xl shadow-2xl text-sm p-1.5 space-y-0.5 min-w-[170px] animate-fade-in"
                            ref={(el) => (menuRefs.current[`note-${note.id}`] = el)}
                        >
                            <button
                                className="w-full hover:bg-(--surface-container) px-3 py-2.5 rounded-lg cursor-pointer text-(--on-surface) flex items-center gap-3 transition-colors"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsRenameNoteModalOpen(true);
                                }}
                            >
                                <Edit size={14} />
                                {t("panel.renameNote")}
                            </button>
                            <button
                                className="w-full hover:bg-(--error-container) hover:text-(--on-error-container) px-3 py-2.5 rounded-lg cursor-pointer text-(--error) flex items-center gap-3 transition-colors"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsDeleteNoteConfirmOpen(true);
                                }}
                            >
                                <Trash2 size={14} />
                                {t("panel.deleteNote")}
                            </button>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
