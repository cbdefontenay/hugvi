use reqwest::Client;
use serde::{Deserialize, Serialize};
use serde_json::Value;
use std::fs::{self, File};
use std::io::Write;
use tauri::command;

#[derive(Debug, Serialize, Deserialize)]
pub struct UpdateInfo {
    pub has_update: bool,
    pub current_version: String,
    pub latest_version: String,
    pub download_url: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct DownloadResult {
    pub success: bool,
    pub file_path: String,
    pub message: String,
}

#[command]
pub async fn check_for_updates() -> Result<UpdateInfo, String> {
    let client = Client::new();
    
    let response = client
        .get("https://api.github.com/repos/cbdefontenay/hugvi/releases/latest")
        .header("User-Agent", "Hugvi-App")
        .header("Accept", "application/vnd.github.v3+json")
        .send()
        .await
        .map_err(|e| format!("Failed to check for updates: {}", e))?;

    if !response.status().is_success() {
        return Err(format!("GitHub API returned status: {}", response.status()));
    }

    let json: Value = response
        .json()
        .await
        .map_err(|e| format!("Failed to parse response: {}", e))?;

    let latest_version = json["tag_name"]
        .as_str()
        .unwrap_or("unknown")
        .to_string();

    let download_url = json["html_url"]
        .as_str()
        .unwrap_or("https://github.com/cbdefontenay/hugvi/releases")
        .to_string();

    // Current version from Cargo.toml
    let current_version = env!("CARGO_PKG_VERSION").to_string();

    // Compare versions - simple string comparison for semver-like versions
    // The GitHub tags are like "v-1.3.3" while Cargo version is "1.3.4"
    // We'll compare by stripping the "v-" prefix
    let latest_clean = latest_version.strip_prefix('v').and_then(|s| s.strip_prefix('-')).unwrap_or(&latest_version);
    let current_clean = current_version.strip_prefix('v').and_then(|s| s.strip_prefix('-')).unwrap_or(&current_version);

    let has_update = latest_clean != current_clean && latest_clean != "0.1.0";

    Ok(UpdateInfo {
        has_update,
        current_version: current_clean.to_string(),
        latest_version: latest_version.clone(),
        download_url,
    })
}

#[command]
pub async fn download_update() -> Result<DownloadResult, String> {
    let client = Client::new();
    
    // Fetch the latest release to find the AppImage asset
    let response = client
        .get("https://api.github.com/repos/cbdefontenay/hugvi/releases/latest")
        .header("User-Agent", "Hugvi-App")
        .header("Accept", "application/vnd.github.v3+json")
        .send()
        .await
        .map_err(|e| format!("Failed to fetch release info: {}", e))?;

    if !response.status().is_success() {
        return Err(format!("GitHub API returned status: {}", response.status()));
    }

    let json: Value = response
        .json()
        .await
        .map_err(|e| format!("Failed to parse response: {}", e))?;

    // Find the AppImage asset in the release
    let assets = json["assets"]
        .as_array()
        .ok_or("No assets found in release")?;

    let mut appimage_url = None;
    let mut appimage_name = None;
    
    for asset in assets {
        let name = asset["name"].as_str().unwrap_or("");
        if name.ends_with(".AppImage") {
            appimage_url = asset["browser_download_url"].as_str();
            appimage_name = Some(name.to_string());
            break;
        }
    }

    let download_url = appimage_url.ok_or("No AppImage found in release")?;
    let filename = appimage_name.unwrap_or_else(|| "Hugvi_Latest.AppImage".to_string());

    // Download to a temporary directory
    let temp_dir = std::env::temp_dir().join("hugvi_update");
    fs::create_dir_all(&temp_dir).map_err(|e| format!("Failed to create temp directory: {}", e))?;
    
    let file_path = temp_dir.join(&filename);
    
    // Download the file
    let response = client
        .get(download_url)
        .header("User-Agent", "Hugvi-App")
        .send()
        .await
        .map_err(|e| format!("Failed to start download: {}", e))?;

    if !response.status().is_success() {
        return Err(format!("Download failed with status: {}", response.status()));
    }

    let bytes = response
        .bytes()
        .await
        .map_err(|e| format!("Failed to read download: {}", e))?;

    // Write to file
    let mut file = File::create(&file_path)
        .map_err(|e| format!("Failed to create file: {}", e))?;
    
    file.write_all(&bytes)
        .map_err(|e| format!("Failed to write file: {}", e))?;

    let path_str = file_path.to_string_lossy().to_string();

    Ok(DownloadResult {
        success: true,
        file_path: path_str,
        message: format!("Downloaded {} successfully", filename),
    })
}
