use sorafy_lib::application::commands::{
    get_app_settings, get_system_info, resolve_full_stream, search_tracks, ResolveStreamRequest,
};
use sorafy_lib::build_app_state;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    println!("==================================================");
    println!("  SoraFy Desktop Audio Engine v1.0.0");
    println!("  Cross-Platform Music Streaming for Linux & Windows");
    println!("  Architecture: Domain-Driven Design (Clean Architecture)");
    println!("  Palette: Obsidian Void, Priangan Emerald & Electric Lime");
    println!("==================================================");

    let state = build_app_state();

    println!("\n[1/5] Probing System Runtime & Normalized Environment...");
    let sys_info = get_system_info(&state).await;
    if let Some(info) = sys_info.data {
        println!(
            "-> Runtime: {} | OS: {} | Arch: {} | Version: {}",
            info.runtime, info.os, info.arch, info.version
        );
    }

    println!("\n[2/5] Initializing Catalog Repository Adapter...");
    let trending = state.catalog.get_trending().await?;
    println!("-> Retrieved {} tracks from catalog port.", trending.len());
    for (idx, track) in trending.iter().enumerate().take(3) {
        println!(
            "   #{} \"{}\" by {} [{}]",
            idx + 1,
            track.title,
            track.artist,
            track.audio_format.codec
        );
    }

    println!("\n[3/5] Testing Normalized Command: resolve_full_stream...");
    if let Some(first) = trending.first() {
        let req = ResolveStreamRequest {
            title: Some(first.title.clone()),
            artist: Some(first.artist.clone()),
            video_id: Some(first.id.clone()),
            is_video: false,
        };
        let stream_res = resolve_full_stream(&state, req).await;
        if let Some(payload) = stream_res.data {
            println!(
                "-> Resolved stream: \"{}\" by {} | proxied: {} | URL: {}",
                payload.title, payload.artist, payload.proxied, payload.url
            );
        }
    }

    println!("\n[4/5] Initializing LRCLIB Lyrics Sync Adapter...");
    if let Some(first) = trending.first() {
        println!("-> Probing synchronized lyrics for \"{}\"...", first.title);
        match state
            .lyrics
            .fetch_lyrics(&first.id, &first.title, &first.artist, Some(first.duration_secs))
            .await
        {
            Ok(Some(lrc)) => {
                println!("-> Found {} synchronized lyric lines.", lrc.synced_lines.len());
            }
            Ok(None) => {
                println!("-> No synced lyrics for this track (plain lyrics fallback).");
            }
            Err(e) => {
                println!("-> Lyrics probe note: {}", e);
            }
        }
    }

    println!("\n[5/5] Initializing Modular Plugins (Mobile to Desktop Port)...");
    let plugins = state.plugins.get_all_plugins().await;
    println!("-> Loaded {} active plugins:", plugins.len());
    for p in &plugins {
        let status = if p.is_enabled { "✓ AKTIF" } else { "○ NONAKTIF" };
        println!("   [{}] {} v{} ({}) - {}", status, p.name, p.version, p.category, p.description);
    }

    let search_res = search_tracks(&state, "Bandung".to_string(), Some("song".to_string())).await;
    if let Some(results) = search_res.data {
        println!("-> Command search_tracks test yielded {} deduplicated tracks.", results.len());
    }

    let settings = get_app_settings(&state).await;
    if let Some(s) = settings.data {
        println!("-> Normalized App Settings theme: {:?}", s.get("theme"));
    }

    println!("\n✓ SoraFy Desktop Core Engine & Normalized Commands operational.\n");
    Ok(())
}
