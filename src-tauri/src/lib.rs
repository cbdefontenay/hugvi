mod db;
mod helpers;

use tauri::generate_handler;
use helpers::delete_folder_dialog;
use crate::db::sqlite_migrations;
use tauri_plugin_sql::{Builder, Migration, MigrationKind};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(
            Builder::default()
                .add_migrations("sqlite:app.db", sqlite_migrations())
                .build(),
        )
        .invoke_handler(generate_handler![delete_folder_dialog])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
