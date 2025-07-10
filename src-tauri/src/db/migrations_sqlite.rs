use tauri_plugin_sql::{Migration, MigrationKind};

pub fn sqlite_migrations() -> Vec<Migration> {
    let migrations = vec![
        Migration {
            version: 1,
            description: "create_folders_table",
            sql: r#"
                CREATE TABLE IF NOT EXISTS folders (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT UNIQUE,
                    date_created DATETIME NOT NULL,
                    parent_id INTEGER,
                    FOREIGN KEY(parent_id) REFERENCES folders(id) ON DELETE CASCADE
                );
            "#,
            kind: MigrationKind::Up,
        },
        Migration {
            version: 2,
            description: "create_note_table",
            sql: r#"
                CREATE TABLE IF NOT EXISTS note (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    content TEXT NOT NULL,
                    date_created DATETIME NOT NULL,
                    folder_id INTEGER NOT NULL,
                    FOREIGN KEY(folder_id) REFERENCES folders(id) ON DELETE CASCADE
                );
            "#,
            kind: MigrationKind::Up,
        },
    ];

    migrations
}
