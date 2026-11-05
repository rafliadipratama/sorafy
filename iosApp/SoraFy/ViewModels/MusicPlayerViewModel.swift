import Foundation
import Combine
import SwiftUI

@MainActor
public final class MusicPlayerViewModel: ObservableObject {
    public static let shared = MusicPlayerViewModel()

    // MARK: - Playback State
    @Published public var currentTrack: Track?
    @Published public var isPlaying: Bool = false
    @Published public var playbackTime: Double = 0.0
    @Published public var duration: Double = 0.0
    @Published public var queue: [Track] = []
    @Published public var currentIndex: Int = 0
    @Published public var isShuffle: Bool = false
    @Published public var repeatMode: Int = 0 // 0: off, 1: all, 2: one

    // MARK: - Lyrics State
    @Published public var lyrics: Lyrics = Lyrics()
    @Published public var activeLyricIndex: Int = -1

    // MARK: - UI & Presentation State
    @Published public var isNowPlayingPresented: Bool = false
    @Published public var isStatsPresented: Bool = false
    @Published public var isLyricsPresented: Bool = false
    @Published public var isSearching: Bool = false

    // MARK: - Data Collections
    @Published public var likedTracks: [Track] = []
    @Published public var historyTracks: [Track] = []
    @Published public var exploreData: ExploreHomeData = ExploreHomeData()
    @Published public var searchResults: [Track] = []

    private let audioService = AudioPlayerService.shared
    private let streamSource = MusicStreamSource.shared
    private let lrcService = LrcLibService.shared
    private let cacheManager = CacheManager.shared
    private var cancellables = Set<AnyCancellable>()

    public init() {
        self.likedTracks = cacheManager.getLikedTracks()
        self.historyTracks = cacheManager.getHistoryTracks()

        bindAudioService()
        Task {
            await fetchHome()
        }
    }

    private func bindAudioService() {
        audioService.$isPlaying
            .receive(on: DispatchQueue.main)
            .assign(to: &$isPlaying)

        audioService.$currentPositionSec
            .receive(on: DispatchQueue.main)
            .sink { [weak self] pos in
                guard let self = self else { return }
                self.playbackTime = pos
                self.updateActiveLyricIndex(currentTimeMs: Int64(pos * 1000.0))
            }
            .store(in: &cancellables)

        audioService.$durationSec
            .receive(on: DispatchQueue.main)
            .assign(to: &$duration)

        audioService.onTrackFinished = { [weak self] in
            Task { @MainActor [weak self] in
                self?.handleTrackEnded()
            }
        }
    }

    // MARK: - Playback Control
    public func playTrack(_ track: Track, queue: [Track] = []) {
        var mutableTrack = track
        mutableTrack.isLiked = likedTracks.contains(where: { $0.id == track.id })
        self.currentTrack = mutableTrack

        if !queue.isEmpty {
            self.queue = queue
            if let idx = queue.firstIndex(where: { $0.id == track.id }) {
                self.currentIndex = idx
            }
        } else if self.queue.isEmpty {
            self.queue = [mutableTrack]
            self.currentIndex = 0
        }

        cacheManager.recordHistory(track: mutableTrack)
        self.historyTracks = cacheManager.getHistoryTracks()

        // Fetch lyrics asynchronously
        Task {
            await fetchLyrics(for: mutableTrack)
        }

        // Resolve stream URL and play
        Task {
            if let streamUrl = await streamSource.resolveAudioStream(videoId: track.id) {
                audioService.loadAndPlay(streamUrl: streamUrl, track: mutableTrack)
            }
        }
    }

    public func togglePlayPause() {
        audioService.togglePlayPause()
    }

    public func playNext() {
        guard !queue.isEmpty else { return }
        if isShuffle {
            currentIndex = Int.random(in: 0..<queue.count)
        } else {
            currentIndex = (currentIndex + 1) % queue.count
        }
        playTrack(queue[currentIndex], queue: queue)
    }

    public func playPrevious() {
        guard !queue.isEmpty else { return }
        if playbackTime > 3.0 {
            seek(to: 0)
            return
        }
        currentIndex = (currentIndex - 1 + queue.count) % queue.count
        playTrack(queue[currentIndex], queue: queue)
    }

    public func seek(to seconds: Double) {
        audioService.seek(to: seconds)
    }

    public func toggleShuffle() {
        isShuffle.toggle()
    }

    public func cycleRepeatMode() {
        repeatMode = (repeatMode + 1) % 3
    }

    public func toggleLike(track: Track) {
        likedTracks = cacheManager.toggleLike(track: track)
        if currentTrack?.id == track.id {
            currentTrack?.isLiked.toggle()
        }
    }

    private func handleTrackEnded() {
        if repeatMode == 2 { // Repeat one
            seek(to: 0)
            audioService.togglePlayPause()
        } else if repeatMode == 1 || currentIndex + 1 < queue.count {
            playNext()
        }
    }

    // MARK: - Lyrics & Sync
    public func fetchLyrics(for track: Track) async {
        let result = await lrcService.fetchLyrics(
            title: track.cleanTitle,
            artist: track.artist.name,
            durationSec: track.durationSec
        )
        self.lyrics = result
        self.activeLyricIndex = -1
    }

    private func updateActiveLyricIndex(currentTimeMs: Int64) {
        guard lyrics.hasSyncedLyrics else { return }
        let lines = lyrics.syncedLyrics
        var newIndex = -1
        for (i, line) in lines.enumerated() {
            if line.timestampMs <= currentTimeMs {
                newIndex = i
            } else {
                break
            }
        }
        if newIndex != activeLyricIndex {
            activeLyricIndex = newIndex
        }
    }

    // MARK: - Search & Home
    public func search(query: String) async {
        guard !query.trimmingCharacters(in: .whitespaces).isEmpty else {
            self.searchResults = []
            return
        }
        self.isSearching = true
        let results = await streamSource.searchYouTubeMusic(query: query)
        self.searchResults = results
        self.isSearching = false
    }

    public func fetchHome() async {
        let home = await streamSource.fetchExploreHome()
        self.exploreData = home
    }
}
