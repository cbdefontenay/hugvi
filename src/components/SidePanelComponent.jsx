"use client";

import {useEffect, useRef, useState} from "react";
import Database from "@tauri-apps/plugin-sql";
import {deleteFolderAsync, handleAddFolderAsync} from "@/helpers/DbHelpers";
import EditorComponent from "@/components/EditorComponent";

export default function SidePanelComponent() {
    const [folders, setFolders] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [folderName, setFolderName] = useState("");
    const [error, setError] = useState("");
    const [menuOpen, setMenuOpen] = useState(null);
    const [db, setDb] = useState(null);
    const menuRefs = useRef({});

    useEffect(() => {
        const initDb = async () => {
            try {
                const db = await Database.load("sqlite:folders.db");
                const result = await db.select("SELECT name FROM folders");
                if (result && Array.isArray(result)) {
                    setFolders(result.map(row => row.name));
                } else {
                    setFolders([]);
                }
                setDb(db);
            } catch (e) {
                console.error("Failed to initialize database:", e);
            }
        };

        initDb();

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
            setIsModalOpen,
            folders,
            setFolders,
            setError,
            db
        );
    };

    const handleDeleteFolder = async (folderName) => {
        if (confirm(`Are you sure you want to delete "${folderName}"?`)) {
            const success = await deleteFolderAsync(
                folderName,
                folders,
                setFolders,
                db
            );
            if (!success) {
                alert("Failed to delete folder");
            }
            setMenuOpen(null);
        }
    };

    const toggleFolderMenu = (index) => {
        setMenuOpen(menuOpen === index ? null : index);
    };

    return (
        <div className="flex h-screen">
            {/* Side Panel */}
            <div
                className="w-64 bg-[var(--surface-variant)] text-[var(--on-surface-variant)] border-r border-gray-200 flex flex-col fixed h-full overflow-hidden">
                <div className="p-4 border-b border-gray-200">
                    <h2 className="text-xl font-semibold">Folders</h2>
                </div>

                <div className="flex-1 overflow-y-auto overflow-x-hidden p-4">
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="cursor-pointer w-full mb-4 bg-[var(--secondary)] text-white px-4 py-2 rounded hover:bg-[var(--primary)] transition-colors"
                    >
                        Add Folder
                    </button>

                    <div className="space-y-2 relative">
                        {folders.map((folder, index) => (
                            <div
                                key={index}
                                className="flex flex-row items-center justify-between p-3 bg-[var(--background)] rounded-lg shadow-sm hover:bg-gray-100 truncate"
                                title={folder}
                            >
                                {folder}
                                <button
                                    className="cursor-pointer three-dots-button"
                                    data-index={index}
                                    onClick={() => toggleFolderMenu(index)}
                                >
                                    <svg fill="fill-current" className="size-3 gap-14" viewBox="0 0 1024 1024"
                                         xmlns="http://www.w3.org/2000/svg">
                                        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                                        <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                                        <g id="SVGRepo_iconCarrier">
                                            <path
                                                d="M388.8 896.4v-27.198c.6-2.2 1.6-4.2 2-6.4 8.8-57.2 56.4-102.4 112.199-106.2 62.4-4.4 115.2 31.199 132.4 89.199 2.2 7.6 3.8 15.6 5.8 23.4v27.2c-.6 1.8-1.6 3.399-1.8 5.399-8.6 52.8-46.6 93-98.6 104.4-4 .8-8 2-12 3h-27.2c-1.8-.6-3.6-1.6-5.4-1.8-52-8.4-91.599-45.4-103.6-96.8-1.2-5-2.6-9.6-3.8-14.2zm252.4-768.797l-.001 27.202c-.6 2.2-1.6 4.2-1.8 6.4-9 57.6-56.8 102.6-113.2 106.2-62.2 4-114.8-32-131.8-90.2-2.2-7.401-3.8-15-5.6-22.401v-27.2c.6-1.8 1.6-3.4 2-5.2 9.6-52 39.8-86 90.2-102.2 6.6-2.2 13.6-3.4 20.4-5.2h27.2c1.8.6 3.6 1.6 5.4 1.8 52.2 8.6 91.6 45.4 103.6 96.8 1.201 4.8 2.401 9.4 3.601 13.999zm-.001 370.801v27.2c-.6 2.2-1.6 4.2-2 6.4-9 57.4-58.6 103.6-114.6 106-63 2.8-116.4-35.2-131.4-93.8-1.6-6.2-3-12.4-4.4-18.6v-27.2c.6-2.2 1.6-4.2 2-6.4 8.8-57.4 58.6-103.601 114.6-106.2 63-3 116.4 35.2 131.4 93.8 1.6 6.4 3 12.6 4.4 18.8z"></path>
                                        </g>
                                    </svg>
                                </button>
                            </div>
                        ))}

                        {/* Menu positioned outside the folder items */}
                        {menuOpen !== null && (
                            <div
                                ref={el => {
                                    return menuRefs.current[menuOpen] = el;
                                }}
                                className="absolute right-4 bg-white border rounded shadow-lg z-50 text-sm p-2 space-y-1 min-w-[150px]"
                                style={{
                                    top: `calc(${menuOpen * 56}px + 56px)`, // 56px per item + header height
                                }}
                            >
                                <div className="hover:bg-gray-100 px-2 py-1 cursor-pointer">Create a note</div>
                                <div className="hover:bg-gray-100 px-2 py-1 cursor-pointer">Rename folder</div>
                                <div
                                    className="hover:bg-gray-100 px-2 py-1 cursor-pointer text-[var(--error)]"
                                    onClick={() => handleDeleteFolder(folders[menuOpen])}
                                >
                                    Delete folder
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex-1 ml-64">
                <EditorComponent/>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h3 className="text-xl font-semibold mb-4">Create New Folder</h3>

                        <input
                            type="text"
                            value={folderName}
                            onChange={(e) => {
                                setFolderName(e.target.value);
                                setError("");
                            }}
                            className="w-full p-2 border rounded mb-2"
                            placeholder="Folder name"
                            autoFocus
                        />

                        {error && (
                            <p className="text-red-500 text-sm mb-4">{error}</p>
                        )}

                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => {
                                    setIsModalOpen(false);
                                    setError("");
                                }}
                                className="px-4 py-2 border rounded hover:bg-gray-100"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddFolder}
                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
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