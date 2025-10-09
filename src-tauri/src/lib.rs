mod db;
mod file_export;

use crate::db::sqlite_migrations;
use crate::file_export::export_note;
use tauri_plugin_sql::Builder;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(
            Builder::default()
                .add_migrations("sqlite:app.db", sqlite_migrations())
                .build(),
        )
        .invoke_handler(tauri::generate_handler![export_note])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
