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
    @Published public var isFetchingAutomix: Bool = false

    // MARK: - Data Collections
    @Published public var likedTracks: [Track] = []
    @Published public var historyTracks: [Track] = []
    @Published public var exploreData: ExploreHomeData = ExploreHomeData()
    @Published public var searchResults: [Track] = []

    public let skippedArtistCooldown = SkippedArtistCooldown.shared
    private let audioService = AudioPlayerService.shared
    private let streamSource = MusicStreamSource.shared
    private let lrcService = LrcLibService.shared
    private let cacheManager = CacheManager.shared
    private var cancellables = Set<AnyCancellable>()
    private var automixTask: Task<Void, Never>?

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
    public func play(track: Track, newQueue: [Track]? = nil) {
        if let newQueue = newQueue, newQueue.count > 1 {
            playTrack(track, queue: newQueue)
        } else {
            playTrack(track, queue: [track])
            fetchAutomixQueue(seedTrack: track)
        }
    }

    public func playTrack(_ track: Track, queue: [Track] = []) {
        var mutableTrack = track
        mutableTrack.isLiked = likedTracks.contains(where: { $0.id == track.id })
        self.currentTrack = mutableTrack

        if !queue.isEmpty {
            self.queue = queue
            if let idx = queue.firstIndex(where: { $0.id == track.id }) {
                self.currentIndex = idx
            }
        } else {
            self.queue = [mutableTrack]
            self.currentIndex = 0
        }

        if queue.count <= 1 {
            fetchAutomixQueue(seedTrack: mutableTrack)
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

    public func nextTrack() {
        guard let current = currentTrack else {
            if !queue.isEmpty {
                playTrack(queue[0], queue: queue)
            }
            return
        }

        // If playback position < 15 seconds, record skip cooldown on the artist
        if playbackTime > 0 && playbackTime < 15.0 {
            skippedArtistCooldown.recordSkip(artist: current.artist.name)
        }

        let idx = queue.firstIndex(where: { $0.id == current.id }) ?? currentIndex

        // If approaching queue end (currentIndex >= queue.count - 2), prefetch automix
        if idx >= queue.count - 2 {
            fetchAutomixQueue(seedTrack: current)
        }

        if isShuffle && queue.count > 1 {
            var nextIdx = Int.random(in: 0..<queue.count)
            if nextIdx == idx {
                nextIdx = (idx + 1) % queue.count
            }
            currentIndex = nextIdx
            playTrack(queue[currentIndex], queue: queue)
        } else if idx < queue.count - 1 {
            currentIndex = idx + 1
            playTrack(queue[currentIndex], queue: queue)
        } else if repeatMode == 1 && !queue.isEmpty {
            currentIndex = 0
            playTrack(queue[currentIndex], queue: queue)
        } else {
            // Reached queue end with repeat OFF: wait for automix queue to complete
            Task { @MainActor [weak self] in
                guard let self = self else { return }
                if self.isFetchingAutomix {
                    _ = await self.automixTask?.value
                }
                let updatedIdx = self.queue.firstIndex(where: { $0.id == current.id }) ?? self.currentIndex
                if updatedIdx < self.queue.count - 1 {
                    self.currentIndex = updatedIdx + 1
                    self.playTrack(self.queue[self.currentIndex], queue: self.queue)
                }
            }
        }
    }

    public func playNext() {
        nextTrack()
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

    // MARK: - Automix & Infinite Radio Queue
    @discardableResult
    public func fetchAutomixQueue(seedTrack: Track, resetQueue: Bool = false) -> Task<Void, Never> {
        automixTask?.cancel()
        let task = Task { @MainActor [weak self] in
            guard let self = self else { return }
            self.isFetchingAutomix = true
            defer { self.isFetchingAutomix = false }

            let cluster = MusifyAutomixEngine.detectCulture(artist: seedTrack.artist.name, title: seedTrack.title)
            let rawRadio = await self.streamSource.fetchSongRadio(track: seedTrack)

            guard !Task.isCancelled else { return }

            let currentQueue = self.queue
            let existingIds = Set(currentQueue.map { $0.id })
            let existingTitles = Set(currentQueue.map { $0.title.trimmingCharacters(in: .whitespacesAndNewlines).lowercased() })

            var validSongs: [Track] = []
            var seenIds = existingIds
            var seenTitles = existingTitles

            for candidate in rawRadio {
                if candidate.id == seedTrack.id { continue }
                if seenIds.contains(candidate.id) { continue }
                let normTitle = candidate.title.trimmingCharacters(in: .whitespacesAndNewlines).lowercased()
                if seenTitles.contains(normTitle) { continue }
                if self.skippedArtistCooldown.isCooldownActive(artist: candidate.artist.name) { continue }
                if !MusifyAutomixEngine.isCompatibleTrack(candidate: candidate, seedTrack: seedTrack, seedCulture: cluster) { continue }

                validSongs.append(candidate)
                seenIds.insert(candidate.id)
                seenTitles.insert(normTitle)
            }

            guard !Task.isCancelled, !validSongs.isEmpty else { return }

            let existingInQueue = Set(self.queue.map { $0.id })
            let newUnique = validSongs.filter { !existingInQueue.contains($0.id) }
            guard !newUnique.isEmpty else { return }

            if resetQueue {
                self.queue = [seedTrack] + newUnique
                self.currentIndex = 0
            } else {
                self.queue.append(contentsOf: newUnique)
            }
        }
        self.automixTask = task
        return task
    }

    private func handleTrackEnded() {
        if repeatMode == 2 { // Repeat one
            seek(to: 0)
            audioService.togglePlayPause()
        } else if repeatMode == 1 { // Repeat all
            nextTrack()
        } else { // Repeat off
            guard let current = currentTrack else { return }
            let idx = queue.firstIndex(where: { $0.id == current.id }) ?? currentIndex
            if idx < queue.count - 1 {
                nextTrack()
            } else {
                // Seamlessly transition to automix queue if available
                Task { @MainActor [weak self] in
                    guard let self = self else { return }
                    if self.isFetchingAutomix {
                        _ = await self.automixTask?.value
                    } else {
                        let task = self.fetchAutomixQueue(seedTrack: current)
                        _ = await task.value
                    }

                    let updatedIdx = self.queue.firstIndex(where: { $0.id == current.id }) ?? self.currentIndex
                    if updatedIdx < self.queue.count - 1 {
                        self.currentIndex = updatedIdx + 1
                        self.playTrack(self.queue[self.currentIndex], queue: self.queue)
                    } else {
                        self.seek(to: 0)
                    }
                }
            }
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

    // MARK: - Cache
    public func clearAudioCache() {
        cacheManager.clearAudioCache()
    }
}
