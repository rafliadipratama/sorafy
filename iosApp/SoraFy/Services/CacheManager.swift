import Foundation

public final class CacheManager {
    public static let shared = CacheManager()

    private let likedKey = "sorafy_liked_tracks"
    private let historyKey = "sorafy_history_tracks"
    private let userDefaults = UserDefaults.standard

    public func getLikedTracks() -> [Track] {
        guard let data = userDefaults.data(forKey: likedKey),
              let tracks = try? JSONDecoder().decode([Track].self, from: data) else {
            return []
        }
        return tracks
    }

    public func saveLikedTracks(_ tracks: [Track]) {
        if let data = try? JSONEncoder().encode(tracks) {
            userDefaults.set(data, forKey: likedKey)
        }
    }

    public func toggleLike(track: Track) -> [Track] {
        var current = getLikedTracks()
        if let idx = current.firstIndex(where: { $0.id == track.id }) {
            current.remove(at: idx)
        } else {
            var updated = track
            updated.isLiked = true
            current.insert(updated, at: 0)
        }
        saveLikedTracks(current)
        return current
    }

    public func getHistoryTracks() -> [Track] {
        guard let data = userDefaults.data(forKey: historyKey),
              let tracks = try? JSONDecoder().decode([Track].self, from: data) else {
            return []
        }
        return tracks
    }

    public func recordHistory(track: Track) {
        var history = getHistoryTracks()
        history.removeAll(where: { $0.id == track.id })
        history.insert(track, at: 0)
        if history.count > 50 {
            history = Array(history.prefix(50))
        }
        if let data = try? JSONEncoder().encode(history) {
            userDefaults.set(data, forKey: historyKey)
        }
    }

    public func clearAudioCache() {
        let tempDir = FileManager.default.temporaryDirectory
        if let files = try? FileManager.default.contentsOfDirectory(at: tempDir, includingPropertiesForKeys: nil) {
            for file in files {
                try? FileManager.default.removeItem(at: file)
            }
        }
        if let cacheDir = FileManager.default.urls(for: .cachesDirectory, in: .userDomainMask).first,
           let files = try? FileManager.default.contentsOfDirectory(at: cacheDir, includingPropertiesForKeys: nil) {
            for file in files {
                try? FileManager.default.removeItem(at: file)
            }
        }
    }
}
