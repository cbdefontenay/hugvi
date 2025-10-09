use tauri_plugin_sql::{Migration, MigrationKind};

pub fn sqlite_migrations() -> Vec<Migration> {
    vec![
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
        Migration {
            version: 3,
            description: "add_title_to_note_table",
            sql: r#"
                ALTER TABLE note ADD COLUMN title TEXT NOT NULL DEFAULT 'Untitled Note';
                UPDATE note SET title = substr(content, 1, instr(content, char(10)) - 1);
                UPDATE note SET title = replace(title, '#', '') WHERE title LIKE '#%';
                UPDATE note SET title = trim(title);
                UPDATE note SET title = 'Untitled Note' WHERE title IS NULL OR title = '';
            "#,
            kind: MigrationKind::Up,
        },
    ]
}
