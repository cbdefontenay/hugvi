import {useTranslation} from "react-i18next";
import {X} from "lucide-react";

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
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-(--surface) p-6 rounded-lg shadow-lg w-96 border border-(--outline-variant)">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-semibold text-(--on-surface)">
                                {t("panel.createFolder")}
                            </h3>
                            <button onClick={() => setIsFolderModalOpen(false)} className="text-(--on-surface-variant) hover:text-(--on-surface)">
                                <X size={20} />
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
                            className="w-full p-2 border border-(--outline-variant) rounded mb-2 bg-(--surface-container) text-(--on-surface) focus:outline-none focus:ring-2 focus:ring-(--primary)"
                            placeholder={t("panel.folderName")}
                            autoFocus
                        />
                        {error && <p className="text-(--error) text-sm mb-4">{error}</p>}
                        <div className="flex justify-end gap-2 mt-4">
                            <button
                                onClick={() => setIsFolderModalOpen(false)}
                                className="cursor-pointer px-4 py-2 border border-(--outline-variant) rounded hover:bg-(--surface-container-high) text-(--on-surface-variant)"
                            >
                                {t("panel.cancel")}
                            </button>
                            <button
                                onClick={handleAddFolder}
                                className="cursor-pointer px-4 py-2 bg-(--primary) text-(--on-primary) rounded hover:bg-(--primary-container) hover:text-(--on-primary-container)"
                            >
                                {t("panel.create")}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-(--surface) p-6 rounded-lg shadow-lg w-96 border border-(--outline-variant)">
                        <h3 className="text-xl font-semibold mb-4 text-(--on-surface)">
                            {t("panel.deleteFolderConfirm")}
                        </h3>
                        <p className="mb-6 text-(--on-surface-variant)">
                            {t("panel.deleteFolderWarning")}
                        </p>
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => confirmDelete(false)}
                                className="cursor-pointer px-4 py-2 border border-(--outline-variant) rounded hover:bg-(--surface-container-high) text-(--on-surface-variant)"
                            >
                                {t("panel.cancel")}
                            </button>
                            <button
                                onClick={() => confirmDelete(true)}
                                className="cursor-pointer px-4 py-2 bg-(--error) text-(--on-error) rounded hover:bg-(--error-container) hover:text-(--on-error-container)"
                            >
                                {t("panel.delete")}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Note Creation Modal */}
            {isNoteModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-(--surface) p-6 rounded-lg shadow-lg w-96 border border-(--outline-variant)">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-semibold text-(--on-surface)">
                                {t("panel.createNote")}
                            </h3>
                            <button onClick={() => setIsNoteModalOpen(false)} className="text-(--on-surface-variant) hover:text-(--on-surface)">
                                <X size={20} />
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
                            className="w-full p-2 border border-(--outline-variant) rounded mb-2 bg-(--surface-container) text-(--on-surface) focus:outline-none focus:ring-2 focus:ring-(--primary)"
                            placeholder={t("panel.noteTitle")}
                            autoFocus
                        />
                        {error && <p className="text-(--error) text-sm mb-4">{error}</p>}
                        <div className="flex justify-end gap-2 mt-4">
                            <button
                                onClick={() => setIsNoteModalOpen(false)}
                                className="cursor-pointer px-4 py-2 border border-(--outline-variant) rounded hover:bg-(--surface-container-high) text-(--on-surface-variant)"
                            >
                                {t("panel.cancel")}
                            </button>
                            <button
                                onClick={handleCreateNote}
                                className="cursor-pointer px-4 py-2 bg-(--primary) text-(--on-primary) rounded hover:bg-(--primary-container) hover:text-(--on-primary-container)"
                            >
                                {t("panel.create")}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Rename Note Modal */}
            {isRenameNoteModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="modal-content bg-(--surface) p-6 rounded-lg shadow-lg w-96 border border-(--outline-variant)">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-semibold text-(--on-surface)">
                                {t("panel.renameNote")}
                            </h3>
                            <button onClick={() => { setIsRenameNoteModalOpen(false); setError(""); }} className="text-(--on-surface-variant) hover:text-(--on-surface)">
                                <X size={20} />
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
                            className="w-full p-2 border border-(--outline-variant) rounded mb-2 bg-(--surface-container) text-(--on-surface) focus:outline-none focus:ring-2 focus:ring-(--primary)"
                            placeholder={t("panel.noteTitle")}
                            autoFocus
                        />

                        {error && (
                            <p className="text-(--error) text-sm mb-4">
                                {error}
                            </p>
                        )}

                        <div className="flex justify-end gap-2 mt-4">
                            <button
                                onClick={() => {
                                    setIsRenameNoteModalOpen(false);
                                    setError("");
                                }}
                                className="cursor-pointer px-4 py-2 border border-(--outline-variant) rounded hover:bg-(--surface-container-high) text-(--on-surface-variant)"
                            >
                                {t("panel.cancel")}
                            </button>
                            <button
                                onClick={handleRenameNote}
                                className="cursor-pointer px-4 py-2 bg-(--primary) text-(--on-primary) rounded hover:bg-(--primary-container) hover:text-(--on-primary-container)"
                            >
                                {t("panel.rename")}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Note Confirmation Modal */}
            {isDeleteNoteConfirmOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-(--surface) p-6 rounded-lg shadow-lg w-96 border border-(--outline-variant)">
                        <h3 className="text-xl font-semibold mb-4 text-(--on-surface)">
                            {t("panel.deleteNoteConfirm")}
                        </h3>
                        <p className="mb-6 text-(--on-surface-variant)">
                            {t("panel.deleteNoteWarning")}
                        </p>
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setIsDeleteNoteConfirmOpen(false)}
                                className="cursor-pointer px-4 py-2 border border-(--outline-variant) rounded hover:bg-(--surface-container-high) text-(--on-surface-variant)"
                            >
                                {t("panel.cancel")}
                            </button>
                            <button
                                onClick={handleDeleteNote}
                                className="cursor-pointer px-4 py-2 bg-(--error) text-(--on-error) rounded hover:bg-(--error-container) hover:text-(--on-error-container)"
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
