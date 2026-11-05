import Foundation

public struct SearchAllResults: Codable, Hashable {
    public var tracks: [Track]
    public var artists: [Artist]
    public var albums: [Album]
    public var videos: [Track]

    public init(
        tracks: [Track] = [],
        artists: [Artist] = [],
        albums: [Album] = [],
        videos: [Track] = []
    ) {
        self.tracks = tracks
        self.artists = artists
        self.albums = albums
        self.videos = videos
    }
}

public struct ExploreHomeData: Codable, Hashable {
    public var trendingTracks: [Track]
    public var newReleases: [Album]
    public var popularArtists: [Artist]
    public var communityPlaylists: [Playlist]
    public var musicVideos: [Track]

    public init(
        trendingTracks: [Track] = [],
        newReleases: [Album] = [],
        popularArtists: [Artist] = [],
        communityPlaylists: [Playlist] = [],
        musicVideos: [Track] = []
    ) {
        self.trendingTracks = trendingTracks
        self.newReleases = newReleases
        self.popularArtists = popularArtists
        self.communityPlaylists = communityPlaylists
        self.musicVideos = musicVideos
    }
}
