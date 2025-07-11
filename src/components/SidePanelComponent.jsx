"use client";

import {useEffect, useRef, useState} from "react";
import {
    deleteFolderAsync,
    handleAddFolderAsync,
    handleCreateNoteAsync,
    loadFoldersAndNotes
} from "@/helpers/DbHelpers";
import EditorComponent from "@/components/EditorComponent";
import {invoke} from '@tauri-apps/api/core';
import {confirm} from '@tauri-apps/plugin-dialog';

export default function SidePanelComponent() {
    const [folders, setFolders] = useState([]);
    const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
    const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
    const [folderName, setFolderName] = useState("");
    const [noteName, setNoteName] = useState("");
    const [error, setError] = useState("");
    const [menuOpen, setMenuOpen] = useState(null);
    const [db, setDb] = useState(null);
    const [expandedFolders, setExpandedFolders] = useState({});
    const [notes, setNotes] = useState({});
    const [currentFolderId, setCurrentFolderId] = useState(null);
    const [activeNote, setActiveNote] = useState(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const menuRefs = useRef({});

    useEffect(() => {
        loadFoldersAndNotes(setFolders, setNotes, setDb).then(r => console.log(r));

        const handleClickOutside = (event) => {
            if (menuOpen !== null) {
                const menuElement = menuRefs.current[menuOpen];
                const buttonElement = document.querySelector(`.three-dots-button[data-index="${menuOpen}"]`);

                if (menuElement && !menuElement.contains(event.target) &&
                    buttonElement && !buttonElement.contains(event.target)) {
                    setMenuOpen(null);
                }
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
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
        const folder = folders.find(f => f.id === folderId);
        const confirmation = await confirm(
            'Are you sure you want to delete the folder?',
            { title: 'Delete folder', kind: 'warning' }
        );

        if (confirmation) {
            try {
                await db.execute("DELETE FROM folders WHERE id = $1", [folderId]);
                setFolders(folders.filter(f => f.id !== folderId));

                // Remove notes from state
                const newNotes = {...notes};
                delete newNotes[folderId];
                setNotes(newNotes);

                setMenuOpen(null);
            } catch (e) {
                console.error("Failed to delete folder:", e);
                alert("Failed to delete folder");
            }
        }
    };

    const toggleFolderMenu = (index, folderId) => {
        setMenuOpen(menuOpen === index ? null : index);
    };

    const toggleFolderExpansion = (folderId) => {
        setExpandedFolders(prev => ({
            ...prev,
            [folderId]: !prev[folderId]
        }));
    };

    const openNoteModal = (folderId) => {
        setCurrentFolderId(folderId);
        setIsNoteModalOpen(true);
        setMenuOpen(null);
    };

    const handleNoteClick = (note) => {
        setActiveNote(note);
    };

    const handleSaveNote = async (noteId, newContent) => {
        try {
            await db.execute(
                "UPDATE note SET content = $1 WHERE id = $2",
                [newContent, noteId]
            );

            // Update the notes state
            setNotes(prev => {
                const updatedNotes = {...prev};
                for (const folderId in updatedNotes) {
                    updatedNotes[folderId] = updatedNotes[folderId].map(note =>
                        note.id === noteId ? {...note, content: newContent} : note
                    );
                }
                return updatedNotes;
            });
        } catch (e) {
            console.error("Failed to update note:", e);
            alert("Failed to save note");
        }
    };

    // Add this function to handle closing the active note
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

    return (
        <div className="flex h-screen bg-[var(--background)] text-[var(--on-background)]">
            {/* Mobile Menu Button - Only shows on small screens */}
            <button
                className="md:hidden fixed top-4 left-4 z-50 bg-[var(--primary)] text-[var(--on-primary)] p-2 rounded-lg"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
                {isMobileMenuOpen ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24"
                         stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24"
                         stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/>
                    </svg>
                )}
            </button>

            {/* Side Panel - Updated with responsive classes */}
            <div className={`w-72 bg-[var(--surface-container-lowest)] border-r border-[var(--outline-variant)] flex flex-col fixed h-full overflow-hidden transition-all duration-300
                ${isMobileMenuOpen ? 'left-0' : '-left-72'} md:left-0 z-40`}>

                <div className="p-4 border-b border-[var(--outline-variant)]">
                    <h2 className="text-xl font-semibold">Folders</h2>
                </div>

                <div className="flex-1 overflow-y-auto overflow-x-hidden">
                    <button
                        onClick={() => setIsFolderModalOpen(true)}
                        className="cursor-pointer w-60 m-4 bg-[var(--primary)] text-[var(--on-primary)] font-medium px-4 py-2 rounded-lg hover:bg-[var(--primary-container)] hover:text-[var(--on-primary-container)] transition-colors"
                    >
                        Add Folder
                    </button>

                    <div className="px-2 space-y-1 relative">
                        {folders.map((folder, index) => (
                            <div key={folder.id} className="space-y-1">
                                <div
                                    className="flex flex-row items-center justify-between font-medium p-2 hover:bg-[var(--surface-container-high)] rounded-lg truncate group"
                                    title={folder.name}
                                >
                                    <div
                                        className="flex items-center flex-1 cursor-pointer"
                                        onClick={() => toggleFolderExpansion(folder.id)}
                                    >
                                        <span className="mr-2 text-[var(--on-surface-variant)]">
                                            {expandedFolders[folder.id] ? '▼' : '▶'}
                                        </span>
                                        <span className="text-[var(--on-surface)]">
                                            {folder.name}
                                        </span>
                                    </div>
                                    <button
                                        className="cursor-pointer three-dots-button opacity-0 group-hover:opacity-100 transition-opacity"
                                        data-index={index}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            toggleFolderMenu(index, folder.id);
                                        }}
                                    >
                                        <svg
                                            className="size-4 fill-[var(--on-surface-variant)] hover:fill-[var(--primary)]"
                                            viewBox="0 0 1024 1024"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                d="M388.8 896.4v-27.198c.6-2.2 1.6-4.2 2-6.4 8.8-57.2 56.4-102.4 112.199-106.2 62.4-4.4 115.2 31.199 132.4 89.199 2.2 7.6 3.8 15.6 5.8 23.4v27.2c-.6 1.8-1.6 3.399-1.8 5.399-8.6 52.8-46.6 93-98.6 104.4-4 .8-8 2-12 3h-27.2c-1.8-.6-3.6-1.6-5.4-1.8-52-8.4-91.599-45.4-103.6-96.8-1.2-5-2.6-9.6-3.8-14.2zm252.4-768.797l-.001 27.202c-.6 2.2-1.6 4.2-1.8 6.4-9 57.6-56.8 102.6-113.2 106.2-62.2 4-114.8-32-131.8-90.2-2.2-7.401-3.8-15-5.6-22.401v-27.2c.6-1.8 1.6-3.4 2-5.2 9.6-52 39.8-86 90.2-102.2 6.6-2.2 13.6-3.4 20.4-5.2h27.2c1.8.6 3.6 1.6 5.4 1.8 52.2 8.6 91.6 45.4 103.6 96.8 1.201 4.8 2.401 9.4 3.601 13.999zm-.001 370.801v27.2c-.6 2.2-1.6 4.2-2 6.4-9 57.4-58.6 103.6-114.6 106-63 2.8-116.4-35.2-131.4-93.8-1.6-6.2-3-12.4-4.4-18.6v-27.2c.6-2.2 1.6-4.2 2-6.4 8.8-57.4 58.6-103.601 114.6-106.2 63-3 116.4 35.2 131.4 93.8 1.6 6.4 3 12.6 4.4 18.8z"></path>
                                        </svg>
                                    </button>
                                </div>

                                {/* Notes list for this folder */}
                                {expandedFolders[folder.id] && notes[folder.id] && (
                                    <div className="ml-6 space-y-1 border-l-2 border-[var(--outline-variant)] pl-2">
                                        {notes[folder.id].map(note => (
                                            <div
                                                key={note.id}
                                                className={`p-2 pl-3 text-sm rounded cursor-pointer ${activeNote?.id === note.id ? 'bg-[var(--primary-container)] text-[var(--on-primary-container)]' : 'hover:bg-[var(--surface-container-high)] text-[var(--on-surface-variant)] hover:text-[var(--on-surface)]'}`}
                                                onClick={() => handleNoteClick(note)}
                                            >
                                                {note.content.split('\n')[0].replace('#', '').trim() || "Untitled Note"}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}

                        {/* Menu positioned outside the folder items */}
                        {menuOpen !== null && (
                            <div
                                ref={el => menuRefs.current[menuOpen] = el}
                                className="absolute right-4 bg-[var(--surface-container-high)] border border-[var(--outline-variant)] rounded shadow-lg z-50 text-sm p-1 space-y-1 min-w-[150px]"
                                style={{
                                    top: `calc(${menuOpen * 40}px + 56px)`,
                                }}
                            >
                                <div
                                    className="hover:bg-[var(--surface-container)] px-2 py-1.5 rounded cursor-pointer text-[var(--on-surface)]"
                                    onClick={() => openNoteModal(folders[menuOpen].id)}
                                >
                                    Create a note
                                </div>
                                <div
                                    className="hover:bg-[var(--surface-container)] px-2 py-1.5 rounded cursor-pointer text-[var(--on-surface)]">
                                    Rename folder
                                </div>
                                <div
                                    className="hover:bg-[var(--surface-container)] px-2 py-1.5 rounded cursor-pointer text-[var(--error)]"
                                    onClick={() => handleDeleteFolder(folders[menuOpen].id)}
                                >
                                    Delete folder
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex-1 ml-72 bg-[var(--surface)]">
                <EditorComponent
                    activeNote={activeNote}
                    onSaveNote={handleSaveNote}
                    onCloseNote={handleCloseNote}
                />
            </div>

            {/* Folder Creation Modal */}
            {isFolderModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div
                        className="bg-[var(--surface)] p-6 rounded-lg shadow-lg w-96 border border-[var(--outline-variant)]">
                        <h3 className="text-xl font-semibold mb-4 text-[var(--on-surface)]">Create New Folder</h3>

                        <input
                            type="text"
                            value={folderName}
                            onChange={(e) => {
                                setFolderName(e.target.value);
                                setError("");
                            }}
                            className="w-full p-2 border border-[var(--outline-variant)] rounded mb-2 bg-[var(--surface-container)] text-[var(--on-surface)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                            placeholder="Folder name"
                            autoFocus
                        />

                        {error && (
                            <p className="text-[var(--error)] text-sm mb-4">{error}</p>
                        )}

                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => {
                                    setIsFolderModalOpen(false);
                                    setError("");
                                }}
                                className="px-4 py-2 border border-[var(--outline-variant)] rounded hover:bg-[var(--surface-container-high)] text-[var(--on-surface)]"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddFolder}
                                className="px-4 py-2 bg-[var(--primary)] text-[var(--on-primary)] rounded hover:bg-[var(--primary-container)]"
                            >
                                Create
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Note Creation Modal */}
            {isNoteModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div
                        className="bg-[var(--surface)] p-6 rounded-lg shadow-lg w-96 border border-[var(--outline-variant)]">
                        <h3 className="text-xl font-semibold mb-4 text-[var(--on-surface)]">Create New Note</h3>

                        <input
                            type="text"
                            value={noteName}
                            onChange={(e) => {
                                setNoteName(e.target.value);
                                setError("");
                            }}
                            className="w-full p-2 border border-[var(--outline-variant)] rounded mb-2 bg-[var(--surface-container)] text-[var(--on-surface)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                            placeholder="Note name"
                            autoFocus
                        />

                        {error && (
                            <p className="text-[var(--error)] text-sm mb-4">{error}</p>
                        )}

                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => {
                                    setIsNoteModalOpen(false);
                                    setError("");
                                }}
                                className="px-4 py-2 border border-[var(--outline-variant)] rounded hover:bg-[var(--surface-container-high)] text-[var(--on-surface)]"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCreateNote}
                                className="px-4 py-2 bg-[var(--primary)] text-[var(--on-primary)] rounded hover:bg-[var(--primary-container)]"
                            >
                                Create
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}