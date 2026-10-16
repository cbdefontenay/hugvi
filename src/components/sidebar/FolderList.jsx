import {useTranslation} from "react-i18next";
import {Folder as FolderIcon, FolderOpen, MoreVertical, FilePlus, Edit, Upload, Trash2} from "lucide-react";
import {NoteList} from "./NoteList.jsx";

export function FolderList({
    folders,
    expandedFolders,
    toggleFolderExpansion,
    menuOpen,
    toggleFolderMenu,
    notes,
    activeNote,
    handleNoteClick,
    noteToModify,
    setNoteToModify,
    setNewNoteTitle,
    setIsRenameNoteModalOpen,
    setIsDeleteNoteConfirmOpen,
    menuRefs,
    openNoteModal,
    handleDeleteFolder,
    handleImportClick,
    isCollapsed
}) {
    const {t} = useTranslation();

    return (
        <div className="px-3 space-y-1.5 relative mt-2">
            {folders.map((folder, index) => (
                <div
                    key={folder.id}
                    className="space-y-1"
                >
                    <div
                        className={`flex flex-row items-center justify-between font-medium px-3 py-2.5 rounded-xl truncate group transition-all cursor-pointer ${
                            expandedFolders[folder.id] 
                                ? "bg-(--surface-container-high) shadow-sm" 
                                : "hover:bg-(--surface-container) bg-transparent"
                        }`}
                        title={folder.name}
                        onClick={() => toggleFolderExpansion(folder.id)}
                    >
                        <div className="flex items-center flex-1 min-w-0">
                            <span className={`text-(--primary) transition-transform flex-shrink-0 ${isCollapsed ? "mx-auto" : "mr-3"}`}>
                                {expandedFolders[folder.id] ? 
                                    <FolderOpen size={18} className="fill-(--primary)/20" /> : 
                                    <FolderIcon size={18} className="fill-(--primary)/20" />
                                }
                            </span>
                            
                            {!isCollapsed && (
                                <span className="text-(--on-surface) truncate text-sm font-medium">
                                    {folder.name}
                                </span>
                            )}
                        </div>
                        
                        {!isCollapsed && (
                            <button
                                className={`cursor-pointer p-1.5 rounded-lg transition-all ${
                                    menuOpen === index ? "opacity-100 bg-(--surface-variant)" : "opacity-0 group-hover:opacity-100 hover:bg-(--surface-variant)"
                                }`}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    toggleFolderMenu(index, folder.id);
                                }}
                                aria-label={t("panel.folderOptions")}
                            >
                                <MoreVertical size={15} className="text-(--on-surface-variant)" />
                            </button>
                        )}
                    </div>

                    {/* Notes list for this folder */}
                    {!isCollapsed && expandedFolders[folder.id] && notes[folder.id] && (
                        <NoteList 
                            folder={folder}
                            notes={notes[folder.id]}
                            activeNote={activeNote}
                            handleNoteClick={handleNoteClick}
                            noteToModify={noteToModify}
                            setNoteToModify={setNoteToModify}
                            setNewNoteTitle={setNewNoteTitle}
                            setIsRenameNoteModalOpen={setIsRenameNoteModalOpen}
                            setIsDeleteNoteConfirmOpen={setIsDeleteNoteConfirmOpen}
                            menuRefs={menuRefs}
                        />
                    )}
                </div>
            ))}

            {/* Menu positioned outside the folder items */}
            {!isCollapsed && menuOpen !== null && folders[menuOpen] && (
                <div
                    ref={(el) => (menuRefs.current[menuOpen] = el)}
                    className="absolute right-4 bg-(--surface-container-highest) border border-(--outline-variant) rounded-xl shadow-2xl z-50 text-sm p-1.5 space-y-0.5 min-w-[180px] top-0 animate-fade-in"
                    style={{transform: `translateY(calc(${menuOpen * 52}px + 12px))`}}
                >
                    <button
                        className="w-full hover:bg-(--surface-container) px-3 py-2.5 rounded-lg cursor-pointer text-(--on-surface) transition-colors flex items-center gap-3"
                        onClick={() => {
                            openNoteModal(folders[menuOpen].id);
                            toggleFolderMenu(null);
                        }}
                    >
                        <FilePlus size={15} />
                        {t("panel.createNote")}
                    </button>
                    <button
                        className="w-full hover:bg-(--surface-container) px-3 py-2.5 rounded-lg cursor-pointer text-(--on-surface) transition-colors flex items-center gap-3"
                    >
                        <Edit size={15} />
                        {t("panel.renameFolder")}
                    </button>
                    <button
                        className="w-full hover:bg-(--surface-container) px-3 py-2.5 rounded-lg cursor-pointer text-(--on-surface) transition-colors flex items-center gap-3"
                        onClick={() => {
                            handleImportClick(folders[menuOpen].id);
                            toggleFolderMenu(null);
                        }}
                    >
                        <Upload size={15} />
                        {t("panel.importNote")}
                    </button>
                    <div className="h-px bg-(--outline-variant) my-1.5 mx-1"></div>
                    <button
                        className="w-full hover:bg-(--error-container) hover:text-(--on-error-container) px-3 py-2.5 rounded-lg cursor-pointer text-(--error) transition-colors flex items-center gap-3"
                        onClick={() => handleDeleteFolder(folders[menuOpen].id)}
                    >
                        <Trash2 size={15} />
                        {t("panel.deleteFolder")}
                    </button>
                </div>
            )}
        </div>
    );
}
