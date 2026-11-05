import Foundation

public struct Playlist: Identifiable, Codable, Hashable {
    public let id: String
    public var title: String
    public var descriptionText: String
    public var coverUrl: String
    public var trackCount: Int
    public var tracks: [Track]

    public init(
        id: String,
        title: String,
        descriptionText: String = "",
        coverUrl: String = "",
        trackCount: Int = 0,
        tracks: [Track] = []
    ) {
        self.id = id
        self.title = title
        self.descriptionText = descriptionText
        self.coverUrl = coverUrl
        self.trackCount = trackCount
        self.tracks = tracks
    }
}
