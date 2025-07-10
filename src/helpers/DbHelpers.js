export const handleAddFolderAsync = async (folderName, setFolderName, setIsModalOpen, folders, setFolders, setError, db) => {
    const name = folderName.trim();
    if (!name) {
        setError("Folder name cannot be empty");
        return;
    }

    try {
        const result = await db.select("SELECT name FROM folders WHERE name = $1", [name]);
        console.log("DB select result:", result);

        if (result.length > 0) {
            setError("A folder with this name already exists");
            return;
        }

        await db.execute("INSERT INTO folders (name) VALUES ($1)", [name]);
        setFolders([...folders, name]);
        setFolderName("");
        setError("");
        setIsModalOpen(false);
    } catch (e) {
        console.error("Failed to insert folder:", e);
        setError("Database error: could not add folder");
    }
};

export const deleteFolderAsync = async (folderName, folders, setFolders, db) => {
    try {
        await db.execute("DELETE FROM folders WHERE name = $1", [folderName]);
        setFolders(folders.filter(folder => folder !== folderName));
        return true;
    } catch (e) {
        console.error("Failed to delete folder:", e);
        return false;
    }
};