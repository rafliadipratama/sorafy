import Foundation

public struct SyllableWord: Codable, Hashable {
    public let word: String
    public let startMs: Int64
    public let endMs: Int64

    public init(word: String, startMs: Int64, endMs: Int64) {
        self.word = word
        self.startMs = startMs
        self.endMs = endMs
    }
}

public struct LyricLine: Identifiable, Codable, Hashable {
    public var id: String { "\(timestampMs)_\(text)" }
    public let timestampMs: Int64
    public let text: String
    public var words: [SyllableWord]
    public var translation: String?

    public init(
        timestampMs: Int64,
        text: String,
        words: [SyllableWord] = [],
        translation: String? = nil
    ) {
        self.timestampMs = timestampMs
        self.text = text
        self.words = words
        self.translation = translation
    }
}

public struct Lyrics: Codable, Hashable {
    public var plainLyrics: String?
    public var syncedLyrics: [LyricLine]

    public init(
        plainLyrics: String? = nil,
        syncedLyrics: [LyricLine] = []
    ) {
        self.plainLyrics = plainLyrics
        self.syncedLyrics = syncedLyrics
    }

    public var hasSyncedLyrics: Bool {
        !syncedLyrics.isEmpty
    }
}
