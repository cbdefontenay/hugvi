"use client";

import { useEffect, useState } from "react";
import Database from "@tauri-apps/plugin-sql";
import EditorComponent from "@/components/EditorComponent";

export default function SidePanelComponent() {
    const [folders, setFolders] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [folderName, setFolderName] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    const [db, setDb] = useState(null);

    useEffect(() => {
        const initDb = async () => {
            try {
                const database = await Database.load("sqlite:folders.db");
                await database.execute(`
                    CREATE TABLE IF NOT EXISTS folders (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        name TEXT UNIQUE
                    );
                `);

                const result = await database.select("SELECT name FROM folders");
                setFolders(result.map((row) => row.name));
                setDb(database);
            } catch (e) {
                console.error("Failed to initialize database:", e);
            } finally {
                setLoading(false);
            }
        };

        initDb();
    }, []);

    const handleAddFolder = async () => {
        const name = folderName.trim();
        if (!name) {
            setError("Folder name cannot be empty");
            return;
        }

        try {
            const result = await db.select("SELECT name FROM folders WHERE name = $1", [name]);

            if (result.length > 0) {
                setError("A folder with this name already exists");
                return;
            }

            await db.execute("INSERT INTO folders (name) VALUES ($1)", [name]);
            setFolders(prev => [...prev, name]);
            setFolderName("");
            setError("");
            setIsModalOpen(false);
        } catch (e) {
            console.error("Failed to insert folder:", e);
            setError("Database error: could not add folder");
        }
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

                    <div className="space-y-2">
                        {loading ? (
                            <div className="text-sm text-gray-500">Loading folders...</div>
                        ) : folders.length > 0 ? (
                            folders.map((folder, index) => (
                                <div
                                    key={index}
                                    className="cursor-pointer p-3 bg-[var(--background)] rounded-lg shadow-sm hover:bg-gray-100 truncate"
                                    title={folder}
                                >
                                    {folder}
                                </div>
                            ))
                        ) : (
                            <div className="text-sm text-gray-500">No folders yet</div>
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
