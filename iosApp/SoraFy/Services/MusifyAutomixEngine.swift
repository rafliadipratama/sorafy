import Foundation

public enum MusifyCulture: String, CaseIterable, Codable, Hashable, Sendable {
    case westernAltIndie = "western_alt_indie"
    case westernRockMetal = "western_rock_metal"
    case westernPopRnb = "western_pop_rnb"
    case indoIndieFolk = "indo_indie_folk"
    case indoDangdutKoplo = "indo_dangdut_koplo"
    case kpopAsian = "kpop_asian"
    case unknown = "unknown"

    public var id: String { rawValue }

    public var displayName: String {
        switch self {
        case .westernAltIndie:
            return "Western Alternative & Dream Pop"
        case .westernRockMetal:
            return "Western Rock & Alternative Metal"
        case .westernPopRnb:
            return "Western Mainstream Pop & R&B"
        case .indoIndieFolk:
            return "Indonesian Indie, Folk & Senja Pop"
        case .indoDangdutKoplo:
            return "Indonesian Dangdut & Koplo Jawa"
        case .kpopAsian:
            return "K-Pop & Asian Wave"
        case .unknown:
            return "Unknown Culture"
        }
    }

    public var searchSeeds: [String] {
        switch self {
        case .westernAltIndie:
            return [
                "dream pop indie hits",
                "chill indie alternative hits",
                "indie alternative songs"
            ]
        case .westernRockMetal:
            return [
                "alternative rock anthems",
                "best modern rock hits",
                "classic rock songs"
            ]
        case .westernPopRnb:
            return [
                "top billboard pop hits",
                "global pop hits terpopuler",
                "western pop acoustic hits"
            ]
        case .indoIndieFolk:
            return [
                "indie folk indonesia terpopuler",
                "lagu indie senja akustik",
                "pop indie indonesia terbaik"
            ]
        case .indoDangdutKoplo:
            return [
                "dangdut koplo jawa hits",
                "lagu koplo ambyar terpopuler",
                "lagu jawa terpopuler"
            ]
        case .kpopAsian:
            return [
                "kpop top trending hits",
                "korean pop best songs",
                "kpop girl group boy group hits"
            ]
        case .unknown:
            return []
        }
    }

    public var bannedWords: [String] {
        switch self {
        case .westernAltIndie:
            return ["dangdut", "koplo", "kendang", "jedag jedug"]
        case .westernRockMetal:
            return ["dangdut", "koplo", "kpop", "jedag jedug"]
        case .westernPopRnb:
            return ["dangdut", "koplo", "kendang", "jedag jedug"]
        case .indoIndieFolk:
            return ["koplo", "dangdut", "kendang", "jedag jedug", "remix koplo"]
        case .indoDangdutKoplo:
            return ["radiohead", "coldplay", "kpop", "metal"]
        case .kpopAsian:
            return ["dangdut", "koplo", "kendang"]
        case .unknown:
            return []
        }
    }
}

public typealias CultureCluster = MusifyCulture

public enum MusifyAutomixEngine {

    public static let indoIndieFolkKeywords: [String] = [
        "bernadya", "hindia", "sal priadi", "nadin amizah", "feby putri", "pamungkas",
        "danilla", "fiersa besari", "juicy luicy", "fourtwnty", "idgitaf", "dere",
        "eñau", "enau", "soegi bornean", "ardhito pramono", "kunto aji", "bilal indrajaya",
        "baskara putra", "lomba sihir", "coldiac", "batiga", "the adams", "morfem",
        "rumahsakit", "barasuara", "payung teduh", "parade hujan", "daun jatuh", "hal",
        "tulus", "mahalini", "lyodra", "tiara andini", "raisa", "afgan", "rizky febian",
        "yura yunita", "jaz", "budi doremi", "judika", "anji", "keisya levronka",
        "ziva magnolya", "glenn fredly", "cakra khan", "fabio asher", "anggi marito",
        "ghea indrawari", "ade govind", "marion jola", "vidi aldiano", "rossa", "bcl",
        "sheila on 7", "dewa 19", "noah", "peterpan", "padi", "ungu", "d'masiv",
        "gigi", "ada band", "kotak", "letto", "maliq & d'essentials", "kahitna",
        "kerispatih", "seventeen", "drive", "nidji", "samsons", "j-rocks", "radja",
        "element", "naff", "vierra", "vierratale", "geisha", "the changcuters", "slank"
    ]

    public static let indoDangdutKoploKeywords: [String] = [
        "denny caknan", "guyon waton", "happy asmara", "gilga sahid", "ndarboy genk",
        "shinta arsinta", "woro widowati", "difarina indra", "ndx aka", "aftershine",
        "didi kempot", "fira cantika", "yenny inka", "sasya arkhisna", "tasya rosmala"
    ]

    public static let westernAltIndieKeywords: [String] = [
        "radiohead", "billie eilish", "lana del rey", "coldplay", "lorde",
        "the neighbourhood", "cigarettes after sex", "arctic monkeys", "phoebe bridgers",
        "bleachers", "clairo", "mitski", "girl in red", "conan gray", "beabadoobee",
        "wallows", "the 1975", "beach house", "men i trust", "cage the elephant", "chappell roan"
    ]

    public static let westernPopRnbKeywords: [String] = [
        "bruno mars", "taylor swift", "sabrina carpenter", "olivia rodrigo",
        "the weeknd", "ed sheeran", "ariana grande", "justin bieber", "dua lipa",
        "maroon 5", "harry styles", "charlie puth", "shawn mendes", "lady gaga",
        "adele", "sza", "post malone", "katy perry", "sam smith", "rihanna",
        "selena gomez", "tate mcrae", "camila cabello", "benson boone"
    ]

    public static let westernRockMetalKeywords: [String] = [
        "linkin park", "green day", "metallica", "avenged sevenfold", "nirvana",
        "muse", "foo fighters", "my chemical romance", "bring me the horizon",
        "red hot chili peppers", "paramore", "blink-182", "fall out boy", "oasis"
    ]

    public static let kpopAsianKeywords: [String] = [
        "bts", "blackpink", "newjeans", "ive", "aespa", "twice", "stray kids",
        "txt", "le sserafim", "jungkook", "jennie", "rosé", "lisa",
        "taeyeon", "iu", "exo", "red velvet", "itzy", "enhypen", "babymonster"
    ]

    private struct ClusterDefinition {
        let cluster: MusifyCulture
        let keywords: [String]
    }

    private static let clusterDefinitions: [ClusterDefinition] = [
        ClusterDefinition(cluster: .indoIndieFolk, keywords: indoIndieFolkKeywords),
        ClusterDefinition(cluster: .indoDangdutKoplo, keywords: indoDangdutKoploKeywords),
        ClusterDefinition(cluster: .westernAltIndie, keywords: westernAltIndieKeywords),
        ClusterDefinition(cluster: .westernPopRnb, keywords: westernPopRnbKeywords),
        ClusterDefinition(cluster: .westernRockMetal, keywords: westernRockMetalKeywords),
        ClusterDefinition(cluster: .kpopAsian, keywords: kpopAsianKeywords)
    ]

    private static func createRegex(_ pattern: String) -> NSRegularExpression? {
        return try? NSRegularExpression(pattern: pattern, options: .caseInsensitive)
    }

    private static func matchesRegex(_ regex: NSRegularExpression?, in text: String) -> Bool {
        guard let regex = regex, !text.isEmpty else { return false }
        let range = NSRange(text.startIndex..., in: text)
        return regex.firstMatch(in: text, options: [], range: range) != nil
    }

    private static let bootlegTitleRegex = createRegex(
        "\\b(cover by|karaoke|instrumental|tribute(?: to)?|lofi remix|originally performed by|as made famous by|backing track|dj\\s+(?:remix|tiktok|jedag)|slowed\\s*(?:and|\\+|&)?\\s*reverb|8d audio|sped up|slowed down)\\b"
    )

    private static let bootlegArtistRegex = createRegex(
        "\\b(karaoke|tribute band|tribute crew|the karaoke|paris music)\\b"
    )

    private static let jawaTitleOrArtistRegex = createRegex(
        "\\b(tresno|lungo|loro|dalan|kisinan|tiwas|wirang|nemen|cidro|sewu|bojo|sayang|amung)\\b"
    )

    private static let jawaStrictDangdutRegex = createRegex(
        "\\b(tresno|lungo|loro|dalan|kisinan|tiwas|wirang|nemen|cidro|sewu|bojo|koplo|dangdut)\\b"
    )

    private static let indoTitleRegex = createRegex(
        "\\b(yang|dan|aku|kamu|kita|hati|cinta|senja|rindu|malam|tentang|kembali|bila|saat|menanti|hujan|hilang|selamat|pulang|bunga)\\b"
    )

    private static let dangdutKendangRegex = createRegex(
        "\\b(dangdut|koplo|kendang)\\b"
    )

    private static let dangdutRemixRegex = createRegex(
        "\\b(dangdut|koplo|kendang|remix koplo)\\b"
    )

    private static func containsHangul(_ text: String) -> Bool {
        return text.unicodeScalars.contains { scalar in
            (0x3131...0x318E).contains(scalar.value) ||
            (0x1100...0x11FF).contains(scalar.value) ||
            (0xAC00...0xD7A3).contains(scalar.value) ||
            (0x3131...0xD79D).contains(scalar.value)
        }
    }

    public static func detectCulture(artist: String, title: String) -> MusifyCulture {
        let cleanArt = artist.lowercased().trimmingCharacters(in: .whitespacesAndNewlines)
        let cleanTit = title.lowercased().trimmingCharacters(in: .whitespacesAndNewlines)

        if cleanArt.isEmpty && cleanTit.isEmpty {
            return .unknown
        }

        // 1. Keyword matching on artist name
        for def in clusterDefinitions {
            if matchesArtist(cleanArt, keywords: def.keywords) {
                return def.cluster
            }
        }

        // 2. Jawa language heuristic
        if matchesRegex(jawaTitleOrArtistRegex, in: cleanTit) || matchesRegex(jawaTitleOrArtistRegex, in: cleanArt) {
            return .indoDangdutKoplo
        }

        // 3. Indonesian lyrics heuristic
        if matchesRegex(indoTitleRegex, in: cleanTit) {
            return .indoIndieFolk
        }

        // 4. Hangul / K-Pop heuristic
        if containsHangul(cleanTit) || containsHangul(cleanArt) {
            return .kpopAsian
        }

        // 5. Default fallback
        return .westernAltIndie
    }

    public static func isBootlegOrKaraoke(title: String, artist: String) -> Bool {
        let cleanTit = title.lowercased().trimmingCharacters(in: .whitespacesAndNewlines)
        let cleanArt = artist.lowercased().trimmingCharacters(in: .whitespacesAndNewlines)
        return matchesRegex(bootlegTitleRegex, in: cleanTit) || matchesRegex(bootlegArtistRegex, in: cleanArt)
    }

    public static func isBootlegOrKaraoke(track: Track) -> Bool {
        return isBootlegOrKaraoke(title: track.title, artist: track.artist.name)
    }

    public static func cleanTrackTitle(_ title: String) -> String {
        let pattern = "\\s*[({\\[]\\s*(?:official\\s*(?:music\\s*)?video|video\\s*musik|music\\s*video|official\\s*audio|lyric\\s*video|audio|mv|m/v|4k|hd|live(?:\\s+at\\s+[^)\\]]+)?|visualizer|lirik|remaster(?:ed)?(?:\\s*\\d+)?)\\s*[)}\\]]"
        var cleaned = title
        if let regex = try? NSRegularExpression(pattern: pattern, options: .caseInsensitive) {
            let range = NSRange(cleaned.startIndex..., in: cleaned)
            cleaned = regex.stringByReplacingMatches(in: cleaned, options: [], range: range, withTemplate: "")
        }
        let dashPattern = "\\s*-\\s*(?:remaster(?:ed)?(?:\\s*\\d+)?|live(?:\\s+at\\s+.*)?)\\s*$"
        if let regex = try? NSRegularExpression(pattern: dashPattern, options: .caseInsensitive) {
            let range = NSRange(cleaned.startIndex..., in: cleaned)
            cleaned = regex.stringByReplacingMatches(in: cleaned, options: [], range: range, withTemplate: "")
        }
        return cleaned.lowercased().trimmingCharacters(in: .whitespacesAndNewlines)
    }

    public static func isCompatibleTrack(
        candidate: Track,
        seedTrack: Track,
        seedCulture: MusifyCulture
    ) -> Bool {
        let candTit = candidate.title.lowercased().trimmingCharacters(in: .whitespacesAndNewlines)
        let candArt = candidate.artist.name.lowercased().trimmingCharacters(in: .whitespacesAndNewlines)
        let seedArt = seedTrack.artist.name.lowercased().trimmingCharacters(in: .whitespacesAndNewlines)
        let seedTit = seedTrack.title.lowercased().trimmingCharacters(in: .whitespacesAndNewlines)

        if candTit.isEmpty { return false }

        // 1. Same seed track or duplicate title version bloat
        if candidate.id == seedTrack.id {
            return false
        }
        let cleanCand = cleanTrackTitle(candTit)
        let cleanSeed = cleanTrackTitle(seedTit)
        if !cleanCand.isEmpty && !cleanSeed.isEmpty && cleanCand == cleanSeed {
            return false
        }

        // 2. Reject generic bootlegs, unofficial covers, karaoke, slowed/reverb, 8d audio, sped up
        if isBootlegOrKaraoke(title: candidate.title, artist: candidate.artist.name) {
            return false
        }

        // 3. Same artist is always 100% compatible (different song)
        if !candArt.isEmpty && !seedArt.isEmpty && (candArt.contains(seedArt) || seedArt.contains(candArt)) {
            return true
        }

        // 4. Check cluster banned words
        for banned in seedCulture.bannedWords {
            if candArt.contains(banned) || candTit.contains(banned) {
                return false
            }
        }

        // 5. Strict culture isolation
        let isSeedIndo = seedCulture == .indoIndieFolk || seedCulture == .indoDangdutKoplo
        let isSeedWestern = seedCulture == .westernAltIndie ||
            seedCulture == .westernRockMetal ||
            seedCulture == .westernPopRnb

        if isSeedIndo {
            if seedCulture == .indoDangdutKoplo {
                let isCandDangdut = indoDangdutKoploKeywords.contains { k in candArt.contains(k) }
                let hasJawa = matchesRegex(jawaStrictDangdutRegex, in: candTit)
                return isCandDangdut || hasJawa
            }

            // If seed is non-dangdut Indo, strictly reject dangdut
            if indoDangdutKoploKeywords.contains({ k in candArt.contains(k) }) {
                return false
            }
            if matchesRegex(dangdutRemixRegex, in: candTit) {
                return false
            }

            // Reject non-Indonesian candidate
            let candCulture = detectCulture(artist: candidate.artist.name, title: candidate.title)
            if candCulture != .indoIndieFolk && candCulture != .indoDangdutKoplo {
                return false
            }
            return true
        }

        if isSeedWestern {
            if matchesRegex(dangdutKendangRegex, in: candTit) {
                return false
            }
            let candCulture = detectCulture(artist: candidate.artist.name, title: candidate.title)
            if candCulture == .indoIndieFolk || candCulture == .indoDangdutKoplo {
                return false
            }
            return true
        }

        if seedCulture == .kpopAsian {
            let candCulture = detectCulture(artist: candidate.artist.name, title: candidate.title)
            return candCulture == .kpopAsian
        }

        return true
    }

    public static func isCompatibleTrack(candidate: Track, seedTrack: Track) -> Bool {
        let cluster = detectCulture(artist: seedTrack.artist.name, title: seedTrack.title)
        return isCompatibleTrack(candidate: candidate, seedTrack: seedTrack, seedCulture: cluster)
    }

    private static func matchesArtist(_ cleanArt: String, keywords: [String]) -> Bool {
        if cleanArt.isEmpty { return false }
        return keywords.contains { k in
            cleanArt == k ||
            cleanArt.contains(k) ||
            (cleanArt.count >= 4 && k.contains(cleanArt))
        }
    }
}
