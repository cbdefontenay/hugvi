import Database from "@tauri-apps/plugin-sql";

export const handleAddFolderAsync = async (
    folderName,
    setFolderName,
    setIsModalOpen,
    folders,
    setFolders,
    setError,
    db
) => {
    const name = folderName.trim();
    if (!name) {
        setError("Folder name cannot be empty");
        return;
    }

    try {
        const result = await db.select("SELECT name FROM folders WHERE name = $1", [
            name,
        ]);
        if (result.length > 0) {
            setError("A folder with this name already exists");
            return;
        }

        console.log("Inserting folder...");
        await db.execute(
            "INSERT INTO folders (name, date_created) VALUES ($1, datetime('now'))",
            [name]
        );

        console.log("Fetching new folder...");
        const newFolder = await db.select(
            "SELECT id, name FROM folders WHERE name = $1",
            [name]
        );
        console.log("New folder:", newFolder);

        setFolders([...folders, newFolder[0]]);
        setFolderName("");
        setError("");
        setIsModalOpen(false);
        console.log("Folder created successfully");
    } catch (e) {
        console.error("Failed to insert folder:", e);
        setError("Database error: could not add folder");
    }
};

export const handleDeleteFolderAsync = async (
    folderId,
    setFolders,
    notes,
    folders,
    confirmation,
    db,
    setMenuOpen,
    setNotes,
    activeNote,
    setActiveNote
) => {
    if (!confirmation) return;

    try {
        await db.execute("DELETE FROM note WHERE folder_id = $1", [folderId]);

        await db.execute("DELETE FROM folders WHERE id = $1", [folderId]);
        setFolders(folders.filter((f) => f.id !== folderId));

        const newNotes = {...notes};
        delete newNotes[folderId];
        setNotes(newNotes);

        if (
            activeNote &&
            newNotes[folderId]?.some((note) => note.id === activeNote.id)
        ) {
            setActiveNote(null);
        }

        setMenuOpen(null);

        await maybeVacuum(db, 'folders');
    } catch (e) {
        console.error("Failed to delete folder:", e);
        throw new Error("Failed to delete folder");
    }
};

export const deleteFolderAsync = async (folderId, folders, setFolders, db) => {
    try {
        await db.execute("DELETE FROM folders WHERE id = $1", [folderId]);
        setFolders(folders.filter((folder) => folder.id !== folderId));
        return true;
    } catch (e) {
        console.error("Failed to delete folder:", e);
        return false;
    }
};

export const handleCreateNoteAsync = async (
    noteName,
    folderId,
    setNoteName,
    setIsModalOpen,
    setError,
    setNotes,
    setExpandedFolders,
    db
) => {
    if (!noteName.trim()) {
        setError("Note name cannot be empty");
        return;
    }

    try {
        const title = noteName.trim();
        const content = `# ${title}\n\nStart writing here...`;

        await db.execute(
            "INSERT INTO note (title, content, date_created, folder_id) VALUES ($1, $2, datetime('now'), $3)",
            [title, content, folderId]
        );

        const updatedNotes = await db.select(
            "SELECT id, title, content, folder_id FROM note WHERE folder_id = $1 ORDER BY date_created ASC",
            [folderId]
        );

        setNotes((prev) => {
            const newNotes = {...prev};
            newNotes[folderId] = updatedNotes;
            return newNotes;
        });

        setExpandedFolders((prev) => ({
            ...prev,
            [folderId]: true,
        }));

        setNoteName("");
        setError("");
        setIsModalOpen(false);
    } catch (e) {
        console.error("Failed to create note:", e);
        setError("Failed to create note");
    }
};

export const loadFoldersAndNotes = async (setFolders, setNotes, setDb) => {
    try {
        const db = await Database.load("sqlite:app.db");

        const folderResult = await db.select(
            "SELECT id, name FROM folders ORDER BY date_created ASC"
        );

        if (folderResult && Array.isArray(folderResult)) {
            setFolders(folderResult);

            const notesMap = {};
            for (const folder of folderResult) {
                const noteResult = await db.select(
                    "SELECT id, title, content, folder_id FROM note WHERE folder_id = $1 ORDER BY date_created ASC",
                    [folder.id]
                );
                notesMap[folder.id] = noteResult || [];
            }
            setNotes(notesMap);
        } else {
            setFolders([]);
            setNotes({});
        }
        setDb(db);
        return db;
    } catch (e) {
        console.error("Failed to initialize database:", e);
        return null;
    }
};

export const handleSaveNoteAsync = async (db, noteId, newContent, setNotes) => {
    try {
        await db.execute("UPDATE note SET content = $1 WHERE id = $2", [
            newContent,
            noteId,
        ]);

        setNotes((prev) => {
            const updatedNotes = {...prev};
            for (const folderId in updatedNotes) {
                updatedNotes[folderId] = updatedNotes[folderId].map((note) =>
                    note.id === noteId ? {...note, content: newContent} : note
                );
            }
            return updatedNotes;
        });
    } catch (e) {
        console.error("Failed to update note:", e);
        throw new Error("Failed to save note");
    }
};

export const handleRenameNoteAsync = async (db, noteId, newTitle, setNotes) => {
    try {
        await db.execute("UPDATE note SET title = $1 WHERE id = $2", [
            newTitle,
            noteId,
        ]);

        setNotes((prev) => {
            const updatedNotes = {...prev};
            for (const folderId in updatedNotes) {
                const noteIndex = updatedNotes[folderId].findIndex(n => n.id === noteId);
                if (noteIndex !== -1) {
                    updatedNotes[folderId][noteIndex] = {
                        ...updatedNotes[folderId][noteIndex],
                        title: newTitle
                    };
                    break;
                }
            }
            return updatedNotes;
        });
    } catch (e) {
        console.error("Failed to rename note:", e);
        throw new Error("Failed to rename note");
    }
};

export const handleDeleteNoteAsync = async (
    db,
    noteId,
    folderId,
    setNotes,
    activeNote,
    setActiveNote
) => {
    try {
        await db.execute("DELETE FROM note WHERE id = $1", [noteId]);

        setNotes((prev) => {
            const updatedNotes = {...prev};
            if (updatedNotes[folderId]) {
                updatedNotes[folderId] = updatedNotes[folderId].filter(
                    (note) => note.id !== noteId
                );
            }
            return updatedNotes;
        });

        if (activeNote && activeNote.id === noteId) {
            setActiveNote(null);
        }

        await maybeVacuum(db, 'notes');
    } catch (e) {
        console.error("Failed to delete note:", e);
        throw new Error("Failed to delete note");
    }
};

// Vaccum needed sometimes:
let deleteCounters = {
    notes: 0,
    folders: 0
};

const VACUUM_THRESHOLDS = {
    NOTES: 10,
    FOLDERS: 4
};

export const maybeVacuum = async (db, type) => {
    deleteCounters[type]++;

    if (deleteCounters.notes >= VACUUM_THRESHOLDS.NOTES ||
        deleteCounters.folders >= VACUUM_THRESHOLDS.FOLDERS) {
        try {
            console.log("Running VACUUM due to threshold reached");
            await db.execute("VACUUM");
            console.log("VACUUM completed successfully");

            // Reset counters after vacuum
            deleteCounters = {
                notes: 0,
                folders: 0
            };
        } catch (e) {
            console.error("Failed to execute VACUUM:", e);
        }
    }
};