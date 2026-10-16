import {useTranslation} from "react-i18next";
import {X, FolderPlus, FilePlus, Edit, Trash2, AlertTriangle} from "lucide-react";

export function SidebarModals({
    isFolderModalOpen,
    setIsFolderModalOpen,
    folderName,
    setFolderName,
    handleAddFolder,
    error,
    setError,
    showDeleteConfirm,
    confirmDelete,
    isNoteModalOpen,
    setIsNoteModalOpen,
    noteName,
    setNoteName,
    handleCreateNote,
    isRenameNoteModalOpen,
    setIsRenameNoteModalOpen,
    newNoteTitle,
    setNewNoteTitle,
    handleRenameNote,
    isDeleteNoteConfirmOpen,
    setIsDeleteNoteConfirmOpen,
    handleDeleteNote
}) {
    const {t} = useTranslation();

    return (
        <>
            {/* Folder Creation Modal */}
            {isFolderModalOpen && (
                <div 
                    className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 animate-fade-in backdrop-blur-sm"
                    onClick={(e) => { if (e.target === e.currentTarget) setIsFolderModalOpen(false); }}
                >
                    <div className="bg-(--surface) p-6 rounded-xl shadow-2xl w-full max-w-md border border-(--outline-variant) mx-4 transform transition-all">
                        <div className="flex justify-between items-center mb-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-(--primary-container) text-(--on-primary-container)">
                                    <FolderPlus size={20} />
                                </div>
                                <h3 className="text-lg font-semibold text-(--on-surface)">
                                    {t("panel.createFolder")}
                                </h3>
                            </div>
                            <button 
                                onClick={() => setIsFolderModalOpen(false)} 
                                className="p-1.5 rounded-lg text-(--on-surface-variant) hover:text-(--on-surface) hover:bg-(--surface-container-high) transition-colors"
                            >
                                <X size={18} />
                            </button>
                        </div>
                        <input
                            type="text"
                            value={folderName}
                            onChange={(e) => setFolderName(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    handleAddFolder();
                                }
                            }}
                            className="w-full px-4 py-3 border border-(--outline-variant) rounded-lg bg-(--surface-container) text-(--on-surface) focus:outline-none focus:ring-2 focus:ring-(--primary) focus:border-transparent transition-all"
                            placeholder={t("panel.folderName")}
                            autoFocus
                        />
                        {error && (
                            <div className="flex items-center gap-2 mt-3 p-3 bg-(--error-container)/30 rounded-lg">
                                <AlertTriangle size={16} className="text-(--error) flex-shrink-0" />
                                <p className="text-(--error) text-sm">{error}</p>
                            </div>
                        )}
                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                onClick={() => setIsFolderModalOpen(false)}
                                className="cursor-pointer px-5 py-2.5 border border-(--outline-variant) rounded-lg hover:bg-(--surface-container-high) text-(--on-surface-variant) transition-colors font-medium"
                            >
                                {t("panel.cancel")}
                            </button>
                            <button
                                onClick={handleAddFolder}
                                className="cursor-pointer px-5 py-2.5 bg-(--primary) text-(--on-primary) rounded-lg hover:opacity-90 transition-opacity font-medium shadow-sm"
                            >
                                {t("panel.create")}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div 
                    className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 animate-fade-in backdrop-blur-sm"
                    onClick={(e) => { if (e.target === e.currentTarget) confirmDelete(false); }}
                >
                    <div className="bg-(--surface) p-6 rounded-xl shadow-2xl w-full max-w-md border border-(--outline-variant) mx-4">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 rounded-lg bg-(--error-container)/30 text-(--error)">
                                <Trash2 size={20} />
                            </div>
                            <h3 className="text-lg font-semibold text-(--on-surface)">
                                {t("panel.deleteFolderConfirm")}
                            </h3>
                        </div>
                        <p className="mb-6 text-(--on-surface-variant) leading-relaxed">
                            {t("panel.deleteFolderWarning")}
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => confirmDelete(false)}
                                className="cursor-pointer px-5 py-2.5 border border-(--outline-variant) rounded-lg hover:bg-(--surface-container-high) text-(--on-surface-variant) transition-colors font-medium"
                            >
                                {t("panel.cancel")}
                            </button>
                            <button
                                onClick={() => confirmDelete(true)}
                                className="cursor-pointer px-5 py-2.5 bg-(--error) text-(--on-error) rounded-lg hover:opacity-90 transition-opacity font-medium shadow-sm"
                            >
                                {t("panel.delete")}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Note Creation Modal */}
            {isNoteModalOpen && (
                <div 
                    className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 animate-fade-in backdrop-blur-sm"
                    onClick={(e) => { if (e.target === e.currentTarget) setIsNoteModalOpen(false); }}
                >
                    <div className="bg-(--surface) p-6 rounded-xl shadow-2xl w-full max-w-md border border-(--outline-variant) mx-4">
                        <div className="flex justify-between items-center mb-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-(--primary-container) text-(--on-primary-container)">
                                    <FilePlus size={20} />
                                </div>
                                <h3 className="text-lg font-semibold text-(--on-surface)">
                                    {t("panel.createNote")}
                                </h3>
                            </div>
                            <button 
                                onClick={() => setIsNoteModalOpen(false)} 
                                className="p-1.5 rounded-lg text-(--on-surface-variant) hover:text-(--on-surface) hover:bg-(--surface-container-high) transition-colors"
                            >
                                <X size={18} />
                            </button>
                        </div>
                        <input
                            type="text"
                            value={noteName}
                            onChange={(e) => setNoteName(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    handleCreateNote();
                                }
                            }}
                            className="w-full px-4 py-3 border border-(--outline-variant) rounded-lg bg-(--surface-container) text-(--on-surface) focus:outline-none focus:ring-2 focus:ring-(--primary) focus:border-transparent transition-all"
                            placeholder={t("panel.noteTitle")}
                            autoFocus
                        />
                        {error && (
                            <div className="flex items-center gap-2 mt-3 p-3 bg-(--error-container)/30 rounded-lg">
                                <AlertTriangle size={16} className="text-(--error) flex-shrink-0" />
                                <p className="text-(--error) text-sm">{error}</p>
                            </div>
                        )}
                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                onClick={() => setIsNoteModalOpen(false)}
                                className="cursor-pointer px-5 py-2.5 border border-(--outline-variant) rounded-lg hover:bg-(--surface-container-high) text-(--on-surface-variant) transition-colors font-medium"
                            >
                                {t("panel.cancel")}
                            </button>
                            <button
                                onClick={handleCreateNote}
                                className="cursor-pointer px-5 py-2.5 bg-(--primary) text-(--on-primary) rounded-lg hover:opacity-90 transition-opacity font-medium shadow-sm"
                            >
                                {t("panel.create")}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Rename Note Modal */}
            {isRenameNoteModalOpen && (
                <div 
                    className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 animate-fade-in backdrop-blur-sm"
                    onClick={(e) => { if (e.target === e.currentTarget) { setIsRenameNoteModalOpen(false); setError(""); } }}
                >
                    <div className="bg-(--surface) p-6 rounded-xl shadow-2xl w-full max-w-md border border-(--outline-variant) mx-4">
                        <div className="flex justify-between items-center mb-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-(--primary-container) text-(--on-primary-container)">
                                    <Edit size={20} />
                                </div>
                                <h3 className="text-lg font-semibold text-(--on-surface)">
                                    {t("panel.renameNote")}
                                </h3>
                            </div>
                            <button 
                                onClick={() => { setIsRenameNoteModalOpen(false); setError(""); }} 
                                className="p-1.5 rounded-lg text-(--on-surface-variant) hover:text-(--on-surface) hover:bg-(--surface-container-high) transition-colors"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <input
                            type="text"
                            value={newNoteTitle}
                            onChange={(e) => {
                                setNewNoteTitle(e.target.value);
                                setError("");
                            }}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    handleRenameNote();
                                }
                            }}
                            className="w-full px-4 py-3 border border-(--outline-variant) rounded-lg bg-(--surface-container) text-(--on-surface) focus:outline-none focus:ring-2 focus:ring-(--primary) focus:border-transparent transition-all"
                            placeholder={t("panel.noteTitle")}
                            autoFocus
                        />

                        {error && (
                            <div className="flex items-center gap-2 mt-3 p-3 bg-(--error-container)/30 rounded-lg">
                                <AlertTriangle size={16} className="text-(--error) flex-shrink-0" />
                                <p className="text-(--error) text-sm">{error}</p>
                            </div>
                        )}

                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                onClick={() => {
                                    setIsRenameNoteModalOpen(false);
                                    setError("");
                                }}
                                className="cursor-pointer px-5 py-2.5 border border-(--outline-variant) rounded-lg hover:bg-(--surface-container-high) text-(--on-surface-variant) transition-colors font-medium"
                            >
                                {t("panel.cancel")}
                            </button>
                            <button
                                onClick={handleRenameNote}
                                className="cursor-pointer px-5 py-2.5 bg-(--primary) text-(--on-primary) rounded-lg hover:opacity-90 transition-opacity font-medium shadow-sm"
                            >
                                {t("panel.rename")}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Note Confirmation Modal */}
            {isDeleteNoteConfirmOpen && (
                <div 
                    className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 animate-fade-in backdrop-blur-sm"
                    onClick={(e) => { if (e.target === e.currentTarget) setIsDeleteNoteConfirmOpen(false); }}
                >
                    <div className="bg-(--surface) p-6 rounded-xl shadow-2xl w-full max-w-md border border-(--outline-variant) mx-4">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 rounded-lg bg-(--error-container)/30 text-(--error)">
                                <Trash2 size={20} />
                            </div>
                            <h3 className="text-lg font-semibold text-(--on-surface)">
                                {t("panel.deleteNoteConfirm")}
                            </h3>
                        </div>
                        <p className="mb-6 text-(--on-surface-variant) leading-relaxed">
                            {t("panel.deleteNoteWarning")}
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setIsDeleteNoteConfirmOpen(false)}
                                className="cursor-pointer px-5 py-2.5 border border-(--outline-variant) rounded-lg hover:bg-(--surface-container-high) text-(--on-surface-variant) transition-colors font-medium"
                            >
                                {t("panel.cancel")}
                            </button>
                            <button
                                onClick={handleDeleteNote}
                                className="cursor-pointer px-5 py-2.5 bg-(--error) text-(--on-error) rounded-lg hover:opacity-90 transition-opacity font-medium shadow-sm"
                            >
                                {t("panel.delete")}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
