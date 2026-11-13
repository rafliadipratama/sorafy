import Foundation

public final class MusicStreamSource {
    public static let shared = MusicStreamSource()

    private let session: URLSession
    private var visitorDataCache: String?
    private var streamCache: [String: (url: String, expire: Date)] = [:]

    public init(session: URLSession = .shared) {
        self.session = session
    }

    // MARK: - InnerTube Search (YouTube Music)
    public func searchYouTubeMusic(query: String) async -> [Track] {
        guard let url = URL(string: "https://music.youtube.com/youtubei/v1/search") else { return [] }

        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.setValue("Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15", forHTTPHeaderField: "User-Agent")

        let payload: [String: Any] = [
            "query": query.trimmingCharacters(in: .whitespacesAndNewlines),
            "params": "EgWKAQIIAWoKEAkQBRAKEAMQBw%3D%3D", // Songs only
            "context": [
                "client": [
                    "clientName": "WEB_REMIX",
                    "clientVersion": "1.20240318.01.00",
                    "hl": "id",
                    "gl": "ID"
                ]
            ]
        ]

        guard let httpBody = try? JSONSerialization.data(withJSONObject: payload) else {
            return []
        }
        request.httpBody = httpBody

        do {
            let (data, response) = try await session.data(for: request)
            guard let httpResponse = response as? HTTPURLResponse, httpResponse.statusCode == 200 else {
                return []
            }
            guard let json = try JSONSerialization.jsonObject(with: data) as? [String: Any] else {
                return []
            }
            return parseSearchResults(json: json)
        } catch {
            return []
        }
    }

    private func parseSearchResults(json: [String: Any]) -> [Track] {
        var tracks: [Track] = []
        guard let contents = json["contents"] as? [String: Any],
              let tabbed = contents["tabbedSearchResultsRenderer"] as? [String: Any],
              let tabs = tabbed["tabs"] as? [[String: Any]],
              let firstTab = tabs.first,
              let tabRenderer = firstTab["tabRenderer"] as? [String: Any],
              let tabContent = tabRenderer["content"] as? [String: Any],
              let sectionList = tabContent["sectionListRenderer"] as? [String: Any],
              let sectionContents = sectionList["contents"] as? [[String: Any]] else {
            return []
        }

        for sec in sectionContents {
            guard let shelf = sec["musicShelfRenderer"] as? [String: Any],
                  let items = shelf["contents"] as? [[String: Any]] else {
                continue
            }

            for itemWrapper in items {
                guard let item = itemWrapper["musicResponsiveListItemRenderer"] as? [String: Any],
                  let cols = item["flexColumns"] as? [[String: Any]],
                  cols.count >= 2 else { continue }

                // Title
                guard let col0 = cols[0]["musicResponsiveListItemFlexColumnRenderer"] as? [String: Any],
                      let textObj0 = col0["text"] as? [String: Any],
                      let runs0 = textObj0["runs"] as? [[String: Any]],
                      let title = runs0.first?["text"] as? String, !title.isEmpty else {
                    continue
                }

                // Subtitle (Artist, Album, Duration)
                guard let col1 = cols[1]["musicResponsiveListItemFlexColumnRenderer"] as? [String: Any],
                      let textObj1 = col1["text"] as? [String: Any],
                      let runs1 = textObj1["runs"] as? [[String: Any]] else {
                    continue
                }

                let artistName = runs1.first?["text"] as? String ?? "Artis"

                var albumTitle: String? = nil
                if runs1.count > 2 {
                    albumTitle = runs1[2]["text"] as? String
                }

                let durStr = runs1.last?["text"] as? String ?? "0:00"
                let durSec = parseDurationToSeconds(durStr)

                // Video ID & Artwork
                var videoId = ""
                if let playlistItemData = item["playlistItemData"] as? [String: Any] {
                    videoId = playlistItemData["videoId"] as? String ?? ""
                }

                var artworkUrl = ""
                if let thumbRenderer = item["thumbnail"] as? [String: Any],
                   let musicThumb = thumbRenderer["musicThumbnailRenderer"] as? [String: Any],
                   let thumb = musicThumb["thumbnail"] as? [String: Any],
                   let thumbs = thumb["thumbnails"] as? [[String: Any]],
                   let lastThumb = thumbs.last {
                    artworkUrl = lastThumb["url"] as? String ?? ""
                    if artworkUrl.contains("w120-h120") {
                        artworkUrl = artworkUrl.replacingOccurrences(of: "w120-h120", with: "w544-h544")
                    }
                }

                let artist = Artist(id: "art_\(artistName)", name: artistName)
                let track = Track(
                    id: videoId.isEmpty ? UUID().uuidString : videoId,
                    title: title,
                    artist: artist,
                    albumTitle: albumTitle,
                    durationSec: durSec,
                    audioUrl: "",
                    coverUrl: artworkUrl,
                    sourceLabel: "YouTube Music"
                )
                tracks.append(track)
            }
        }
        return tracks
    }

    // MARK: - Direct Audio Stream Resolution (VISIONOS & iOS InnerTube RPC)
    public func resolveAudioStream(videoId: String) async -> String? {
        let cleanVid = videoId.replacingOccurrences(of: "yt:", with: "")
            .replacingOccurrences(of: "yt_", with: "")
            .trimmingCharacters(in: .whitespacesAndNewlines)

        if let cached = streamCache[cleanVid], cached.expire > Date() {
            return cached.url
        }

        guard let url = URL(string: "https://music.youtube.com/youtubei/v1/player") else { return nil }

        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.setValue("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Safari/605.1.15", forHTTPHeaderField: "User-Agent")

        let payload: [String: Any] = [
            "videoId": cleanVid,
            "context": [
                "client": [
                    "clientName": "VISIONOS",
                    "clientVersion": "0.1",
                    "osName": "visionOS",
                    "osVersion": "1.3.21O771",
                    "deviceMake": "Apple",
                    "deviceModel": "RealityDevice14,1",
                    "hl": "id",
                    "gl": "ID"
                ]
            ]
        ]

        guard let httpBody = try? JSONSerialization.data(withJSONObject: payload) else {
            return nil
        }
        request.httpBody = httpBody

        let streamingData: [String: Any]
        do {
            let (data, response) = try await session.data(for: request)
            guard let httpResponse = response as? HTTPURLResponse, httpResponse.statusCode == 200 else {
                return nil
            }
            guard let json = try JSONSerialization.jsonObject(with: data) as? [String: Any],
                  let parsedStreamingData = json["streamingData"] as? [String: Any] else {
                return nil
            }
            streamingData = parsedStreamingData
        } catch {
            return nil
        }

        var candidateUrl: String? = nil
        if let adaptiveFormats = streamingData["adaptiveFormats"] as? [[String: Any]] {
            // Find highest quality audio format (prefer AAC/m4a itag 140 or Opus itag 251)
            let audioOnly = adaptiveFormats.filter {
                let mime = $0["mimeType"] as? String ?? ""
                return mime.contains("audio/")
            }
            // For iOS native AVPlayer, AAC (mp4a / itag 140) plays natively with HW decoding
            if let aac = audioOnly.first(where: { ($0["mimeType"] as? String ?? "").contains("mp4a") }),
               let streamUrl = aac["url"] as? String {
                candidateUrl = streamUrl
            } else if let best = audioOnly.first, let streamUrl = best["url"] as? String {
                candidateUrl = streamUrl
            }
        }

        if let candidateUrl = candidateUrl {
            streamCache[cleanVid] = (url: candidateUrl, expire: Date().addingTimeInterval(3600))
            return candidateUrl
        }
        return nil
    }

    // MARK: - Explore / Home Recommendations
    public func fetchExploreHome() async -> ExploreHomeData {
        // Fetch trending top songs
        let trending = await searchYouTubeMusic(query: "Top 50 Indonesia Lagu Terpopuler")
        return ExploreHomeData(
            trendingTracks: trending,
            newReleases: [],
            popularArtists: [],
            communityPlaylists: [],
            musicVideos: []
        )
    }

    // MARK: - Song Radio
    public func fetchSongRadio(track: Track) async -> [Track] {
        var radioTracks: [Track] = []

        // Pass 1: Seed track radio mix
        let query1 = "\(track.artist.name) \(track.cleanTitle) radio mix"
        let results1 = await searchYouTubeMusic(query: query1)
        for cand in results1 {
            if cand.id != track.id && !radioTracks.contains(where: { $0.id == cand.id }) {
                radioTracks.append(cand)
            }
        }

        // Pass 2: Artist hits if queue needs more tracks
        if radioTracks.count < 12 {
            let query2 = "\(track.artist.name) hits"
            let results2 = await searchYouTubeMusic(query: query2)
            for cand in results2 {
                if cand.id != track.id && !radioTracks.contains(where: { $0.id == cand.id }) {
                    radioTracks.append(cand)
                }
            }
        }

        // Pass 3: Search seeds from culture cluster if still small
        let culture = MusifyAutomixEngine.detectCulture(artist: track.artist.name, title: track.title)
        if radioTracks.count < 10, let seedQuery = culture.searchSeeds.randomElement() {
            let results3 = await searchYouTubeMusic(query: seedQuery)
            for cand in results3 {
                if cand.id != track.id && !radioTracks.contains(where: { $0.id == cand.id }) {
                    radioTracks.append(cand)
                }
            }
        }

        return radioTracks
    }

    private func parseDurationToSeconds(_ str: String) -> Int {
        let parts = str.split(separator: ":").compactMap { Int($0) }
        if parts.count == 2 {
            return parts[0] * 60 + parts[1]
        } else if parts.count == 3 {
            return parts[0] * 3600 + parts[1] * 60 + parts[2]
        }
        return 0
    }
}
