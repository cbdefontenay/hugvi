import Database from "@tauri-apps/plugin-sql";

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
        const newNote = {
            content: `# ${noteName}\n\nStart writing here...`,
            folder_id: folderId
        };

        await db.execute(
            "INSERT INTO note (content, date_created, folder_id) VALUES ($1, datetime('now'), $2)",
            [newNote.content, folderId]
        );

        // Get the inserted note with its ID
        const insertedNote = await db.select(
            "SELECT id, content FROM note WHERE folder_id = $1 ORDER BY id DESC LIMIT 1",
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
                    "SELECT id, content FROM note WHERE folder_id = $1",
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