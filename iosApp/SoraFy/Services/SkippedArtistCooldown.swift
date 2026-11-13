import Foundation

/// Thread-safe manager for temporarily cooling down artists who were skipped early,
/// preventing them from dominating automix / radio suggestions.
public final class SkippedArtistCooldown: @unchecked Sendable {
    public static let shared = SkippedArtistCooldown()

    public let cooldownDuration: TimeInterval
    private var cooldownMap: [String: Date] = [:]
    private let lock = NSLock()

    public init(cooldownDuration: TimeInterval = 30 * 60) {
        self.cooldownDuration = cooldownDuration
    }

    private func normalize(_ artist: String) -> String {
        return artist.trimmingCharacters(in: .whitespacesAndNewlines).lowercased()
    }

    /// Records an artist skip with the current date (or provided date).
    public func recordSkip(artist: String, at date: Date = Date()) {
        let key = normalize(artist)
        guard !key.isEmpty else { return }
        lock.lock()
        defer { lock.unlock() }
        cooldownMap[key] = date
    }

    /// Checks if cooldown is currently active for the given artist.
    public func isCooldownActive(artist: String, at date: Date = Date()) -> Bool {
        let key = normalize(artist)
        guard !key.isEmpty else { return false }
        lock.lock()
        defer { lock.unlock() }
        guard let skippedAt = cooldownMap[key] else { return false }
        let elapsed = date.timeIntervalSince(skippedAt)
        return elapsed >= 0 && elapsed < cooldownDuration
    }

    /// Clears expired cooldown entries to prevent unbounded memory growth.
    public func clearExpired(at date: Date = Date()) {
        lock.lock()
        defer { lock.unlock() }
        cooldownMap = cooldownMap.filter { (_, skippedAt) in
            date.timeIntervalSince(skippedAt) < cooldownDuration
        }
    }

    /// Clears all recorded cooldowns.
    public func clear() {
        lock.lock()
        defer { lock.unlock() }
        cooldownMap.removeAll()
    }
}
