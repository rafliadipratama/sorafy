use std::path::{Path, PathBuf};
use std::time::Duration;
use serde::{Deserialize, Serialize};
use tokio::time::timeout;

use crate::domain::error::DomainError;
use crate::infrastructure::audio_proxy::AudioProxy;

const IOS_USER_AGENT: &str = "com.google.ios.youtube/21.03.3 (iPad7,6; U; CPU iPadOS 17_7_10 like Mac OS X; en-US)";
const YTDLP_TIMEOUT_SECS: u64 = 9;

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct RawStreamInfo {
    pub raw_url: String,
    pub duration_secs: u64,
    pub bitrate: u32,
    pub mime_type: String,
    pub provider: String,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ResolvedStreamPayload {
    pub url: String,
    pub raw_url: String,
    #[serde(alias = "video_id")]
    pub video_id: String,
    pub title: String,
    pub artist: String,
    #[serde(alias = "duration_secs")]
    pub duration_secs: u64,
    pub bitrate: u32,
    #[serde(alias = "mime_type")]
    pub mime_type: String,
    pub provider: String,
    #[serde(alias = "audio_quality")]
    pub audio_quality: String,
    pub proxied: bool,
}

#[derive(Debug, Clone)]
pub struct YtDlpExtractor {
    http_client: reqwest::Client,
    binary_override: Option<PathBuf>,
}

impl Default for YtDlpExtractor {
    fn default() -> Self {
        Self::new()
    }
}

impl YtDlpExtractor {
    pub fn new() -> Self {
        let http_client = reqwest::Client::builder()
            .timeout(Duration::from_secs(YTDLP_TIMEOUT_SECS))
            .build()
            .unwrap_or_else(|_| reqwest::Client::new());

        Self {
            http_client,
            binary_override: None,
        }
    }

    pub fn with_binary_override(mut self, path: PathBuf) -> Self {
        self.binary_override = Some(path);
        self
    }

    /// Locate yt-dlp binary across bundled sidecars, config directories, and system PATH
    pub fn find_ytdlp_binary(&self) -> Option<PathBuf> {
        if let Some(ref path) = self.binary_override {
            if path.exists() {
                return Some(path.clone());
            }
        }

        let bin_name = if cfg!(target_os = "windows") {
            "yt-dlp.exe"
        } else {
            "yt-dlp"
        };

        let current_dir = std::env::current_dir().unwrap_or_else(|_| PathBuf::from("."));

        let mut candidate_paths: Vec<PathBuf> = vec![
            current_dir.join("desktop").join("bin").join("linux").join(bin_name),
            current_dir.join("desktop").join("bin").join(bin_name),
            current_dir.join("bin").join("linux").join(bin_name),
            current_dir.join("bin").join(bin_name),
            PathBuf::from("desktop/bin/linux").join(bin_name),
            PathBuf::from("desktop/bin").join(bin_name),
            PathBuf::from("bin/linux").join(bin_name),
            PathBuf::from("bin").join(bin_name),
        ];

        // Check executable directory if available
        if let Ok(exe_path) = std::env::current_exe() {
            if let Some(exe_dir) = exe_path.parent() {
                candidate_paths.push(exe_dir.join("bin").join("linux").join(bin_name));
                candidate_paths.push(exe_dir.join("bin").join(bin_name));
                candidate_paths.push(exe_dir.join(bin_name));
            }
        }

        // Check user config dir (~/.config/sorafy/bin/yt-dlp)
        if let Some(config_dir) = dirs::config_dir() {
            candidate_paths.push(config_dir.join("sorafy").join("bin").join(bin_name));
        }

        // Check user home local bin (~/.local/bin/yt-dlp)
        if let Some(home_dir) = dirs::home_dir() {
            candidate_paths.push(home_dir.join(".local").join("bin").join(bin_name));
        }

        // Check system directories
        candidate_paths.push(PathBuf::from("/usr/local/bin").join(bin_name));
        candidate_paths.push(PathBuf::from("/usr/bin").join(bin_name));

        for candidate in candidate_paths {
            if candidate.exists() && candidate.is_file() {
                #[cfg(unix)]
                {
                    use std::os::unix::fs::PermissionsExt;
                    if let Ok(metadata) = std::fs::metadata(&candidate) {
                        let mut perms = metadata.permissions();
                        if perms.mode() & 0o111 == 0 {
                            perms.set_mode(0o755);
                            let _ = std::fs::set_permissions(&candidate, perms);
                        }
                    }
                }
                return Some(candidate);
            }
        }

        // Fallback: check PATH via `which` or standard command lookup
        if let Ok(path_var) = std::env::var("PATH") {
            for dir in std::env::split_paths(&path_var) {
                let candidate = dir.join(bin_name);
                if candidate.exists() && candidate.is_file() {
                    return Some(candidate);
                }
            }
        }

        None
    }

    /// Check for cookies.txt in user config directory (~/.config/sorafy/cookies.txt)
    pub fn find_cookie_file(&self) -> Option<PathBuf> {
        if let Some(config_dir) = dirs::config_dir() {
            let cookie_path = config_dir.join("sorafy").join("cookies.txt");
            if cookie_path.exists() && cookie_path.is_file() {
                return Some(cookie_path);
            }
        }
        None
    }

    /// Build standard yt-dlp arguments for audio extraction
    pub fn build_args(&self, video_id: &str) -> Vec<String> {
        let cookie_file = self.find_cookie_file();
        build_ytdlp_args(video_id, cookie_file.as_deref())
    }

    /// Resolve audio stream using local yt-dlp binary with 9-second timeout
    pub async fn resolve_ytdlp_stream(&self, video_id: &str) -> Option<RawStreamInfo> {
        if video_id.trim().is_empty() {
            return None;
        }

        let binary_path = self.find_ytdlp_binary()?;
        let args = self.build_args(video_id);

        let mut cmd = tokio::process::Command::new(binary_path);
        cmd.kill_on_drop(true);
        cmd.args(&args)
            .stdout(std::process::Stdio::piped())
            .stderr(std::process::Stdio::piped());

        let output_future = cmd.output();
        let timeout_duration = Duration::from_secs(YTDLP_TIMEOUT_SECS);

        match timeout(timeout_duration, output_future).await {
            Ok(Ok(output)) => {
                if !output.status.success() {
                    let err = String::from_utf8_lossy(&output.stderr);
                    eprintln!("[YtDlpExtractor] yt-dlp process returned non-zero status: {}", err);
                    return None;
                }
                let stdout = String::from_utf8_lossy(&output.stdout);
                parse_ytdlp_stdout(&stdout)
            }
            Ok(Err(e)) => {
                eprintln!("[YtDlpExtractor] Failed to execute yt-dlp: {}", e);
                None
            }
            Err(_) => {
                eprintln!("[YtDlpExtractor] yt-dlp execution timed out after {}s", YTDLP_TIMEOUT_SECS);
                None
            }
        }
    }

    /// Direct iOS InnerTube Player fallback (/youtubei/v1/player)
    pub async fn resolve_ios_innertube_stream(&self, video_id: &str) -> Option<RawStreamInfo> {
        if video_id.trim().is_empty() {
            return None;
        }

        let payload = build_ios_player_payload(video_id);
        let endpoints = [
            "https://music.youtube.com/youtubei/v1/player",
            "https://www.youtube.com/youtubei/v1/player",
        ];

        for endpoint in endpoints {
            let res = self
                .http_client
                .post(endpoint)
                .header(reqwest::header::USER_AGENT, IOS_USER_AGENT)
                .header(reqwest::header::CONTENT_TYPE, "application/json")
                .header("X-YouTube-Client-Name", "5")
                .header("X-YouTube-Client-Version", "21.03.3")
                .json(&payload)
                .send()
                .await;

            if let Ok(response) = res {
                if response.status().is_success() {
                    if let Ok(json) = response.json::<serde_json::Value>().await {
                        if let Some(info) = parse_ios_player_response(&json) {
                            return Some(info);
                        }
                    }
                }
            }
        }

        None
    }

    /// Resolve stream using cascade (yt-dlp first, then iOS InnerTube fallback)
    pub async fn resolve_stream(
        &self,
        video_id: &str,
        proxy: Option<&AudioProxy>,
    ) -> Result<ResolvedStreamPayload, DomainError> {
        self.resolve_stream_with_meta(video_id, None, None, proxy).await
    }

    /// Resolve stream with optional title and artist metadata, formatted with AudioProxy
    pub async fn resolve_stream_with_meta(
        &self,
        video_id: &str,
        title: Option<&str>,
        artist: Option<&str>,
        proxy: Option<&AudioProxy>,
    ) -> Result<ResolvedStreamPayload, DomainError> {
        if video_id.trim().is_empty() {
            return Err(DomainError::InvalidParameter("video_id cannot be empty".to_string()));
        }

        // 1. Try yt-dlp extraction
        let raw_stream = match self.resolve_ytdlp_stream(video_id).await {
            Some(info) => info,
            None => {
                // 2. Fall back to iOS InnerTube player endpoint
                match self.resolve_ios_innertube_stream(video_id).await {
                    Some(info) => info,
                    None => {
                        return Err(DomainError::StreamUnavailable(format!(
                            "Failed to resolve audio stream for video ID: {}",
                            video_id
                        )));
                    }
                }
            }
        };

        // 3. Format loopback URL through AudioProxy if provided
        let (url, proxied) = match proxy {
            Some(p) => (p.get_proxied_url(&raw_stream.raw_url), true),
            None => (raw_stream.raw_url.clone(), false),
        };

        Ok(ResolvedStreamPayload {
            url,
            raw_url: raw_stream.raw_url,
            video_id: video_id.to_string(),
            title: title.unwrap_or("Unknown Title").to_string(),
            artist: artist.unwrap_or("Unknown Artist").to_string(),
            duration_secs: raw_stream.duration_secs,
            bitrate: raw_stream.bitrate,
            mime_type: raw_stream.mime_type,
            provider: raw_stream.provider,
            audio_quality: "high".to_string(),
            proxied,
        })
    }
}

/// Build yt-dlp CLI arguments
pub fn build_ytdlp_args(video_id: &str, cookie_path: Option<&Path>) -> Vec<String> {
    let mut args = Vec::new();
    if let Some(cp) = cookie_path {
        args.push("--cookies".to_string());
        args.push(cp.to_string_lossy().to_string());
    }
    args.push("--print".to_string());
    args.push("%(duration)s".to_string());
    args.push("-g".to_string());
    args.push("-f".to_string());
    args.push("ba/b".to_string());
    args.push(format!("https://www.youtube.com/watch?v={}", video_id));
    args
}

/// Parse stdout from yt-dlp containing duration and direct Googlevideo playback URL
pub fn parse_ytdlp_stdout(stdout: &str) -> Option<RawStreamInfo> {
    let lines: Vec<&str> = stdout
        .lines()
        .map(|l| l.trim())
        .filter(|l| !l.is_empty())
        .collect();

    let mut raw_url: Option<String> = None;
    let mut duration_secs: u64 = 0;

    for line in lines {
        if line.starts_with("http://") || line.starts_with("https://") {
            raw_url = Some(line.to_string());
        } else if let Ok(dur) = line.parse::<u64>() {
            duration_secs = dur;
        }
    }

    raw_url.map(|url| RawStreamInfo {
        raw_url: url,
        duration_secs,
        bitrate: 160_000,
        mime_type: "audio/webm".to_string(),
        provider: "Opus HD".to_string(),
    })
}

/// Construct iOS player payload matching YouTube Music iOS client
pub fn build_ios_player_payload(video_id: &str) -> serde_json::Value {
    serde_json::json!({
        "context": {
            "client": {
                "clientName": "IOS",
                "clientVersion": "21.03.3",
                "osName": "iPadOS",
                "osVersion": "17.7.10.21H450",
                "deviceMake": "Apple",
                "deviceModel": "iPad7,6",
                "hl": "id",
                "gl": "ID"
            }
        },
        "videoId": video_id
    })
}

/// Parse /youtubei/v1/player JSON response and select the best audio stream
pub fn parse_ios_player_response(json: &serde_json::Value) -> Option<RawStreamInfo> {
    let formats = json
        .get("streamingData")?
        .get("adaptiveFormats")?
        .as_array()?;

    // Filter audio formats that contain a direct URL
    let audio_formats: Vec<&serde_json::Value> = formats
        .iter()
        .filter(|f| {
            let mime = f.get("mimeType").and_then(|m| m.as_str()).unwrap_or("");
            let has_url = f.get("url").and_then(|u| u.as_str()).is_some();
            mime.contains("audio") && has_url
        })
        .collect();

    if audio_formats.is_empty() {
        return None;
    }

    // Prefer itag 140 (128kbps AAC) or itag 251 (160kbps Opus), or highest bitrate
    let chosen = audio_formats
        .iter()
        .find(|f| f.get("itag").and_then(|i| i.as_i64()) == Some(140))
        .or_else(|| {
            audio_formats
                .iter()
                .find(|f| f.get("itag").and_then(|i| i.as_i64()) == Some(251))
        })
        .or_else(|| {
            audio_formats.iter().max_by_key(|f| {
                f.get("bitrate").and_then(|b| b.as_u64()).unwrap_or(0)
            })
        })
        .unwrap_or(&audio_formats[0]);

    let raw_url = chosen.get("url")?.as_str()?.to_string();
    let bitrate = chosen
        .get("bitrate")
        .and_then(|b| b.as_u64())
        .unwrap_or(160_000) as u32;
    let mime_type = chosen
        .get("mimeType")
        .and_then(|m| m.as_str())
        .unwrap_or("audio/mp4")
        .to_string();

    let duration_secs = json
        .get("videoDetails")
        .and_then(|vd| vd.get("lengthSeconds"))
        .and_then(|ls| {
            ls.as_str()
                .and_then(|s| s.parse::<u64>().ok())
                .or_else(|| ls.as_u64())
        })
        .unwrap_or(0);

    Some(RawStreamInfo {
        raw_url,
        duration_secs,
        bitrate,
        mime_type,
        provider: "SoraFy HD Stream".to_string(),
    })
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_build_ytdlp_args_without_cookie() {
        let args = build_ytdlp_args("abc1234", None);
        assert_eq!(
            args,
            vec![
                "--print",
                "%(duration)s",
                "-g",
                "-f",
                "ba/b",
                "https://www.youtube.com/watch?v=abc1234"
            ]
        );
    }

    #[test]
    fn test_build_ytdlp_args_with_cookie() {
        let cookie_path = Path::new("/custom/cookies.txt");
        let args = build_ytdlp_args("xyz789", Some(cookie_path));
        assert_eq!(
            args,
            vec![
                "--cookies",
                "/custom/cookies.txt",
                "--print",
                "%(duration)s",
                "-g",
                "-f",
                "ba/b",
                "https://www.youtube.com/watch?v=xyz789"
            ]
        );
    }

    #[test]
    fn test_parse_ytdlp_stdout_duration_first() {
        let stdout = "214\nhttps://rr1---sn-xxx.googlevideo.com/videoplayback?expire=123&id=abc\n";
        let info = parse_ytdlp_stdout(stdout).expect("Failed to parse stdout");
        assert_eq!(info.duration_secs, 214);
        assert_eq!(
            info.raw_url,
            "https://rr1---sn-xxx.googlevideo.com/videoplayback?expire=123&id=abc"
        );
        assert_eq!(info.bitrate, 160_000);
        assert_eq!(info.mime_type, "audio/webm");
        assert_eq!(info.provider, "Opus HD");
    }

    #[test]
    fn test_parse_ytdlp_stdout_url_first() {
        let stdout = "https://rr2---sn-yyy.googlevideo.com/videoplayback?id=def\n185\n";
        let info = parse_ytdlp_stdout(stdout).expect("Failed to parse stdout");
        assert_eq!(info.duration_secs, 185);
        assert_eq!(
            info.raw_url,
            "https://rr2---sn-yyy.googlevideo.com/videoplayback?id=def"
        );
    }

    #[test]
    fn test_parse_ytdlp_stdout_empty_or_invalid() {
        assert!(parse_ytdlp_stdout("").is_none());
        assert!(parse_ytdlp_stdout("ERROR: Video not found").is_none());
        assert!(parse_ytdlp_stdout("240\n").is_none());
    }

    #[test]
    fn test_build_ios_player_payload() {
        let payload = build_ios_player_payload("vid123");
        let client = &payload["context"]["client"];
        assert_eq!(client["clientName"], "IOS");
        assert_eq!(client["clientVersion"], "21.03.3");
        assert_eq!(client["deviceModel"], "iPad7,6");
        assert_eq!(client["deviceMake"], "Apple");
        assert_eq!(payload["videoId"], "vid123");
    }

    #[test]
    fn test_parse_ios_player_response_selection() {
        let json = serde_json::json!({
            "videoDetails": {
                "videoId": "test123",
                "lengthSeconds": "195"
            },
            "streamingData": {
                "adaptiveFormats": [
                    {
                        "itag": 249,
                        "mimeType": "audio/webm; codecs=\"opus\"",
                        "bitrate": 50000,
                        "url": "https://googlevideo.com/playback_249"
                    },
                    {
                        "itag": 140,
                        "mimeType": "audio/mp4; codecs=\"mp4a.40.2\"",
                        "bitrate": 128000,
                        "url": "https://googlevideo.com/playback_140"
                    },
                    {
                        "itag": 251,
                        "mimeType": "audio/webm; codecs=\"opus\"",
                        "bitrate": 160000,
                        "url": "https://googlevideo.com/playback_251"
                    }
                ]
            }
        });

        let info = parse_ios_player_response(&json).expect("should parse adaptiveFormats");
        // itag 140 is preferred first
        assert_eq!(info.raw_url, "https://googlevideo.com/playback_140");
        assert_eq!(info.duration_secs, 195);
        assert_eq!(info.bitrate, 128000);
        assert_eq!(info.provider, "SoraFy HD Stream");
    }

    #[tokio::test]
    async fn test_resolve_stream_formatting_with_proxy() {
        let extractor = YtDlpExtractor::new();
        let proxy = AudioProxy::new_with_port(45892);

        // Test with raw stream simulated by formatting
        let raw_url = "https://rr1---sn-xxx.googlevideo.com/videoplayback?id=mock123";
        let proxied_url = proxy.get_proxied_url(raw_url);
        assert!(proxied_url.starts_with("http://127.0.0.1:45892/stream?url="));

        // Empty video ID validation
        let res = extractor.resolve_stream("", Some(&proxy)).await;
        assert!(res.is_err());
    }

    #[test]
    fn test_find_ytdlp_binary_candidate_inspection() {
        let extractor = YtDlpExtractor::new();
        // find_ytdlp_binary should run without panicking
        let _ = extractor.find_ytdlp_binary();
    }
}
