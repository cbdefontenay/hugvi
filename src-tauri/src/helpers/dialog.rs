use std::fmt::format;
use tauri::{Builder, Wry};
use tauri_plugin_dialog::{Dialog, DialogExt};

#[tauri::command]
pub async fn delete_folder_dialog() {
    let _ = Builder::default().setup(|app| {
        app.dialog()
            .message("Are you sure you want to delete the folder?")
            .show(|_| {
                println!("Close");
            });
        Ok(())
    });
}
