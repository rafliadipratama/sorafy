// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use sorafy_lib::application::commands;
use sorafy_lib::application::AppState;
use sorafy_lib::domain::model::{Lyrics, Track};
use sorafy_lib::build_app_state;
use std::sync::Arc;

struct AppStateWrapper(Arc<AppState>);

#[tauri::command]
async fn resolve_full_stream(
    state: tauri::State<'_, AppStateWrapper>,
    data: Option<commands::ResolveStreamRequest>,
    title: Option<String>,
    artist: Option<String>,
    video_id: Option<String>,
    is_video: Option<bool>,
) -> Result<commands::ResolvedStreamPayload, String> {
    let req = if let Some(d) = data {
        d
    } else {
        commands::ResolveStreamRequest {
            title,
            artist,
            video_id,
            is_video: is_video.unwrap_or(false),
        }
    };
    let res = commands::resolve_full_stream(&state.0, req).await;
    if res.success {
        res.data.ok_or_else(|| "Failed to resolve stream".to_string())
    } else {
        Err(res.error.unwrap_or_else(|| "Stream resolution error".to_string()))
    }
}

#[tauri::command]
async fn search_tracks(
    state: tauri::State<'_, AppStateWrapper>,
    query: String,
    filter_type: Option<String>,
) -> Result<Vec<Track>, String> {
    let res = commands::search_tracks(&state.0, query, filter_type).await;
    if res.success {
        Ok(res.data.unwrap_or_default())
    } else {
        Err(res.error.unwrap_or_else(|| "Search error".to_string()))
    }
}

#[tauri::command]
async fn fetch_lyrics(
    state: tauri::State<'_, AppStateWrapper>,
    video_id: Option<String>,
    title: Option<String>,
    artist: Option<String>,
    duration: Option<u64>,
) -> Result<Option<Lyrics>, String> {
    let req = commands::FetchLyricsRequest {
        video_id,
        title,
        artist,
        duration,
    };
    let res = commands::fetch_lyrics(&state.0, req).await;
    if res.success {
        Ok(res.data.flatten())
    } else {
        Err(res.error.unwrap_or_else(|| "Lyrics error".to_string()))
    }
}

#[tauri::command]
async fn get_app_settings(
    state: tauri::State<'_, AppStateWrapper>,
) -> Result<serde_json::Value, String> {
    let res = commands::get_app_settings(&state.0).await;
    if res.success {
        Ok(res.data.unwrap_or_else(|| serde_json::json!({})))
    } else {
        Err(res.error.unwrap_or_else(|| "Failed to get settings".to_string()))
    }
}

#[tauri::command]
async fn save_app_settings(
    state: tauri::State<'_, AppStateWrapper>,
    settings: serde_json::Value,
) -> Result<bool, String> {
    let res = commands::save_app_settings(&state.0, settings).await;
    if res.success {
        Ok(res.data.unwrap_or(true))
    } else {
        Err(res.error.unwrap_or_else(|| "Failed to save settings".to_string()))
    }
}

#[tauri::command]
async fn get_system_info(
    state: tauri::State<'_, AppStateWrapper>,
) -> Result<commands::SystemInfo, String> {
    let res = commands::get_system_info(&state.0).await;
    if res.success {
        Ok(res.data.unwrap_or_else(|| commands::SystemInfo {
            os: std::env::consts::OS.to_string(),
            arch: std::env::consts::ARCH.to_string(),
            runtime: "tauri".to_string(),
            version: "1.0.0".to_string(),
        }))
    } else {
        Err(res.error.unwrap_or_else(|| "Failed to get system info".to_string()))
    }
}

fn main() {
    let rt = tokio::runtime::Runtime::new().expect("failed to initialize Tokio runtime");
    let _guard = rt.enter();

    println!("==================================================");
    println!("  SoraFy Desktop (Tauri v2 + Rust Architecture)");
    println!("  High-Fidelity Music Streaming for Linux & Windows");
    println!("  Palette: Obsidian Void, Priangan Emerald & Electric Lime");
    println!("==================================================");

    let state = Arc::new(build_app_state());

    tauri::Builder::default()
        .manage(AppStateWrapper(state))
        .invoke_handler(tauri::generate_handler![
            resolve_full_stream,
            search_tracks,
            fetch_lyrics,
            get_app_settings,
            save_app_settings,
            get_system_info
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
