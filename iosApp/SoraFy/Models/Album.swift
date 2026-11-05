import Foundation

public struct Album: Identifiable, Codable, Hashable {
    public let id: String
    public let title: String
    public let artistName: String
    public var year: String
    public var coverUrl: String
    public var tracks: [Track]

    public init(
        id: String,
        title: String,
        artistName: String,
        year: String = "",
        coverUrl: String = "",
        tracks: [Track] = []
    ) {
        self.id = id
        self.title = title
        self.artistName = artistName
        self.year = year
        self.coverUrl = coverUrl
        self.tracks = tracks
    }
}
