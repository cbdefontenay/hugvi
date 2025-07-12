import Database from "@tauri-apps/plugin-sql";
import {confirm} from "@tauri-apps/plugin-dialog";

export const handleAddFolderAsync = async (folderName, setFolderName, setIsModalOpen, folders, setFolders, setError, db) => {
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

        await db.execute("INSERT INTO folders (name, date_created) VALUES ($1, datetime('now'))", [name]);
        const newFolder = await db.select("SELECT id, name FROM folders WHERE name = $1", [name]);

        setFolders([...folders, newFolder[0]]);
        setFolderName("");
        setError("");
        setIsModalOpen(false);
    } catch (e) {
        console.error("Failed to insert folder:", e);
        setError("Database error: could not add folder");
    }
};

export const deleteFolderAsync = async (folderId, folders, setFolders, db) => {
    try {
        await db.execute("DELETE FROM folders WHERE id = $1", [folderId]);
        setFolders(folders.filter(folder => folder.id !== folderId));
        return true;
    } catch (e) {
        console.error("Failed to delete folder:", e);
        return false;
    }
};

export const handleCreateNoteAsync = async (noteName, folderId, setNoteName, setIsModalOpen, setError, setNotes, setExpandedFolders, db) => {
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

        // Get the inserted note with its ID
        const insertedNote = await db.select(
            "SELECT id, title, content FROM note WHERE folder_id = $1 ORDER BY id DESC LIMIT 1",
            [folderId]
        );

        if (insertedNote && insertedNote[0]) {
            setNotes(prev => ({
                ...prev,
                [folderId]: [...(prev[folderId] || []), insertedNote[0]]
            }));

            setExpandedFolders(prev => ({
                ...prev,
                [folderId]: true
            }));
        }

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

        // Load folders
        const folderResult = await db.select("SELECT id, name FROM folders");
        if (folderResult && Array.isArray(folderResult)) {
            setFolders(folderResult);

            // Load notes for each folder
            const notesMap = {};
            for (const folder of folderResult) {
                const noteResult = await db.select(
                    "SELECT id, title, content FROM note WHERE folder_id = $1",
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
        await db.execute(
            "UPDATE note SET content = $1 WHERE id = $2",
            [newContent, noteId]
        );

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
        throw new Error("Failed to save note");
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
        // Delete all notes in the folder first
        await db.execute("DELETE FROM note WHERE folder_id = $1", [folderId]);

        // Then delete the folder
        await db.execute("DELETE FROM folders WHERE id = $1", [folderId]);

        // Update state
        setFolders(folders.filter(f => f.id !== folderId));

        // Remove notes from state
        const newNotes = {...notes};
        delete newNotes[folderId];
        setNotes(newNotes);

        // Clear active note if it was in this folder
        if (activeNote && newNotes[folderId]?.some(note => note.id === activeNote.id)) {
            setActiveNote(null);
        }

        setMenuOpen(null);
    } catch (e) {
        console.error("Failed to delete folder:", e);
        throw new Error("Failed to delete folder");
    }
};