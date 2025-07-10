mod db;

use tauri_plugin_sql::{Builder, Migration, MigrationKind};
use crate::db::sqlite_migrations;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(
            Builder::default()
                .add_migrations("sqlite:app.db", sqlite_migrations())
                .build(),
        )
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
