import Foundation

public final class LrcLibService {
    public static let shared = LrcLibService()
    private let session: URLSession

    public init(session: URLSession = .shared) {
        self.session = session
    }

    public func fetchLyrics(title: String, artist: String, durationSec: Int = 0) async -> Lyrics {
        var components = URLComponents(string: "https://lrclib.net/api/get")
        components?.queryItems = [
            URLQueryItem(name: "track_name", value: title),
            URLQueryItem(name: "artist_name", value: artist)
        ]
        if durationSec > 0 {
            components?.queryItems?.append(URLQueryItem(name: "duration", value: "\(durationSec)"))
        }

        guard let url = components?.url else {
            return Lyrics()
        }

        var request = URLRequest(url: url)
        request.setValue("SoraFy iOS / 2.0 (github.com/rafliadipratama/sorafy)", forHTTPHeaderField: "User-Agent")

        guard let (data, response) = try? await session.data(for: request),
              let httpResponse = response as? HTTPURLResponse, httpResponse.statusCode == 200,
              let json = try? JSONSerialization.jsonObject(with: data) as? [String: Any] else {
            return Lyrics()
        }

        let plain = json["plainLyrics"] as? String
        let syncedRaw = json["syncedLyrics"] as? String

        var parsedLines: [LyricLine] = []
        if let syncedRaw = syncedRaw, !syncedRaw.isEmpty {
            parsedLines = parseLrc(syncedRaw)
        }

        return Lyrics(plainLyrics: plain, syncedLyrics: parsedLines)
    }

    public func parseLrc(_ lrcText: String) -> [LyricLine] {
        var lines: [LyricLine] = []
        let rawLines = lrcText.components(separatedBy: .newlines)

        let timeRegex = try? NSRegularExpression(pattern: #"^\[(\d{2}):(\d{2})\.(\d{2,3})\](.*)$"#)

        for raw in rawLines {
            let trimmed = raw.trimmingCharacters(in: .whitespaces)
            guard let regex = timeRegex,
                  let match = regex.firstMatch(in: trimmed, range: NSRange(location: 0, length: trimmed.utf16.count)) else {
                continue
            }

            guard let minRange = Range(match.range(at: 1), in: trimmed),
                  let secRange = Range(match.range(at: 2), in: trimmed),
                  let msRange = Range(match.range(at: 3), in: trimmed),
                  let textRange = Range(match.range(at: 4), in: trimmed) else {
                continue
            }

            let mins = Int64(trimmed[minRange]) ?? 0
            let secs = Int64(trimmed[secRange]) ?? 0
            var msStr = String(trimmed[msRange])
            if msStr.count == 2 { msStr += "0" }
            let ms = Int64(msStr) ?? 0

            let totalMs = mins * 60_000 + secs * 1_000 + ms
            let text = String(trimmed[textRange]).trimmingCharacters(in: .whitespaces)

            lines.append(LyricLine(timestampMs: totalMs, text: text))
        }

        return lines.sorted { $0.timestampMs < $1.timestampMs }
    }
}
