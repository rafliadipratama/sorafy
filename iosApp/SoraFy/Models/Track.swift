import Foundation

public struct Artist: Identifiable, Codable, Hashable {
    public let id: String
    public let name: String
    public var avatarUrl: String?
    public var bannerUrl: String?
    public var isVerified: Bool

    public init(
        id: String,
        name: String,
        avatarUrl: String? = nil,
        bannerUrl: String? = nil,
        isVerified: Bool = true
    ) {
        self.id = id
        self.name = name
        self.avatarUrl = avatarUrl
        self.bannerUrl = bannerUrl
        self.isVerified = isVerified
    }
}

public struct Track: Identifiable, Codable, Hashable {
    public let id: String
    public let title: String
    public let artist: Artist
    public var albumTitle: String?
    public var durationSec: Int
    public var audioUrl: String
    public var coverUrl: String
    public var isLiked: Bool
    public var isVerified: Bool
    public var isDownloaded: Bool
    public var fileSizeBytes: Int64
    public var playCount: String?
    public var sourceLabel: String
    public var featuredArtists: [String]
    public var isVideo: Bool

    public init(
        id: String,
        title: String,
        artist: Artist,
        albumTitle: String? = nil,
        durationSec: Int = 0,
        audioUrl: String = "",
        coverUrl: String = "",
        isLiked: Bool = false,
        isVerified: Bool = true,
        isDownloaded: Bool = false,
        fileSizeBytes: Int64 = 0,
        playCount: String? = nil,
        sourceLabel: String = "Lagu Resmi",
        featuredArtists: [String] = [],
        isVideo: Bool = false
    ) {
        self.id = id
        self.title = title
        self.artist = artist
        self.albumTitle = albumTitle
        self.durationSec = durationSec
        self.audioUrl = audioUrl
        self.coverUrl = coverUrl
        self.isLiked = isLiked
        self.isVerified = isVerified
        self.isDownloaded = isDownloaded
        self.fileSizeBytes = fileSizeBytes
        self.playCount = playCount
        self.sourceLabel = sourceLabel
        self.featuredArtists = featuredArtists
        self.isVideo = isVideo
    }

    public var durationFormatted: String {
        let mins = durationSec / 60
        let secs = durationSec % 60
        return String(format: "%02d:%02d", mins, secs)
    }

    public var fileSizeFormatted: String {
        guard fileSizeBytes > 0 else { return "" }
        let mb = Double(fileSizeBytes) / (1024.0 * 1024.0)
        return String(format: "%.1f MB", mb)
    }

    public var cleanTitle: String {
        let pattern = "\\s*[({\\[]\\s*(?:official\\s*(?:music\\s*)?video|video\\s*musik|music\\s*video|official\\s*audio|lyric\\s*video|audio|mv|m/v|4k|hd|live|visualizer|lirik)\\s*[)}\\]]"
        guard let regex = try? NSRegularExpression(pattern: pattern, options: .caseInsensitive) else {
            return title
        }
        let range = NSRange(location: 0, length: title.utf16.count)
        let cleaned = regex.stringByReplacingMatches(in: title, options: [], range: range, withTemplate: "")
            .trimmingCharacters(in: .whitespacesAndNewlines)
        return cleaned.isEmpty ? title : cleaned
    }

    public var fullArtistDisplay: String {
        if !featuredArtists.isEmpty {
            return "\(artist.name), \(featuredArtists.joined(separator: ", "))"
        }
        return artist.name
    }
}
