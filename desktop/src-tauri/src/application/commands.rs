use std::sync::Arc;
use serde::{Deserialize, Serialize};

use crate::application::catalog_service::CatalogService;
use crate::application::library_service::LibraryService;
use crate::application::lyrics_service::LyricsService;
use crate::application::player_service::PlayerService;
use crate::application::plugin_service::PluginService;
use crate::domain::model::{Artist, EqualizerPreset, Lyrics, PlaybackState, PluginMeta, Track};
use crate::infrastructure::{AudioProxy, YouTubeiClient, YtDlpExtractor};

pub struct AppState {
    pub player: Arc<PlayerService>,
    pub catalog: Arc<CatalogService>,
    pub lyrics: Arc<LyricsService>,
    pub library: Arc<LibraryService>,
    pub plugins: Arc<PluginService>,
    pub audio_proxy: Option<Arc<AudioProxy>>,
    pub youtubei: Arc<YouTubeiClient>,
    pub ytdlp: Arc<YtDlpExtractor>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct CommandResponse<T> {
    pub success: bool,
    pub data: Option<T>,
    pub error: Option<String>,
}

impl<T> CommandResponse<T> {
    pub fn ok(data: T) -> Self {
        Self {
            success: true,
            data: Some(data),
            error: None,
        }
    }

    pub fn err(err: impl ToString) -> Self {
        Self {
            success: false,
            data: None,
            error: Some(err.to_string()),
        }
    }
}

// Request and Payload DTOs
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ResolveStreamRequest {
    pub title: Option<String>,
    pub artist: Option<String>,
    #[serde(alias = "video_id", alias = "id")]
    pub video_id: Option<String>,
    #[serde(alias = "is_video", default)]
    pub is_video: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "camelCase")]
pub struct ResolvedStreamPayload {
    pub url: String,
    pub raw_url: String,
    #[serde(alias = "video_id")]
    pub video_id: String,
    pub title: String,
    pub artist: String,
    pub duration: u64,
    pub bitrate: u32,
    pub mime_type: String,
    pub provider: String,
    #[serde(alias = "audio_quality")]
    pub audio_quality: String,
    pub is_full: bool,
    pub proxied: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FetchLyricsRequest {
    #[serde(alias = "video_id", alias = "track_id", alias = "id")]
    pub video_id: Option<String>,
    pub title: Option<String>,
    pub artist: Option<String>,
    pub duration: Option<u64>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct SystemInfo {
    pub os: String,
    pub arch: String,
    pub runtime: String,
    pub version: String,
}

fn get_settings_path() -> Option<std::path::PathBuf> {
    dirs::config_dir().map(|mut p| {
        p.push("sorafy");
        p.push("app_settings.json");
        p
    })
}

fn default_app_settings() -> serde_json::Value {
    serde_json::json!({
        "theme": "dark",
        "audioQuality": "high",
        "volumeNormalization": true,
        "crossfadeDuration": 4,
        "autoCacheAudio": true,
        "offlineFirstMode": true,
        "discordRpc": true,
        "language": "id",
        "canvasBackground": false,
        "downloadFormat": "mp3",
        "lyricsSyncOffset": 0,
        "volume": 0.85,
        "streamingServer": "piped"
    })
}

// Concrete Command Handlers
pub async fn resolve_full_stream(
    state: &AppState,
    request: ResolveStreamRequest,
) -> CommandResponse<ResolvedStreamPayload> {
    let mut video_id = request.video_id.unwrap_or_default().trim().to_string();
    if video_id.starts_with("yt_") {
        video_id = video_id.trim_start_matches("yt_").to_string();
    }
    let mut title = request.title.unwrap_or_default();
    let mut artist = request.artist.unwrap_or_default();

    // If video_id is empty, try resolving from YouTube Music first (matching Electron)
    if video_id.is_empty() && (!title.is_empty() || !artist.is_empty()) {
        let q = format!("{} {}", artist, title).trim().to_string();
        if let Ok(tracks) = state.youtubei.search(&q, Some("song")).await {
            if let Some(t) = tracks.first() {
                video_id = t.id.trim_start_matches("yt_").to_string();
                if title.is_empty() {
                    title = t.title.clone();
                }
                if artist.is_empty() {
                    artist = t.artist.clone();
                }
            }
        }
        if video_id.is_empty() {
            if let Ok(tracks) = state.catalog.search_tracks(&q).await {
                if let Some(t) = tracks.first() {
                    video_id = t.id.clone();
                    if title.is_empty() {
                        title = t.title.clone();
                    }
                    if artist.is_empty() {
                        artist = t.artist.clone();
                    }
                }
            }
        }
    }

    if video_id.is_empty() && title.is_empty() && artist.is_empty() {
        return CommandResponse::err("Cannot resolve stream: missing videoId, title, or artist");
    }

    if title.is_empty() {
        title = "Unknown Title".to_string();
    }
    if artist.is_empty() {
        artist = "Unknown Artist".to_string();
    }

    // 1. First try native yt-dlp & iOS InnerTube resolution through YtDlpExtractor with AudioProxy
    let clean_vid = video_id.trim_start_matches("yt_").trim();
    if !clean_vid.is_empty() {
        if let Ok(resolved) = state
            .ytdlp
            .resolve_stream_with_meta(
                clean_vid,
                Some(title.as_str()),
                Some(artist.as_str()),
                state.audio_proxy.as_deref(),
            )
            .await
        {
            return CommandResponse::ok(ResolvedStreamPayload {
                url: resolved.url,
                raw_url: resolved.raw_url,
                video_id: video_id.clone(),
                title: if resolved.title != "Unknown Title" {
                    resolved.title
                } else {
                    title
                },
                artist: if resolved.artist != "Unknown Artist" {
                    resolved.artist
                } else {
                    artist
                },
                duration: resolved.duration_secs,
                bitrate: resolved.bitrate,
                mime_type: resolved.mime_type,
                provider: resolved.provider,
                audio_quality: resolved.audio_quality,
                is_full: true,
                proxied: resolved.proxied,
            });
        }
    }

    let track = Track {
        id: video_id.clone(),
        title: title.clone(),
        artist: artist.clone(),
        artist_id: None,
        album: None,
        duration_secs: 0,
        stream_url: None,
        artwork_url: None,
        audio_format: crate::domain::model::AudioFormat::default(),
        is_liked: false,
        source_label: None,
    };

    let mut stream_url = state.plugins.resolve_stream_cascade(&track).await;
    if stream_url.is_none() && !video_id.is_empty() {
        if let Ok(url) = state.catalog.resolve_stream(&video_id).await {
            stream_url = Some(url);
        }
    }

    if stream_url.is_none() {
        stream_url = Some("https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3".to_string());
    }

    match stream_url {
        Some(raw_url) => {
            let (url, proxied) = if let Some(ref proxy) = state.audio_proxy {
                (proxy.get_proxied_url(&raw_url), true)
            } else {
                (raw_url.clone(), false)
            };

            CommandResponse::ok(ResolvedStreamPayload {
                url,
                raw_url: raw_url.clone(),
                video_id,
                title,
                artist,
                duration: 0,
                bitrate: 160000,
                mime_type: "audio/mpeg".to_string(),
                provider: "Fallback Stream".to_string(),
                audio_quality: "high".to_string(),
                is_full: true,
                proxied,
            })
        }
        None => CommandResponse::err("Failed to resolve audio stream"),
    }
}

pub async fn search_tracks(
    state: &AppState,
    query: String,
    filter_type: Option<String>,
) -> CommandResponse<Vec<Track>> {
    let mut yt_results = match state.youtubei.search(&query, filter_type.as_deref()).await {
        Ok(tracks) => tracks,
        Err(_) => match state.catalog.search_tracks(&query).await {
            Ok(tracks) => tracks,
            Err(_) => vec![],
        },
    };

    // If youtubei returned empty, also check catalog fallback
    if yt_results.is_empty() {
        if let Ok(mut cat_tracks) = state.catalog.search_tracks(&query).await {
            yt_results.append(&mut cat_tracks);
        }
    }

    // Also fetch from enabled plugins (Monochrome FLAC, Deezer, JioSaavn, Jamendo)
    let plugin_results = state.plugins.search_all_plugins(&query).await;

    // Combine with plugin results prioritized first
    let mut combined = plugin_results;
    combined.append(&mut yt_results);

    // Deduplicate by title & artist
    let mut unique = Vec::new();
    for track in combined {
        if !unique.iter().any(|t: &Track| {
            t.title.eq_ignore_ascii_case(&track.title) && t.artist.eq_ignore_ascii_case(&track.artist)
        }) {
            unique.push(track);
        }
    }

    CommandResponse::ok(unique)
}

pub async fn get_yt_home_feed(
    state: &AppState,
    lang: Option<String>,
) -> CommandResponse<serde_json::Value> {
    let language = lang.unwrap_or_else(|| "id".to_string());
    match state.youtubei.get_home_feed(&language).await {
        Ok(feed) => CommandResponse::ok(feed),
        Err(e) => CommandResponse::err(e),
    }
}

pub async fn fetch_yt_radio_queue(
    state: &AppState,
    video_id: String,
    continuation_token: Option<String>,
) -> CommandResponse<serde_json::Value> {
    match state
        .youtubei
        .get_radio_queue(&video_id, continuation_token.as_deref())
        .await
    {
        Ok(queue) => CommandResponse::ok(queue),
        Err(e) => CommandResponse::err(e),
    }
}

pub async fn browse_yt(
    state: &AppState,
    browse_id: String,
) -> CommandResponse<serde_json::Value> {
    match state.youtubei.browse(&browse_id).await {
        Ok(data) => CommandResponse::ok(data),
        Err(e) => CommandResponse::err(e),
    }
}

pub async fn get_search_suggestions(
    state: &AppState,
    query: String,
) -> CommandResponse<Vec<String>> {
    match state.youtubei.get_search_suggestions(&query).await {
        Ok(suggestions) => CommandResponse::ok(suggestions),
        Err(e) => CommandResponse::err(e),
    }
}

pub async fn fetch_lyrics(
    state: &AppState,
    request: FetchLyricsRequest,
) -> CommandResponse<Option<Lyrics>> {
    let video_id = request.video_id.unwrap_or_default();
    let title = request.title.unwrap_or_default();
    let artist = request.artist.unwrap_or_default();
    let duration = request.duration;

    match state
        .lyrics
        .fetch_lyrics(&video_id, &title, &artist, duration)
        .await
    {
        Ok(lrc) => CommandResponse::ok(lrc),
        Err(e) => CommandResponse::err(e),
    }
}

pub async fn get_app_settings(_state: &AppState) -> CommandResponse<serde_json::Value> {
    if let Some(path) = get_settings_path() {
        if path.exists() {
            if let Ok(content) = std::fs::read_to_string(&path) {
                if let Ok(val) = serde_json::from_str::<serde_json::Value>(&content) {
                    return CommandResponse::ok(val);
                }
            }
        }
    }
    CommandResponse::ok(default_app_settings())
}

pub async fn save_app_settings(
    _state: &AppState,
    settings: serde_json::Value,
) -> CommandResponse<bool> {
    if let Some(path) = get_settings_path() {
        if let Some(parent) = path.parent() {
            let _ = std::fs::create_dir_all(parent);
        }
        match serde_json::to_string_pretty(&settings) {
            Ok(content) => match std::fs::write(&path, content) {
                Ok(_) => CommandResponse::ok(true),
                Err(e) => CommandResponse::err(format!("Failed to write settings file: {}", e)),
            },
            Err(e) => CommandResponse::err(format!("Failed to serialize settings: {}", e)),
        }
    } else {
        CommandResponse::err("Could not determine user config directory")
    }
}

pub async fn get_system_info(_state: &AppState) -> CommandResponse<SystemInfo> {
    CommandResponse::ok(SystemInfo {
        os: std::env::consts::OS.to_string(),
        arch: std::env::consts::ARCH.to_string(),
        runtime: "tauri".to_string(),
        version: "1.0.0".to_string(),
    })
}

pub async fn get_trending(state: &AppState) -> CommandResponse<Vec<Track>> {
    match state.catalog.get_trending().await {
        Ok(tracks) => CommandResponse::ok(tracks),
        Err(e) => CommandResponse::err(e),
    }
}

pub async fn play_track(state: &AppState, track: Track) -> CommandResponse<PlaybackState> {
    // Record to history in background
    let _ = state.library.record_history(&track).await;

    // Resolve stream if needed (first check specialized plugin cascade, then catalog fallback)
    let mut resolved_track = track;
    if resolved_track.stream_url.is_none() {
        if let Some(url) = state.plugins.resolve_stream_cascade(&resolved_track).await {
            resolved_track.stream_url = Some(url);
        } else if let Ok(url) = state.catalog.resolve_stream(&resolved_track.id).await {
            resolved_track.stream_url = Some(url);
        }
    }

    // Broadcast track change to social/RPC plugins
    state.plugins.on_track_change(&resolved_track, true).await;

    match state.player.play_track(resolved_track).await {
        Ok(_) => CommandResponse::ok(state.player.get_state().await),
        Err(e) => CommandResponse::err(e),
    }
}

pub async fn toggle_play_pause(state: &AppState) -> CommandResponse<PlaybackState> {
    match state.player.toggle_play_pause().await {
        Ok(new_state) => {
            if let Some(ref track) = new_state.current_track {
                state.plugins.on_track_change(track, new_state.is_playing).await;
            }
            CommandResponse::ok(new_state)
        }
        Err(e) => CommandResponse::err(e),
    }
}

pub async fn next_track(state: &AppState) -> CommandResponse<PlaybackState> {
    match state.player.next_track().await {
        Ok(Some(track)) => {
            let _ = state.library.record_history(&track).await;
            state.plugins.on_track_change(&track, true).await;
            CommandResponse::ok(state.player.get_state().await)
        }
        Ok(None) => CommandResponse::ok(state.player.get_state().await),
        Err(e) => CommandResponse::err(e),
    }
}

pub async fn previous_track(state: &AppState) -> CommandResponse<PlaybackState> {
    match state.player.previous_track().await {
        Ok(Some(track)) => {
            let _ = state.library.record_history(&track).await;
            state.plugins.on_track_change(&track, true).await;
            CommandResponse::ok(state.player.get_state().await)
        }
        Ok(None) => CommandResponse::ok(state.player.get_state().await),
        Err(e) => CommandResponse::err(e),
    }
}

pub async fn seek(state: &AppState, position_ms: u64) -> CommandResponse<PlaybackState> {
    match state.player.seek(position_ms).await {
        Ok(_) => CommandResponse::ok(state.player.get_state().await),
        Err(e) => CommandResponse::err(e),
    }
}

pub async fn set_volume(state: &AppState, volume: f32) -> CommandResponse<PlaybackState> {
    match state.player.set_volume(volume).await {
        Ok(_) => CommandResponse::ok(state.player.get_state().await),
        Err(e) => CommandResponse::err(e),
    }
}

pub async fn get_state(state: &AppState) -> CommandResponse<PlaybackState> {
    CommandResponse::ok(state.player.get_state().await)
}

pub async fn get_lyrics(
    state: &AppState,
    track_id: String,
    title: String,
    artist: String,
    duration_secs: Option<u64>,
) -> CommandResponse<Option<Lyrics>> {
    match state
        .lyrics
        .fetch_lyrics(&track_id, &title, &artist, duration_secs)
        .await
    {
        Ok(lrc) => CommandResponse::ok(lrc),
        Err(e) => CommandResponse::err(e),
    }
}

pub async fn toggle_favorite(state: &AppState, track: Track) -> CommandResponse<bool> {
    match state.library.toggle_favorite(&track).await {
        Ok(is_fav) => CommandResponse::ok(is_fav),
        Err(e) => CommandResponse::err(e),
    }
}

pub async fn get_favorites(state: &AppState) -> CommandResponse<Vec<Track>> {
    match state.library.get_favorites().await {
        Ok(favs) => CommandResponse::ok(favs),
        Err(e) => CommandResponse::err(e),
    }
}

pub async fn get_history(state: &AppState) -> CommandResponse<Vec<Track>> {
    match state.library.get_history().await {
        Ok(hist) => CommandResponse::ok(hist),
        Err(e) => CommandResponse::err(e),
    }
}

pub async fn get_artist(state: &AppState, artist_id: String) -> CommandResponse<Artist> {
    match state.catalog.get_artist(&artist_id).await {
        Ok(artist) => CommandResponse::ok(artist),
        Err(e) => CommandResponse::err(e),
    }
}

// Plugin Management Commands
pub async fn get_plugins(state: &AppState) -> CommandResponse<Vec<PluginMeta>> {
    let plugins = state.plugins.get_all_plugins().await;
    CommandResponse::ok(plugins)
}

pub async fn toggle_plugin(state: &AppState, plugin_id: String, enabled: bool) -> CommandResponse<bool> {
    match state.plugins.toggle_plugin(&plugin_id, enabled).await {
        Ok(res) => CommandResponse::ok(res),
        Err(e) => CommandResponse::err(e),
    }
}

pub async fn import_spotify_playlist(state: &AppState, url: String) -> CommandResponse<Vec<Track>> {
    match state.plugins.import_spotify_playlist(&url).await {
        Ok(tracks) => CommandResponse::ok(tracks),
        Err(e) => CommandResponse::err(e),
    }
}

pub async fn get_equalizer_presets(state: &AppState) -> CommandResponse<Vec<EqualizerPreset>> {
    let presets = state.plugins.get_available_equalizer_presets().await;
    CommandResponse::ok(presets)
}

pub async fn set_equalizer_preset(state: &AppState, preset_name: String) -> CommandResponse<EqualizerPreset> {
    let preset = state.plugins.set_equalizer_preset(&preset_name).await;
    CommandResponse::ok(preset)
}

pub async fn get_current_equalizer(state: &AppState) -> CommandResponse<EqualizerPreset> {
    let preset = state.plugins.get_equalizer_preset().await;
    CommandResponse::ok(preset)
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::build_app_state;

    #[tokio::test]
    async fn test_search_tracks_with_filter() {
        let state = build_app_state();
        let res = search_tracks(&state, "Priangan".to_string(), Some("song".to_string())).await;
        assert!(res.success);
        let tracks = res.data.expect("tracks expected");
        assert!(!tracks.is_empty());
        // Verify deduplication
        let mut seen = std::collections::HashSet::new();
        for t in &tracks {
            let key = (t.title.to_lowercase(), t.artist.to_lowercase());
            assert!(seen.insert(key), "Duplicate track found in search_tracks results");
        }
    }

    #[tokio::test]
    async fn test_resolve_full_stream_proxied() {
        let state = build_app_state();
        let req = ResolveStreamRequest {
            title: Some("Midnight Emerald".to_string()),
            artist: Some("Priangan Sound Lab".to_string()),
            video_id: Some("sora_001".to_string()),
            is_video: false,
        };
        let res = resolve_full_stream(&state, req).await;
        assert!(res.success);
        let payload = res.data.expect("payload expected");
        assert_eq!(payload.video_id, "sora_001");
        assert_eq!(payload.title, "Midnight Emerald");
        assert_eq!(payload.artist, "Priangan Sound Lab");
        assert_eq!(payload.audio_quality, "high");
        if state.audio_proxy.is_some() {
            assert!(payload.proxied);
            assert!(payload.url.starts_with("http://127.0.0.1:"));
            assert!(payload.url.contains("/stream?url="));
        }
    }

    #[tokio::test]
    async fn test_resolve_full_stream_empty_err() {
        let state = build_app_state();
        let req = ResolveStreamRequest {
            title: None,
            artist: None,
            video_id: None,
            is_video: false,
        };
        let res = resolve_full_stream(&state, req).await;
        assert!(!res.success);
        assert!(res.error.is_some());
    }

    #[tokio::test]
    async fn test_get_and_save_app_settings() {
        let state = build_app_state();
        let initial = get_app_settings(&state).await;
        assert!(initial.success);
        assert!(initial.data.is_some());

        let custom_settings = serde_json::json!({
            "theme": "emerald-obsidian",
            "audioQuality": "flac",
            "volume": 0.92
        });

        let save_res = save_app_settings(&state, custom_settings.clone()).await;
        assert!(save_res.success);
        assert_eq!(save_res.data, Some(true));

        let retrieved = get_app_settings(&state).await;
        assert!(retrieved.success);
        let data = retrieved.data.unwrap();
        assert_eq!(data["theme"], "emerald-obsidian");
        assert_eq!(data["audioQuality"], "flac");
    }

    #[tokio::test]
    async fn test_get_system_info() {
        let state = build_app_state();
        let res = get_system_info(&state).await;
        assert!(res.success);
        let info = res.data.unwrap();
        assert_eq!(info.runtime, "tauri");
        assert_eq!(info.version, "1.0.0");
        assert_eq!(info.os, std::env::consts::OS);
        assert_eq!(info.arch, std::env::consts::ARCH);
    }

    #[tokio::test]
    async fn test_radio_queue_empty_id() {
        let state = build_app_state();
        let res = fetch_yt_radio_queue(&state, "".to_string(), None).await;
        assert!(res.success);
        let val = res.data.expect("data expected");
        assert_eq!(val["tracks"], serde_json::json!([]));
        assert!(val["continuation"].is_null());
    }

    #[tokio::test]
    async fn test_search_suggestions_empty() {
        let state = build_app_state();
        let res = get_search_suggestions(&state, "".to_string()).await;
        assert!(res.success);
        assert_eq!(res.data, Some(vec![]));
    }

    #[tokio::test]
    async fn test_browse_empty_id() {
        let state = build_app_state();
        let res = browse_yt(&state, "".to_string()).await;
        assert!(!res.success);
        assert!(res.error.is_some());
    }
}
