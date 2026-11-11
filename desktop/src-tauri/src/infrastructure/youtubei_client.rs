use reqwest::header::{HeaderMap, HeaderValue, CONTENT_TYPE, USER_AGENT};
use serde_json::{json, Value};
use std::sync::OnceLock;

use crate::domain::error::DomainError;
use crate::domain::model::{AudioFormat, Track};

const DEFAULT_USER_AGENT: &str =
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36";
const YOUTUBEI_BASE_URL: &str = "https://music.youtube.com/youtubei/v1";

/// Strict filter to exclude Indian songs, playlists, Bollywood, and regional Indian scripts
pub fn is_indian_music_or_playlist(title: &str, author: &str) -> bool {
    static KEYWORD_REGEX: OnceLock<regex::Regex> = OnceLock::new();
    static SCRIPT_REGEX: OnceLock<regex::Regex> = OnceLock::new();

    let kw_re = KEYWORD_REGEX.get_or_init(|| {
        regex::Regex::new(r"(?i)\b(hindi|bollywood|punjabi|tamil|telugu|india|indian|tollywood|malayalam|bhojpuri|gujarati|bengali|marathi|kannada|desi|bhangra|sufi|urdu|ghazal|qawwali|arijit|shreya|neha|jubin|badshah|sidhu|diljit|anirudh|pritam|himesh|t-series|zeemusic|speedrecords|geetmp3|whitehill)\b").unwrap()
    });

    let script_re = SCRIPT_REGEX.get_or_init(|| {
        regex::Regex::new(r"[\u{0900}-\u{097F}\u{0A00}-\u{0A7F}\u{0A80}-\u{0AFF}\u{0B00}-\u{0B7F}\u{0B80}-\u{0BFF}\u{0C00}-\u{0C7F}\u{0C80}-\u{0CFF}\u{0D00}-\u{0D7F}]").unwrap()
    });

    let combined = format!("{} {}", title, author);
    kw_re.is_match(&combined) || script_re.is_match(&combined)
}

/// Helper to parse duration strings ("3:45", "1:02:15", "214", etc.) into seconds
pub fn parse_duration_secs(raw: &str) -> u64 {
    let s = raw.trim();
    if s.is_empty() {
        return 0;
    }

    // Direct numeric string
    if let Ok(secs) = s.parse::<u64>() {
        return secs;
    }

    // Accessible format check e.g. "4 menit, 26 detik" or "3 min, 48 sec"
    let mut total_secs: u64 = 0;
    let mut matched_units = false;

    static MIN_RE: OnceLock<regex::Regex> = OnceLock::new();
    static SEC_RE: OnceLock<regex::Regex> = OnceLock::new();
    static HR_RE: OnceLock<regex::Regex> = OnceLock::new();

    let min_re = MIN_RE.get_or_init(|| regex::Regex::new(r"(?i)(\d+)\s*(?:menit|min)").unwrap());
    let sec_re = SEC_RE.get_or_init(|| regex::Regex::new(r"(?i)(\d+)\s*(?:detik|sec)").unwrap());
    let hr_re = HR_RE.get_or_init(|| regex::Regex::new(r"(?i)(\d+)\s*(?:jam|hr|hour)").unwrap());

    if let Some(caps) = hr_re.captures(s) {
        if let Ok(h) = caps[1].parse::<u64>() {
            total_secs += h * 3600;
            matched_units = true;
        }
    }
    if let Some(caps) = min_re.captures(s) {
        if let Ok(m) = caps[1].parse::<u64>() {
            total_secs += m * 60;
            matched_units = true;
        }
    }
    if let Some(caps) = sec_re.captures(s) {
        if let Ok(sec) = caps[1].parse::<u64>() {
            total_secs += sec;
            matched_units = true;
        }
    }

    if matched_units && total_secs > 0 {
        return total_secs;
    }

    // Formats: "HH:MM:SS" or "MM:SS"
    let parts: Vec<&str> = s.split(|c| c == ':' || c == '.').collect();
    if parts.len() == 2 {
        if let (Ok(m), Ok(sec)) = (parts[0].parse::<u64>(), parts[1].parse::<u64>()) {
            return m * 60 + sec;
        }
    } else if parts.len() == 3 {
        if let (Ok(h), Ok(m), Ok(sec)) = (
            parts[0].parse::<u64>(),
            parts[1].parse::<u64>(),
            parts[2].parse::<u64>(),
        ) {
            return h * 3600 + m * 60 + sec;
        }
    }

    0
}

/// Helper to upgrade artwork URL resolution to 544x544
pub fn clean_artwork_url(url: &str) -> String {
    let mut u = url.trim().to_string();
    if u.starts_with("//") {
        u = format!("https:{}", u);
    }
    if let Some(idx) = u.rfind('=') {
        if idx + 1 < u.len() && (u[idx + 1..].starts_with('w') || u[idx + 1..].starts_with('s')) {
            u.truncate(idx);
            u.push_str("=w544-h544-l90-rj");
        }
    }
    u
}

#[derive(Clone, Debug)]
pub struct YouTubeiClient {
    client: reqwest::Client,
}

impl Default for YouTubeiClient {
    fn default() -> Self {
        Self::new()
    }
}

impl YouTubeiClient {
    pub fn new() -> Self {
        let client = reqwest::Client::builder()
            .timeout(std::time::Duration::from_secs(10))
            .build()
            .unwrap_or_default();
        Self { client }
    }

    /// Construct and execute a raw InnerTube API POST request
    pub async fn post_innertube(
        &self,
        endpoint: &str,
        payload: Value,
        ua: Option<&str>,
    ) -> Result<Value, DomainError> {
        let url = if endpoint.starts_with("http://") || endpoint.starts_with("https://") {
            endpoint.to_string()
        } else {
            format!("{}/{}", YOUTUBEI_BASE_URL, endpoint.trim_start_matches('/'))
        };

        let user_agent = ua.unwrap_or(DEFAULT_USER_AGENT);
        let mut headers = HeaderMap::new();
        headers.insert(CONTENT_TYPE, HeaderValue::from_static("application/json"));
        if let Ok(val) = HeaderValue::from_str(user_agent) {
            headers.insert(USER_AGENT, val);
        }

        let resp = self
            .client
            .post(&url)
            .headers(headers)
            .json(&payload)
            .send()
            .await
            .map_err(|e| DomainError::NetworkError(e.to_string()))?;

        if !resp.status().is_success() {
            return Err(DomainError::NetworkError(format!(
                "InnerTube request returned status {}",
                resp.status()
            )));
        }

        let data = resp
            .json::<Value>()
            .await
            .map_err(|e| DomainError::NetworkError(format!("Failed to parse JSON: {}", e)))?;

        Ok(data)
    }

    /// Map filter type to YouTube Music search parameter string
    pub fn filter_to_param(filter_type: Option<&str>) -> Option<&'static str> {
        match filter_type {
            Some("song") => Some("EgWKAQIIAWoKEAkQBRAKEAMQBw%3D%3D"),
            Some("video") => Some("EgWKAQIQAWoKEAkQBRAKEAMQBw%3D%3D"),
            Some("artist") => None, // Unfiltered yields musicCardShelfRenderer
            Some("album") => Some("EgWKAQIYAWoKEAkQBRAKEAMQBw%3D%3D"),
            Some("playlist") => Some("EgWKAQI4AWoKEAkQBRAKEAMQBw%3D%3D"),
            _ => Some("EgWKAQIIAWoKEAkQBRAKEAMQBw%3D%3D"), // Default to Songs
        }
    }

    /// Search YouTube Music using official InnerTube WEB_REMIX context
    pub async fn search(
        &self,
        query: &str,
        filter_type: Option<&str>,
    ) -> Result<Vec<Track>, DomainError> {
        let q = query.trim();
        if q.is_empty() {
            return Ok(Vec::new());
        }

        let mut payload_map = serde_json::Map::new();
        payload_map.insert("query".to_string(), json!(q));
        payload_map.insert(
            "context".to_string(),
            json!({
                "client": {
                    "clientName": "WEB_REMIX",
                    "clientVersion": "1.20240318.01.00",
                    "hl": "id",
                    "gl": "ID"
                }
            }),
        );

        if let Some(param) = Self::filter_to_param(filter_type) {
            payload_map.insert("params".to_string(), json!(param));
        }

        let data = self
            .post_innertube("search", Value::Object(payload_map), None)
            .await?;

        let mut tracks: Vec<Track> = Vec::new();

        // 1. Check sections in tabbedSearchResultsRenderer
        if let Some(contents) = data
            .get("contents")
            .and_then(|c| c.get("tabbedSearchResultsRenderer"))
            .and_then(|t| t.get("tabs"))
            .and_then(|t| t.get(0))
            .and_then(|t| t.get("tabRenderer"))
            .and_then(|t| t.get("content"))
            .and_then(|c| c.get("sectionListRenderer"))
            .and_then(|s| s.get("contents"))
            .and_then(|c| c.as_array())
        {
            for sec in contents {
                // Hero card shelf renderer
                if let Some(card) = sec.get("musicCardShelfRenderer") {
                    let hero_vid = card
                        .get("onTap")
                        .and_then(|o| o.get("watchEndpoint"))
                        .and_then(|w| w.get("videoId"))
                        .and_then(|v| v.as_str())
                        .or_else(|| {
                            card.get("buttons")
                                .and_then(|b| b.get(0))
                                .and_then(|b| b.get("buttonRenderer"))
                                .and_then(|r| r.get("command"))
                                .and_then(|c| c.get("watchEndpoint"))
                                .and_then(|w| w.get("videoId"))
                                .and_then(|v| v.as_str())
                        });

                    let title = card
                        .get("title")
                        .and_then(|t| t.get("runs"))
                        .and_then(|r| r.get(0))
                        .and_then(|r| r.get("text"))
                        .and_then(|t| t.as_str())
                        .unwrap_or("")
                        .to_string();

                    let subtitle_runs = card
                        .get("subtitle")
                        .and_then(|s| s.get("runs"))
                        .and_then(|r| r.as_array());

                    let artist = subtitle_runs
                        .and_then(|runs| runs.get(0))
                        .and_then(|r| r.get("text"))
                        .and_then(|t| t.as_str())
                        .unwrap_or("Artist")
                        .to_string();

                    if let Some(vid) = hero_vid {
                        if !vid.is_empty() && !is_indian_music_or_playlist(&title, &artist) {
                            let artwork_url = card
                                .get("thumbnail")
                                .and_then(|th| th.get("musicThumbnailRenderer"))
                                .and_then(|m| m.get("thumbnail"))
                                .and_then(|t| t.get("thumbnails"))
                                .and_then(|arr| arr.as_array())
                                .and_then(|arr| arr.last())
                                .and_then(|item| item.get("url"))
                                .and_then(|u| u.as_str())
                                .map(clean_artwork_url)
                                .unwrap_or_else(|| {
                                    format!("https://i.ytimg.com/vi/{}/hqdefault.jpg", vid)
                                });

                            tracks.push(Track {
                                id: format!("yt_{}", vid),
                                title: title.clone(),
                                artist: artist.clone(),
                                artist_id: None,
                                album: None,
                                duration_secs: 0,
                                stream_url: None,
                                artwork_url: Some(artwork_url),
                                audio_format: AudioFormat::default(),
                                is_liked: false,
                                source_label: Some("Hasil Teratas".to_string()),
                            });
                        }
                    }

                    // Extract songs from card contents
                    if let Some(card_contents) = card.get("contents").and_then(|c| c.as_array()) {
                        for item in card_contents {
                            if let Some(renderer) = item.get("musicResponsiveListItemRenderer") {
                                if let Some(track) = Self::parse_list_item_renderer(renderer) {
                                    if !is_indian_music_or_playlist(&track.title, &track.artist) {
                                        tracks.push(track);
                                    }
                                }
                            }
                        }
                    }
                }

                // Generic list shelves (musicShelfRenderer, etc.)
                let raw_items = sec
                    .get("musicShelfRenderer")
                    .and_then(|s| s.get("contents"))
                    .or_else(|| {
                        sec.get("musicPlaylistShelfRenderer")
                            .and_then(|s| s.get("contents"))
                    })
                    .and_then(|c| c.as_array());

                if let Some(items) = raw_items {
                    for item in items {
                        if let Some(renderer) = item.get("musicResponsiveListItemRenderer") {
                            if let Some(track) = Self::parse_list_item_renderer(renderer) {
                                if !is_indian_music_or_playlist(&track.title, &track.artist) {
                                    tracks.push(track);
                                }
                            }
                        }
                    }
                }
            }
        }

        Ok(tracks)
    }

    /// Helper to parse a single `musicResponsiveListItemRenderer` into a domain `Track`
    fn parse_list_item_renderer(renderer: &Value) -> Option<Track> {
        let flex_columns = renderer.get("flexColumns")?.as_array()?;
        if flex_columns.is_empty() {
            return None;
        }

        // Title from flexColumns[0]
        let title = flex_columns
            .get(0)?
            .get("musicResponsiveListItemFlexColumnRenderer")?
            .get("text")?
            .get("runs")?
            .get(0)?
            .get("text")?
            .as_str()?
            .trim()
            .to_string();

        if title.is_empty() {
            return None;
        }

        // Subtitle runs from flexColumns[1]
        let sub_runs = flex_columns
            .get(1)
            .and_then(|fc| fc.get("musicResponsiveListItemFlexColumnRenderer"))
            .and_then(|r| r.get("text"))
            .and_then(|t| t.get("runs"))
            .and_then(|r| r.as_array());

        let mut artist = "Artist".to_string();
        let mut artist_id: Option<String> = None;
        let mut album: Option<String> = None;
        let mut dur_str = String::new();

        if let Some(runs) = sub_runs {
            if let Some(first_run) = runs.get(0) {
                if let Some(txt) = first_run.get("text").and_then(|t| t.as_str()) {
                    artist = txt.trim().to_string();
                }
                if let Some(b_id) = first_run
                    .get("navigationEndpoint")
                    .and_then(|e| e.get("browseEndpoint"))
                    .and_then(|b| b.get("browseId"))
                    .and_then(|id| id.as_str())
                {
                    if b_id.starts_with("UC") {
                        artist_id = Some(b_id.to_string());
                    }
                }
            }

            if runs.len() > 2 {
                if let Some(txt) = runs.get(2).and_then(|r| r.get("text")).and_then(|t| t.as_str()) {
                    album = Some(txt.trim().to_string());
                }
            }

            if let Some(last_run) = runs.last() {
                if let Some(txt) = last_run.get("text").and_then(|t| t.as_str()) {
                    dur_str = txt.trim().to_string();
                }
            }
        }

        // Extract duration: check fixedColumns first, then subtitle run
        let mut duration_secs = 0;
        if let Some(fixed_cols) = renderer.get("fixedColumns").and_then(|fc| fc.as_array()) {
            for col in fixed_cols {
                if let Some(runs) = col
                    .get("musicResponsiveListItemFixedColumnRenderer")
                    .and_then(|r| r.get("text"))
                    .and_then(|t| t.get("runs"))
                    .and_then(|r| r.as_array())
                {
                    for r in runs {
                        if let Some(txt) = r.get("text").and_then(|t| t.as_str()) {
                            let d = parse_duration_secs(txt);
                            if d > 0 {
                                duration_secs = d;
                                break;
                            }
                        }
                    }
                }
                if duration_secs > 0 {
                    break;
                }
            }
        }
        if duration_secs == 0 && !dur_str.is_empty() {
            duration_secs = parse_duration_secs(&dur_str);
        }

        // Video ID extraction
        let video_id = renderer
            .get("overlay")
            .and_then(|o| o.get("musicItemThumbnailOverlayRenderer"))
            .and_then(|m| m.get("content"))
            .and_then(|c| c.get("musicPlayButtonRenderer"))
            .and_then(|p| p.get("playNavigationEndpoint"))
            .and_then(|n| n.get("watchEndpoint"))
            .and_then(|w| w.get("videoId"))
            .and_then(|v| v.as_str())
            .or_else(|| {
                renderer
                    .get("playlistItemData")
                    .and_then(|p| p.get("videoId"))
                    .and_then(|v| v.as_str())
            })?
            .to_string();

        if video_id.is_empty() {
            return None;
        }

        // Artwork URL
        let thumbs = renderer
            .get("thumbnail")
            .and_then(|th| th.get("musicThumbnailRenderer"))
            .and_then(|m| m.get("thumbnail"))
            .and_then(|t| t.get("thumbnails"))
            .or_else(|| {
                renderer
                    .get("thumbnail")
                    .and_then(|th| th.get("croppedSquareThumbnailRenderer"))
                    .and_then(|m| m.get("thumbnail"))
                    .and_then(|t| t.get("thumbnails"))
            })
            .and_then(|t| t.as_array());

        let artwork_url = thumbs
            .and_then(|arr| arr.last())
            .and_then(|item| item.get("url"))
            .and_then(|u| u.as_str())
            .map(clean_artwork_url)
            .unwrap_or_else(|| format!("https://i.ytimg.com/vi/{}/hqdefault.jpg", video_id));

        Some(Track {
            id: format!("yt_{}", video_id),
            title,
            artist,
            artist_id,
            album,
            duration_secs,
            stream_url: None,
            artwork_url: Some(artwork_url),
            audio_format: AudioFormat::default(),
            is_liked: false,
            source_label: Some("SoraFy Stream".to_string()),
        })
    }

    /// Get Home Feed (Quick Picks, Charts, Sections) using FEmusic_home browse endpoint
    pub async fn get_home_feed(&self, lang: &str) -> Result<Value, DomainError> {
        let hl = if lang == "id" { "id" } else { "en" };
        let gl = if lang == "id" { "ID" } else { "US" };

        let payload = json!({
            "browseId": "FEmusic_home",
            "context": {
                "client": {
                    "clientName": "WEB_REMIX",
                    "clientVersion": "1.20240318.01.00",
                    "hl": hl,
                    "gl": gl
                }
            }
        });

        let data = self.post_innertube("browse", payload, None).await?;

        let mut quick_picks: Vec<Track> = Vec::new();
        let mut sections: Vec<Value> = Vec::new();

        let contents = data
            .get("contents")
            .and_then(|c| c.get("singleColumnBrowseResultsRenderer"))
            .and_then(|s| s.get("tabs"))
            .and_then(|t| t.get(0))
            .and_then(|t| t.get("tabRenderer"))
            .and_then(|t| t.get("content"))
            .and_then(|c| c.get("sectionListRenderer"))
            .and_then(|s| s.get("contents"))
            .and_then(|c| c.as_array());

        if let Some(sec_list) = contents {
            for sec in sec_list {
                let mut shelf_tracks: Vec<Track> = Vec::new();

                // Carousel shelf
                if let Some(carousel) = sec.get("musicCarouselShelfRenderer") {
                    let title = carousel
                        .get("header")
                        .and_then(|h| h.get("musicCarouselShelfBasicHeaderRenderer"))
                        .and_then(|h| h.get("title"))
                        .and_then(|t| t.get("runs"))
                        .and_then(|r| r.get(0))
                        .and_then(|r| r.get("text"))
                        .and_then(|t| t.as_str())
                        .unwrap_or("Featured");

                    if let Some(items) = carousel.get("contents").and_then(|c| c.as_array()) {
                        for itm in items {
                            if let Some(renderer) = itm.get("musicResponsiveListItemRenderer") {
                                if let Some(track) = Self::parse_list_item_renderer(renderer) {
                                    if !is_indian_music_or_playlist(&track.title, &track.artist) {
                                        shelf_tracks.push(track);
                                    }
                                }
                            }
                        }
                    }

                    if !shelf_tracks.is_empty() {
                        if quick_picks.is_empty() {
                            quick_picks.extend(shelf_tracks.clone());
                        }
                        sections.push(json!({
                            "title": title,
                            "items": shelf_tracks
                        }));
                    }
                }
            }
        }

        // Return combined JSON compatible with both camelCase, snake_case, and standard sections
        Ok(json!({
            "success": true,
            "quickPicks": quick_picks,
            "quick_picks": quick_picks,
            "sections": sections,
            "charts": [],
            "communityPlaylists": [],
            "featuredPlaylists": [],
            "newReleases": []
        }))
    }

    /// Get continuous Radio Automix queue for a video ID or continuation token
    pub async fn get_radio_queue(
        &self,
        video_id: &str,
        continuation: Option<&str>,
    ) -> Result<Value, DomainError> {
        let clean_vid = video_id.trim_start_matches("yt_").trim();
        if clean_vid.is_empty() && continuation.is_none() {
            return Ok(json!({ "tracks": [], "continuation": null }));
        }

        let payload = if let Some(cont) = continuation {
            json!({
                "continuation": cont,
                "context": {
                    "client": {
                        "clientName": "WEB_REMIX",
                        "clientVersion": "1.20240318.01.00",
                        "hl": "id",
                        "gl": "ID"
                    }
                }
            })
        } else {
            json!({
                "videoId": clean_vid,
                "playlistId": format!("RDAMVM{}", clean_vid),
                "isAudioOnly": true,
                "context": {
                    "client": {
                        "clientName": "WEB_REMIX",
                        "clientVersion": "1.20240318.01.00",
                        "hl": "id",
                        "gl": "ID"
                    }
                }
            })
        };

        let data = self.post_innertube("next", payload, None).await?;

        let mut tracks: Vec<Track> = Vec::new();
        let mut seen_vids = std::collections::HashSet::new();
        if !clean_vid.is_empty() {
            seen_vids.insert(clean_vid.to_string());
        }

        let (raw_items, next_cont) = if continuation.is_some() {
            let cont_obj = data
                .get("continuationContents")
                .and_then(|c| c.get("playlistPanelContinuation"));

            let cont_token = cont_obj
                .and_then(|c| c.get("continuations"))
                .and_then(|arr| arr.get(0))
                .and_then(|item| {
                    item.get("nextRadioContinuationData")
                        .or_else(|| item.get("nextContinuationData"))
                })
                .and_then(|d| d.get("continuation"))
                .and_then(|c| c.as_str())
                .map(|s| s.to_string());

            (
                cont_obj.and_then(|c| c.get("contents")).and_then(|c| c.as_array()),
                cont_token,
            )
        } else {
            let tabs = data
                .get("contents")
                .and_then(|c| c.get("singleColumnMusicWatchNextResultsRenderer"))
                .and_then(|s| s.get("tabbedRenderer"))
                .and_then(|t| t.get("watchNextTabbedResultsRenderer"))
                .and_then(|t| t.get("tabs"));

            let panel = tabs
                .and_then(|t| t.get(0))
                .and_then(|t| t.get("tabRenderer"))
                .and_then(|t| t.get("content"))
                .and_then(|c| c.get("musicQueueRenderer"))
                .and_then(|q| q.get("content"))
                .and_then(|c| c.get("playlistPanelRenderer"));

            let cont_token = panel
                .and_then(|p| p.get("continuations"))
                .and_then(|arr| arr.get(0))
                .and_then(|item| {
                    item.get("nextRadioContinuationData")
                        .or_else(|| item.get("nextContinuationData"))
                })
                .and_then(|d| d.get("continuation"))
                .and_then(|c| c.as_str())
                .map(|s| s.to_string());

            (
                panel.and_then(|p| p.get("contents")).and_then(|c| c.as_array()),
                cont_token,
            )
        };

        if let Some(items) = raw_items {
            for item in items {
                if let Some(r) = item.get("playlistPanelVideoRenderer") {
                    let vid = match r.get("videoId").and_then(|v| v.as_str()) {
                        Some(v) if !v.is_empty() => v,
                        _ => continue,
                    };

                    if seen_vids.contains(vid) {
                        continue;
                    }
                    seen_vids.insert(vid.to_string());

                    let title = r
                        .get("title")
                        .and_then(|t| t.get("runs"))
                        .and_then(|runs| runs.as_array())
                        .map(|runs| {
                            runs.iter()
                                .filter_map(|x| x.get("text").and_then(|t| t.as_str()))
                                .collect::<Vec<&str>>()
                                .join("")
                        })
                        .unwrap_or_default()
                        .trim()
                        .to_string();

                    let mut artist = r
                        .get("shortBylineText")
                        .and_then(|t| t.get("runs"))
                        .and_then(|runs| runs.as_array())
                        .map(|runs| {
                            runs.iter()
                                .filter_map(|x| x.get("text").and_then(|t| t.as_str()))
                                .collect::<Vec<&str>>()
                                .join("")
                        })
                        .unwrap_or_default()
                        .trim()
                        .to_string();

                    if artist.is_empty() {
                        if let Some(full) = r
                            .get("longBylineText")
                            .and_then(|t| t.get("runs"))
                            .and_then(|runs| runs.as_array())
                            .map(|runs| {
                                runs.iter()
                                    .filter_map(|x| x.get("text").and_then(|t| t.as_str()))
                                    .collect::<Vec<&str>>()
                                    .join("")
                            })
                        {
                            artist = full.split(" • ").next().unwrap_or("Artist").trim().to_string();
                        }
                    }

                    if is_indian_music_or_playlist(&title, &artist) {
                        continue;
                    }

                    let dur_str = r
                        .get("lengthText")
                        .and_then(|t| t.get("runs"))
                        .and_then(|r| r.get(0))
                        .and_then(|r| r.get("text"))
                        .and_then(|t| t.as_str())
                        .unwrap_or("");

                    let duration_secs = parse_duration_secs(dur_str);

                    let thumbs = r
                        .get("thumbnail")
                        .and_then(|th| th.get("thumbnails"))
                        .and_then(|t| t.as_array());

                    let artwork_url = thumbs
                        .and_then(|arr| arr.last())
                        .and_then(|item| item.get("url"))
                        .and_then(|u| u.as_str())
                        .map(clean_artwork_url)
                        .unwrap_or_else(|| format!("https://i.ytimg.com/vi/{}/hqdefault.jpg", vid));

                    tracks.push(Track {
                        id: format!("yt_{}", vid),
                        title,
                        artist: if artist.is_empty() {
                            "Unknown Artist".to_string()
                        } else {
                            artist
                        },
                        artist_id: None,
                        album: Some("Radio Automix".to_string()),
                        duration_secs,
                        stream_url: None,
                        artwork_url: Some(artwork_url),
                        audio_format: AudioFormat::default(),
                        is_liked: false,
                        source_label: Some("ytmusic_automix".to_string()),
                    });
                }
            }
        }

        Ok(json!({
            "tracks": tracks,
            "continuation": next_cont
        }))
    }

    /// Browse details (artists, albums, playlists) via InnerTube browse endpoint
    pub async fn browse(&self, browse_id: &str) -> Result<Value, DomainError> {
        let b_id = browse_id.trim();
        if b_id.is_empty() {
            return Err(DomainError::InvalidParameter("browse_id cannot be empty".to_string()));
        }

        let payload = json!({
            "browseId": b_id,
            "context": {
                "client": {
                    "clientName": "WEB_REMIX",
                    "clientVersion": "1.20240318.01.00",
                    "hl": "id",
                    "gl": "ID"
                }
            }
        });

        let data = self.post_innertube("browse", payload, None).await?;

        // Extract header title
        let header = data
            .get("header")
            .and_then(|h| {
                h.get("musicImmersiveHeaderRenderer")
                    .or_else(|| h.get("musicVisualHeaderRenderer"))
                    .or_else(|| h.get("musicDetailHeaderRenderer"))
            });

        let title = header
            .and_then(|h| h.get("title"))
            .and_then(|t| t.get("runs"))
            .and_then(|r| r.get(0))
            .and_then(|r| r.get("text"))
            .and_then(|t| t.as_str())
            .or_else(|| {
                data.get("microformat")
                    .and_then(|m| m.get("microformatDataRenderer"))
                    .and_then(|d| d.get("title"))
                    .and_then(|t| t.as_str())
            })
            .unwrap_or("")
            .to_string();

        let mut parsed_tracks: Vec<Track> = Vec::new();

        let contents = data
            .get("contents")
            .and_then(|c| {
                c.get("singleColumnBrowseResultsRenderer")
                    .and_then(|s| s.get("tabs"))
                    .and_then(|t| t.get(0))
                    .and_then(|t| t.get("tabRenderer"))
                    .and_then(|t| t.get("content"))
                    .and_then(|c| c.get("sectionListRenderer"))
                    .and_then(|s| s.get("contents"))
                    .or_else(|| {
                        c.get("twoColumnBrowseResultsRenderer")
                            .and_then(|t| t.get("secondaryContents"))
                            .and_then(|s| s.get("sectionListRenderer"))
                            .and_then(|s| s.get("contents"))
                    })
            })
            .and_then(|c| c.as_array());

        if let Some(sec_list) = contents {
            for sec in sec_list {
                let items = sec
                    .get("musicShelfRenderer")
                    .and_then(|s| s.get("contents"))
                    .or_else(|| {
                        sec.get("musicPlaylistShelfRenderer")
                            .and_then(|s| s.get("contents"))
                    })
                    .or_else(|| {
                        sec.get("musicCarouselShelfRenderer")
                            .and_then(|s| s.get("contents"))
                    })
                    .and_then(|c| c.as_array());

                if let Some(items) = items {
                    for itm in items {
                        if let Some(renderer) = itm.get("musicResponsiveListItemRenderer") {
                            if let Some(track) = Self::parse_list_item_renderer(renderer) {
                                if !is_indian_music_or_playlist(&track.title, &track.artist) {
                                    parsed_tracks.push(track);
                                }
                            }
                        }
                    }
                }
            }
        }

        Ok(json!({
            "browseId": b_id,
            "title": title,
            "tracks": parsed_tracks
        }))
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_filter_to_param_mapping() {
        assert_eq!(
            YouTubeiClient::filter_to_param(Some("song")),
            Some("EgWKAQIIAWoKEAkQBRAKEAMQBw%3D%3D")
        );
        assert_eq!(
            YouTubeiClient::filter_to_param(Some("video")),
            Some("EgWKAQIQAWoKEAkQBRAKEAMQBw%3D%3D")
        );
        assert_eq!(YouTubeiClient::filter_to_param(Some("artist")), None);
        assert_eq!(
            YouTubeiClient::filter_to_param(Some("album")),
            Some("EgWKAQIYAWoKEAkQBRAKEAMQBw%3D%3D")
        );
        assert_eq!(
            YouTubeiClient::filter_to_param(Some("playlist")),
            Some("EgWKAQI4AWoKEAkQBRAKEAMQBw%3D%3D")
        );
    }

    #[test]
    fn test_is_indian_music_or_playlist_filter() {
        // Indian titles / artists should be flagged
        assert!(is_indian_music_or_playlist("Tum Hi Ho", "Arijit Singh"));
        assert!(is_indian_music_or_playlist("Bollywood Hit 2024", "T-Series"));
        assert!(is_indian_music_or_playlist("Punjabi Beat", "Diljit Dosanjh"));
        assert!(is_indian_music_or_playlist("तमिल गीत", "Singer"));

        // Non-Indian music should not be flagged
        assert!(!is_indian_music_or_playlist("Midnight Emerald", "Priangan Sound Lab"));
        assert!(!is_indian_music_or_playlist("Starry Night", "Peggy Gou"));
        assert!(!is_indian_music_or_playlist("Blinding Lights", "The Weeknd"));
        assert!(!is_indian_music_or_playlist("Sial", "Mahalini"));
    }

    #[test]
    fn test_parse_duration_secs() {
        assert_eq!(parse_duration_secs("3:45"), 225);
        assert_eq!(parse_duration_secs("03:45"), 225);
        assert_eq!(parse_duration_secs("1:02:15"), 3735);
        assert_eq!(parse_duration_secs("214"), 214);
        assert_eq!(parse_duration_secs("4 menit, 26 detik"), 266);
        assert_eq!(parse_duration_secs(""), 0);
    }

    #[test]
    fn test_clean_artwork_url() {
        let raw = "https://lh3.googleusercontent.com/abc=w120-h120-l90-rj";
        let cleaned = clean_artwork_url(raw);
        assert_eq!(cleaned, "https://lh3.googleusercontent.com/abc=w544-h544-l90-rj");

        let proto_rel = "//i.ytimg.com/vi/abc/hqdefault.jpg";
        let cleaned2 = clean_artwork_url(proto_rel);
        assert!(cleaned2.starts_with("https://"));
    }
}
