use std::fs::write;
use tauri::async_runtime::spawn_blocking;
use tauri::{command, AppHandle};
use tauri_plugin_dialog::DialogExt;

#[command]
pub async fn export_note(
    app: AppHandle,
    content: String,
    format: String, // "txt" or "md"
) -> Result<(), String> {
    let filter_name = match format.as_str() {
        "md" => "Markdown File",
        "txt" => "Text File",
        _ => "Text File",
    };

    let extensions = match format.as_str() {
        "md" => &["md"],
        "txt" => &["txt"],
        _ => &["txt"],
    };

    let result = spawn_blocking(move || {
        app.dialog()
            .file()
            .add_filter(filter_name, extensions)
            .blocking_save_file()
    })
    .await
    .map_err(|e| format!("Failed to spawn blocking task: {}", e))?;

    match result {
        Some(file_path) => {
            let path_string = file_path.to_string();
            write(&path_string, content).map_err(|e| format!("Failed to write file: {}", e))?;
            Ok(())
        }
        None => Err(String::from("No file selected")),
    }
}