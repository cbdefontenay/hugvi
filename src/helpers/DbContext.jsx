import React, {createContext, useContext, useState, useEffect, useCallback} from 'react';
import Database from "@tauri-apps/plugin-sql";

const DbContext = createContext();

const DB_NAME = "sqlite:app.db";

export function DbProvider({children}) {
    const [folders, setFolders] = useState([]);
    const [notes, setNotes] = useState({});
    const [db, setDb] = useState(null);
    const [activeNote, setActiveNote] = useState(null);
    const [loading, setLoading] = useState(true);
    const [dbError, setDbError] = useState(null);

    const loadData = useCallback(async (database) => {
        const dbInstance = database || db;
        if (!dbInstance) return;
        try {
            const folderResult = await dbInstance.select(
                "SELECT id, name FROM folders ORDER BY date_created ASC"
            );
            const safefolders = Array.isArray(folderResult) ? folderResult : [];
            setFolders(safefolders);

            const notesMap = {};
            for (const folder of safefolders) {
                const noteResult = await dbInstance.select(
                    "SELECT id, title, content, folder_id FROM note WHERE folder_id = $1 ORDER BY date_created ASC",
                    [folder.id]
                );
                notesMap[folder.id] = noteResult || [];
            }
            setNotes(notesMap);
        } catch (e) {
            console.error("Failed to load data:", e);
            setDbError(e.message || "DB load error");
        }
    }, [db]);

    useEffect(() => {
        let mounted = true;
        const init = async () => {
            try {
                const database = await Database.load(DB_NAME);
                if (!mounted) return;
                setDb(database);
                await loadData(database);
            } catch (e) {
                console.error("Failed to initialize database:", e);
                if (mounted) {
                    setDbError(e.message || "Failed to connect to database");
                    setLoading(false); // Ensure we stop loading state
                }
            } finally {
                if (mounted) setLoading(false);
            }
        };
        init();
        return () => { mounted = false; };
    }, []);

    const refreshData = useCallback(async () => {
        await loadData(db);
    }, [db, loadData]);

    return (
        <DbContext.Provider value={{
            db, setDb,
            folders, setFolders,
            notes, setNotes,
            activeNote, setActiveNote,
            refreshData,
            loading,
            dbError
        }}>
            {children}
        </DbContext.Provider>
    );
}

export function useDb() {
    return useContext(DbContext);
}
