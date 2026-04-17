import {useEffect, useRef, useState} from "react";
import {Link} from "react-router-dom";
import {
    handleAddFolderAsync,
    handleCreateNoteAsync,
    handleDeleteFolderAsync,
    handleDeleteNoteAsync,
    handleRenameNoteAsync,
    handleSaveNoteAsync,
    handleImportFileAsync,
    loadFoldersAndNotes,
} from "../helpers/DbHelpers.js";
import {useDb} from "../helpers/DbContext.jsx";
import {useFullscreen} from "../helpers/FullscreenContext.jsx";
import EditorComponent from "../components/EditorComponent.jsx";
import ErrorBoundary from "../components/ErrorBoundary.jsx";
import {useTranslation} from "react-i18next";
import {FolderPlus, Menu, ChevronLeft, X, House, Settings} from "lucide-react";
import {FolderList} from "../components/sidebar/FolderList.jsx";
import {SidebarModals} from "../components/sidebar/SidebarModals.jsx";

export default function SidePanelComponent() {
    const {t} = useTranslation();
    const {isFullscreen, toggleFullscreen} = useFullscreen();
    const {
        db, setDb,
        folders, setFolders,
        notes, setNotes,
        activeNote, setActiveNote
    } = useDb();
    
    const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
    const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
    const [folderName, setFolderName] = useState("");
    const [noteName, setNoteName] = useState("");
    const [error, setError] = useState("");
    const [menuOpen, setMenuOpen] = useState(null);
    const [expandedFolders, setExpandedFolders] = useState({});
    const [currentFolderId, setCurrentFolderId] = useState(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [folderToDelete, setFolderToDelete] = useState(null);
    const [isRenameNoteModalOpen, setIsRenameNoteModalOpen] = useState(false);
    const [isDeleteNoteConfirmOpen, setIsDeleteNoteConfirmOpen] = useState(false);
    const [noteToModify, setNoteToModify] = useState(null);
    const [newNoteTitle, setNewNoteTitle] = useState("");
    const [isCollapsed, setIsCollapsed] = useState(false);
    const menuRefs = useRef({});
    const fileInputRef = useRef(null);

    const handleImportClick = (folderId) => {
        setCurrentFolderId(folderId);
        fileInputRef.current.click();
    };

    const onFileImport = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (event) => {
            const content = event.target.result;
            try {
                await handleImportFileAsync(db, currentFolderId, file.name, content, setNotes);
                alert(t("panel.importSuccess"));
            } catch (err) {
                alert(t("panel.importError"));
            }
        };
        reader.readAsText(file);
        e.target.value = ''; // Reset input
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuOpen !== null) {
                const menuElement = menuRefs.current[menuOpen];
                const buttonElement = document.querySelector(
                    `.three-dots-button[data-index="${menuOpen}"]`
                );

                if (
                    menuElement &&
                    !menuElement.contains(event.target) &&
                    buttonElement &&
                    !buttonElement.contains(event.target)
                ) {
                    setMenuOpen(null);
                }
            }

            if (noteToModify) {
                const menuElement = menuRefs.current[`note-${noteToModify.id}`];
                const buttonElement = document.querySelector(
                    `button[data-note-id="${noteToModify.id}"]`
                );

                if (
                    menuElement &&
                    !menuElement.contains(event.target) &&
                    buttonElement &&
                    !buttonElement.contains(event.target)
                ) {
                    setNoteToModify(null);
                }
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [menuOpen, noteToModify]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuOpen !== null) {
                const menuElement = menuRefs.current[menuOpen];
                const buttonElement = document.querySelector(
                    `.three-dots-button[data-index="${menuOpen}"]`
                );

                if (
                    menuElement &&
                    !menuElement.contains(event.target) &&
                    buttonElement &&
                    !buttonElement.contains(event.target)
                ) {
                    setMenuOpen(null);
                }
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [menuOpen]);

    const handleAddFolder = async () => {
        await handleAddFolderAsync(
            folderName,
            setFolderName,
            setIsFolderModalOpen,
            folders,
            setFolders,
            setError,
            db
        );
    };

    const handleDeleteFolder = async (folderId) => {
        setFolderToDelete(folderId);
        setShowDeleteConfirm(true);
        setMenuOpen(null);
    };

    const confirmDelete = async (confirmed) => {
        setShowDeleteConfirm(false);
        if (confirmed) {
            try {
                await handleDeleteFolderAsync(
                    folderToDelete,
                    setFolders,
                    notes,
                    folders,
                    true,
                    db,
                    setMenuOpen,
                    setNotes,
                    activeNote,
                    setActiveNote
                );
            } catch (e) {
                alert("Failed to delete folder");
            }
        }
        setFolderToDelete(null);
    };

    const handleRenameNote = async () => {
        if (!newNoteTitle.trim()) {
            setError("Note title cannot be empty");
            return;
        }

        try {
            await handleRenameNoteAsync(
                db,
                noteToModify.id,
                newNoteTitle.trim(),
                setNotes
            );
            setIsRenameNoteModalOpen(false);
            setNewNoteTitle("");
            setNoteToModify(null);
        } catch (e) {
            setError("Failed to rename note");
        }
    };

    const handleDeleteNote = async () => {
        if (!noteToModify) return;

        try {
            await handleDeleteNoteAsync(
                db,
                noteToModify.id,
                noteToModify.folder_id,
                setNotes,
                activeNote,
                setActiveNote
            );
            setIsDeleteNoteConfirmOpen(false);
            setNoteToModify(null);
        } catch (e) {
            setError("Failed to delete note");
        }
    };

    const toggleFolderMenu = (index, folderId) => {
        setMenuOpen(menuOpen === index ? null : index);
    };

    const toggleFolderExpansion = (folderId) => {
        if (isCollapsed) return; // Disable expanding if sidebar is collapsed
        setExpandedFolders((prev) => ({
            ...prev,
            [folderId]: !prev[folderId],
        }));
    };

    const openNoteModal = (folderId) => {
        setCurrentFolderId(folderId);
        setIsNoteModalOpen(true);
        setMenuOpen(null);
    };

    const handleNoteClick = (note) => {
        setActiveNote(note);
        setIsMobileMenuOpen(false);
    };

    const handleSaveNote = async (noteId, newContent) => {
        try {
            await handleSaveNoteAsync(db, noteId, newContent, setNotes);
        } catch (e) {
            console.error("Failed to update note:", e);
            alert("Failed to save note");
        }
    };

    const handleCloseNote = () => {
        setActiveNote(null);
    };

    const handleCreateNote = async () => {
        await handleCreateNoteAsync(
            noteName,
            currentFolderId,
            setNoteName,
            setIsNoteModalOpen,
            setError,
            setNotes,
            setExpandedFolders,
            db
        );
    };

    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
        if (!isCollapsed) {
            // Collapse all folders when sidebar collapses
            setExpandedFolders({});
        }
    };

    return (
        <div className={`${isFullscreen ? '' : 'md:ml-20'} flex h-screen bg-[var(--background)] text-[var(--on-background)] overflow-hidden`}>
            {/* Mobile Menu Button - Only shows on small screens */}
            <button
                className="md:hidden fixed top-4 left-4 z-[100] bg-(--primary) text-(--on-primary) p-2 rounded-lg shadow-lg"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label={isMobileMenuOpen ? t("panel.closeMenu") : t("panel.openMenu")}
            >
                {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            {/* Mobile Backdrop */}
            {isMobileMenuOpen && (
                <div 
                    className="md:hidden fixed inset-0 bg-black/40 z-[35] backdrop-blur-[2px] animate-fade-in"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Side Panel */}
            <div
                className={`bg-(--surface-container-low) border-r border-(--outline-variant) flex flex-col fixed h-full transition-all duration-300 ease-in-out ${isFullscreen ? 'z-0 invisible opacity-0' : 'z-40 opacity-100'}
                ${isMobileMenuOpen ? "left-0 w-[85%] sm:w-80 shadow-2xl" : "-left-full md:left-20"} ${isCollapsed ? 'md:w-16' : 'md:w-72'}`}
            >
                <div className="p-3 md:p-4 border-b border-(--outline-variant) flex justify-between items-center h-16">
                    <h2 className={`font-semibold text-(--on-surface) transition-all duration-300 ${isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100 text-lg'}`}>
                        {t("panel.folders")}
                    </h2>
                    <button 
                        onClick={toggleSidebar}
                        className="p-1.5 rounded-md hover:bg-(--surface-container-highest) text-(--on-surface-variant) transition-colors hidden md:block"
                    >
                        {isCollapsed ? <Menu size={18} /> : <ChevronLeft size={18} />}
                    </button>
                </div>

                {/* Mobile Navigation Links - Only visible on mobile */}
                <div className="md:hidden border-b border-(--outline-variant) px-3 py-2">
                    <div className="space-y-1">
                        <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-(--surface-container-high) transition-colors text-(--on-surface)">
                            <House size={18} />
                            <span className="font-medium">{t("navbar.home")}</span>
                        </Link>
                        <Link to="/settings" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-(--surface-container-high) transition-colors text-(--on-surface)">
                            <Settings size={18} />
                            <span className="font-medium">{t("navbar.settings")}</span>
                        </Link>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto overflow-x-hidden thin-scrollbar pb-20">
                    <div className="px-3 pt-4">
                        <button
                            onClick={() => setIsFolderModalOpen(true)}
                            className={`cursor-pointer flex items-center justify-center gap-2 bg-(--primary-container) text-(--on-primary-container) hover:bg-(--primary) hover:text-(--on-primary) font-medium rounded-lg transition-all duration-300 ${isCollapsed ? 'w-10 h-10 p-0 mx-auto' : 'w-full py-2.5 px-4'}`}
                            title={t("panel.addFolder")}
                        >
                            <FolderPlus size={18} />
                            <span className={`${isCollapsed ? 'hidden' : 'block truncate'}`}>
                                {t("panel.addFolder")}
                            </span>
                        </button>
                    </div>

                    <FolderList 
                        folders={folders}
                        expandedFolders={expandedFolders}
                        toggleFolderExpansion={toggleFolderExpansion}
                        menuOpen={menuOpen}
                        toggleFolderMenu={toggleFolderMenu}
                        notes={notes}
                        activeNote={activeNote}
                        handleNoteClick={handleNoteClick}
                        noteToModify={noteToModify}
                        setNoteToModify={setNoteToModify}
                        setNewNoteTitle={setNewNoteTitle}
                        setIsRenameNoteModalOpen={setIsRenameNoteModalOpen}
                        setIsDeleteNoteConfirmOpen={setIsDeleteNoteConfirmOpen}
                        menuRefs={menuRefs}
                        openNoteModal={openNoteModal}
                        handleDeleteFolder={handleDeleteFolder}
                        handleImportClick={handleImportClick}
                        isCollapsed={isCollapsed}
                    />
                </div>
            </div>

            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept=".txt,.md"
                onChange={onFileImport}
            />

            {/* Main Editor Area */}
            <div className={`flex-1 transition-all duration-300 ease-in-out bg-(--surface) ${isFullscreen ? 'z-[100] ml-0' : 'z-10 ' + (isCollapsed ? 'md:ml-16' : 'md:ml-72')} w-full overflow-hidden flex flex-col h-full absolute inset-0 md:relative md:inset-auto`}>
                <ErrorBoundary>
                    <EditorComponent
                        activeNote={activeNote}
                        onSaveNote={handleSaveNote}
                        onCloseNote={handleCloseNote}
                        isFullscreen={isFullscreen}
                        toggleFullscreen={toggleFullscreen}
                    />
                </ErrorBoundary>
            </div>

            <SidebarModals 
                isFolderModalOpen={isFolderModalOpen}
                setIsFolderModalOpen={setIsFolderModalOpen}
                folderName={folderName}
                setFolderName={setFolderName}
                handleAddFolder={handleAddFolder}
                error={error}
                setError={setError}
                showDeleteConfirm={showDeleteConfirm}
                confirmDelete={confirmDelete}
                isNoteModalOpen={isNoteModalOpen}
                setIsNoteModalOpen={setIsNoteModalOpen}
                noteName={noteName}
                setNoteName={setNoteName}
                handleCreateNote={handleCreateNote}
                isRenameNoteModalOpen={isRenameNoteModalOpen}
                setIsRenameNoteModalOpen={setIsRenameNoteModalOpen}
                newNoteTitle={newNoteTitle}
                setNewNoteTitle={setNewNoteTitle}
                handleRenameNote={handleRenameNote}
                isDeleteNoteConfirmOpen={isDeleteNoteConfirmOpen}
                setIsDeleteNoteConfirmOpen={setIsDeleteNoteConfirmOpen}
                handleDeleteNote={handleDeleteNote}
            />
        </div>
    );
}