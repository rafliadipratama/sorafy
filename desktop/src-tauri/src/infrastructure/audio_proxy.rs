use std::time::Duration;
use tokio::io::{AsyncReadExt, AsyncWriteExt};
use tokio::net::TcpListener;

const IOS_USER_AGENT: &str = "com.google.ios.youtube/21.03.3 (iPad7,6; U; CPU iPadOS 17_7_10 like Mac OS X; en-US)";
const DESKTOP_USER_AGENT: &str = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36";

const QUERY_VALUE_ENCODE_SET: &percent_encoding::AsciiSet = &percent_encoding::NON_ALPHANUMERIC
    .remove(b'-')
    .remove(b'_')
    .remove(b'.')
    .remove(b'~');

#[derive(Debug, Clone)]
pub struct AudioProxy {
    port: u16,
}

impl AudioProxy {
    /// Start the Tokio local audio proxy listening on an ephemeral loopback port
    pub async fn start() -> Result<Self, std::io::Error> {
        let listener = TcpListener::bind("127.0.0.1:0").await?;
        let port = listener.local_addr()?.port();
        let client = reqwest::Client::builder()
            .danger_accept_invalid_certs(false)
            .tcp_nodelay(true)
            .pool_max_idle_per_host(16)
            .pool_idle_timeout(Duration::from_secs(90))
            .build()
            .unwrap_or_else(|_| reqwest::Client::new());

        tokio::spawn(async move {
            run_server_loop(listener, client).await;
        });

        Ok(Self { port })
    }

    /// Alias for start()
    pub async fn new() -> Result<Self, std::io::Error> {
        Self::start().await
    }

    /// Synchronously bind to an ephemeral port and spawn Tokio background loop if runtime is active
    pub fn bind_sync() -> Result<Self, std::io::Error> {
        let std_listener = std::net::TcpListener::bind("127.0.0.1:0")?;
        std_listener.set_nonblocking(true)?;
        let port = std_listener.local_addr()?.port();

        if let Ok(handle) = tokio::runtime::Handle::try_current() {
            if let Ok(tokio_listener) = TcpListener::from_std(std_listener) {
                let client = reqwest::Client::builder()
                    .danger_accept_invalid_certs(false)
                    .tcp_nodelay(true)
                    .pool_max_idle_per_host(16)
                    .pool_idle_timeout(Duration::from_secs(90))
                    .build()
                    .unwrap_or_else(|_| reqwest::Client::new());

                handle.spawn(async move {
                    run_server_loop(tokio_listener, client).await;
                });
            }
        }

        Ok(Self { port })
    }

    /// Create an AudioProxy instance with a predetermined port
    pub fn new_with_port(port: u16) -> Self {
        Self { port }
    }

    /// Returns the local port the proxy is bound to
    pub fn port(&self) -> u16 {
        self.port
    }

    /// Formats a target audio URL into a proxied loopback URL with CORS headers
    pub fn get_proxied_url(&self, target_url: &str) -> String {
        let encoded = percent_encoding::utf8_percent_encode(target_url, QUERY_VALUE_ENCODE_SET);
        format!("http://127.0.0.1:{}/stream?url={}", self.port, encoded)
    }
}

async fn run_server_loop(listener: TcpListener, client: reqwest::Client) {
    loop {
        match listener.accept().await {
            Ok((stream, _peer_addr)) => {
                let client = client.clone();
                tokio::spawn(async move {
                    if let Err(e) = handle_client_connection(stream, client).await {
                        // Connection resets or client aborts are normal during audio scrubbing
                        let msg = e.to_string();
                        if !msg.contains("Broken pipe") && !msg.contains("Connection reset") {
                            eprintln!("[AudioProxy] Client connection note: {}", msg);
                        }
                    }
                });
            }
            Err(e) => {
                eprintln!("[AudioProxy] Accept loop terminated: {}", e);
                break;
            }
        }
    }
}

async fn handle_client_connection(
    mut stream: tokio::net::TcpStream,
    client: reqwest::Client,
) -> Result<(), Box<dyn std::error::Error + Send + Sync>> {
    let _ = stream.set_nodelay(true);

    let mut buf = [0u8; 4096];
    let mut bytes_read = 0;

    loop {
        let n = stream.read(&mut buf[bytes_read..]).await?;
        if n == 0 {
            return Ok(());
        }
        bytes_read += n;
        if buf[..bytes_read].windows(4).any(|w| w == b"\r\n\r\n")
            || buf[..bytes_read].windows(2).any(|w| w == b"\n\n")
            || bytes_read == buf.len()
        {
            break;
        }
    }

    let mut headers = [httparse::EMPTY_HEADER; 32];
    let mut req = httparse::Request::new(&mut headers);
    if req.parse(&buf[..bytes_read]).is_err() {
        return Ok(());
    }

    let method = req.method.unwrap_or("GET");
    let path = req.path.unwrap_or("/");

    // 1. Handle OPTIONS preflight request
    if method.eq_ignore_ascii_case("OPTIONS") {
        let cors_resp = b"HTTP/1.1 204 No Content\r\n\
Access-Control-Allow-Origin: *\r\n\
Access-Control-Allow-Methods: GET, HEAD, OPTIONS\r\n\
Access-Control-Allow-Headers: Range, Content-Type, Accept, Authorization, *\r\n\
Access-Control-Expose-Headers: Content-Range, Content-Length, Accept-Ranges\r\n\
Access-Control-Max-Age: 86400\r\n\
Accept-Ranges: bytes\r\n\
Content-Length: 0\r\n\
Connection: close\r\n\
\r\n";
        stream.write_all(cors_resp).await?;
        stream.flush().await?;
        return Ok(());
    }

    // 2. Parse query parameters
    let parsed_url = match url::Url::parse(&format!("http://127.0.0.1{}", path)) {
        Ok(u) => u,
        Err(_) => {
            let resp = b"HTTP/1.1 400 Bad Request\r\n\
Access-Control-Allow-Origin: *\r\n\
Content-Type: text/plain\r\n\
Content-Length: 11\r\n\
Connection: close\r\n\
\r\n\
Invalid URL";
            stream.write_all(resp).await?;
            stream.flush().await?;
            return Ok(());
        }
    };

    if parsed_url.path() != "/stream" {
        let resp = b"HTTP/1.1 404 Not Found\r\n\
Access-Control-Allow-Origin: *\r\n\
Content-Length: 0\r\n\
Connection: close\r\n\
\r\n";
        stream.write_all(resp).await?;
        stream.flush().await?;
        return Ok(());
    }

    let target_url = parsed_url
        .query_pairs()
        .find(|(k, _)| k == "url")
        .map(|(_, v)| v.into_owned());

    let target_url = match target_url {
        Some(u) if !u.trim().is_empty() => u,
        _ => {
            let resp = b"HTTP/1.1 400 Bad Request\r\n\
Access-Control-Allow-Origin: *\r\n\
Content-Type: text/plain\r\n\
Content-Length: 18\r\n\
Connection: close\r\n\
\r\n\
Missing target url";
            stream.write_all(resp).await?;
            stream.flush().await?;
            return Ok(());
        }
    };

    // 3. Extract incoming Range header
    let mut range_header = None;
    for h in req.headers.iter() {
        if h.name.eq_ignore_ascii_case("range") {
            if let Ok(val) = std::str::from_utf8(h.value) {
                range_header = Some(val.to_string());
            }
            break;
        }
    }

    // 4. Send request to upstream media server
    let is_ios = target_url.contains("c=IOS") || target_url.contains("c=ios");
    let user_agent = if is_ios {
        IOS_USER_AGENT
    } else {
        DESKTOP_USER_AGENT
    };

    let mut upstream_req = if method.eq_ignore_ascii_case("HEAD") {
        client.head(&target_url)
    } else {
        client.get(&target_url)
    };

    upstream_req = upstream_req.header("User-Agent", user_agent);
    if let Some(ref range) = range_header {
        upstream_req = upstream_req.header("Range", range);
    }

    let upstream_resp = match upstream_req.send().await {
        Ok(res) => res,
        Err(err) => {
            eprintln!("[AudioProxy] Upstream request error for {}: {}", target_url, err);
            let resp = b"HTTP/1.1 502 Bad Gateway\r\n\
Access-Control-Allow-Origin: *\r\n\
Content-Length: 0\r\n\
Connection: close\r\n\
\r\n";
            stream.write_all(resp).await?;
            stream.flush().await?;
            return Ok(());
        }
    };

    let status = upstream_resp.status();
    let upstream_headers = upstream_resp.headers();

    let raw_content_type = upstream_headers
        .get(reqwest::header::CONTENT_TYPE)
        .and_then(|v| v.to_str().ok())
        .unwrap_or("");

    let content_type = if target_url.contains("mime=audio%2Fwebm")
        || target_url.contains("mime=audio/webm")
        || target_url.contains(".webm")
        || raw_content_type.contains("audio/webm")
        || raw_content_type.contains("opus")
    {
        "audio/webm"
    } else if target_url.contains("mime=audio%2Fmp4")
        || target_url.contains("mime=audio/mp4")
        || target_url.contains(".m4a")
        || target_url.contains(".mp4")
        || raw_content_type.contains("audio/mp4")
        || raw_content_type.contains("aac")
    {
        "audio/mp4"
    } else if target_url.contains(".flac") || raw_content_type.contains("audio/flac") || target_url.contains("monochrome.st") {
        "audio/flac"
    } else if target_url.contains(".mp3") || raw_content_type.contains("audio/mpeg") {
        "audio/mpeg"
    } else if !raw_content_type.is_empty() && !raw_content_type.contains("octet-stream") {
        raw_content_type
    } else {
        "audio/mp4"
    };

    let content_range = upstream_headers
        .get(reqwest::header::CONTENT_RANGE)
        .and_then(|v| v.to_str().ok());

    let content_length = upstream_headers
        .get(reqwest::header::CONTENT_LENGTH)
        .and_then(|v| v.to_str().ok());

    let mut resp_header = format!(
        "HTTP/1.1 {} {}\r\n\
Access-Control-Allow-Origin: *\r\n\
Access-Control-Allow-Methods: GET, HEAD, OPTIONS\r\n\
Access-Control-Allow-Headers: Range, Content-Type, Accept, Authorization, *\r\n\
Access-Control-Expose-Headers: Content-Range, Content-Length, Accept-Ranges\r\n\
Accept-Ranges: bytes\r\n\
Content-Type: {}\r\n",
        status.as_u16(),
        status.canonical_reason().unwrap_or("OK"),
        content_type
    );

    if let Some(cr) = content_range {
        resp_header.push_str(&format!("Content-Range: {}\r\n", cr));
    }
    if let Some(cl) = content_length {
        resp_header.push_str(&format!("Content-Length: {}\r\n", cl));
    }
    resp_header.push_str("Connection: close\r\n\r\n");

    // 5. Stream body chunks for GET requests with 64KB buffering
    if !method.eq_ignore_ascii_case("HEAD") {
        let mut writer = tokio::io::BufWriter::with_capacity(64 * 1024, stream);
        writer.write_all(resp_header.as_bytes()).await?;

        let mut body_res = upstream_resp;
        while let Ok(Some(chunk)) = body_res.chunk().await {
            if writer.write_all(&chunk).await.is_err() {
                // Client aborted or closed socket early
                break;
            }
        }
        let _ = writer.flush().await;
    } else {
        stream.write_all(resp_header.as_bytes()).await?;
        let _ = stream.flush().await;
    }

    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;
    use tokio::io::{AsyncReadExt, AsyncWriteExt};
    use tokio::net::TcpStream;

    #[tokio::test]
    async fn test_proxy_start_and_bound_port() {
        let proxy = AudioProxy::start().await.expect("Failed to start AudioProxy");
        assert!(proxy.port() > 0, "Bound port must be greater than 0");
    }

    #[tokio::test]
    async fn test_get_proxied_url_formatting() {
        let proxy = AudioProxy::start().await.expect("Failed to start AudioProxy");
        let target = "https://rr1---sn-xxx.googlevideo.com/videoplayback?expire=123&id=abc";
        let proxied = proxy.get_proxied_url(target);

        assert!(
            proxied.starts_with(&format!("http://127.0.0.1:{}/stream?url=", proxy.port())),
            "Must start with local stream endpoint"
        );
        assert!(
            proxied.contains("videoplayback%3Fexpire%3D123%26id%3Dabc"),
            "Must contain encoded query parameters"
        );
    }

    #[tokio::test]
    async fn test_options_preflight_cors_headers() {
        let proxy = AudioProxy::start().await.expect("Failed to start AudioProxy");
        let mut client = TcpStream::connect(format!("127.0.0.1:{}", proxy.port()))
            .await
            .expect("Failed to connect to proxy");

        let request = format!(
            "OPTIONS /stream?url=https%3A%2F%2Fexample.com HTTP/1.1\r\nHost: 127.0.0.1:{}\r\n\r\n",
            proxy.port()
        );
        client.write_all(request.as_bytes()).await.expect("write");

        let mut buf = vec![0u8; 1024];
        let n = client.read(&mut buf).await.expect("read");
        let response = String::from_utf8_lossy(&buf[..n]);

        assert!(
            response.contains("204 No Content") || response.contains("200 OK"),
            "Response should be 204 or 200: {}",
            response
        );
        assert!(
            response.to_lowercase().contains("access-control-allow-origin: *"),
            "Missing Access-Control-Allow-Origin: {}",
            response
        );
        assert!(
            response
                .to_lowercase()
                .contains("access-control-allow-methods: get, head, options"),
            "Missing Access-Control-Allow-Methods: {}",
            response
        );
        assert!(
            response.to_lowercase().contains("accept-ranges: bytes"),
            "Missing Accept-Ranges: {}",
            response
        );
    }

    #[tokio::test]
    async fn test_missing_url_parameter_returns_400() {
        let proxy = AudioProxy::start().await.expect("Failed to start AudioProxy");
        let mut client = TcpStream::connect(format!("127.0.0.1:{}", proxy.port()))
            .await
            .expect("Failed to connect to proxy");

        let request = format!(
            "GET /stream HTTP/1.1\r\nHost: 127.0.0.1:{}\r\n\r\n",
            proxy.port()
        );
        client.write_all(request.as_bytes()).await.expect("write");

        let mut buf = vec![0u8; 1024];
        let n = client.read(&mut buf).await.expect("read");
        let response = String::from_utf8_lossy(&buf[..n]);

        assert!(
            response.contains("400 Bad Request"),
            "Response should be 400 Bad Request: {}",
            response
        );
        assert!(
            response.to_lowercase().contains("access-control-allow-origin: *"),
            "Missing Access-Control-Allow-Origin: {}",
            response
        );
    }
}
