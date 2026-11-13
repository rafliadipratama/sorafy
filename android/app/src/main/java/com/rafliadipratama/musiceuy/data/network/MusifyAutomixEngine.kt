package com.rafliadipratama.musiceuy.data.network

import com.rafliadipratama.musiceuy.data.model.Track

enum class CultureCluster(
    val id: String,
    val displayName: String,
    val searchSeeds: List<String> = emptyList(),
    val bannedWords: List<String> = emptyList()
) {
    WESTERN_ALT_INDIE(
        id = "western_alt_indie",
        displayName = "Western Alternative & Dream Pop",
        searchSeeds = listOf(
            "dream pop indie hits",
            "chill indie alternative hits",
            "indie alternative songs"
        ),
        bannedWords = listOf("dangdut", "koplo", "kendang", "jedag jedug")
    ),
    WESTERN_ROCK_METAL(
        id = "western_rock_metal",
        displayName = "Western Rock & Alternative Metal",
        searchSeeds = listOf(
            "alternative rock anthems",
            "best modern rock hits",
            "classic rock songs"
        ),
        bannedWords = listOf("dangdut", "koplo", "kpop", "jedag jedug")
    ),
    WESTERN_POP_RNB(
        id = "western_pop_rnb",
        displayName = "Western Mainstream Pop & R&B",
        searchSeeds = listOf(
            "top billboard pop hits",
            "global pop hits terpopuler",
            "western pop acoustic hits"
        ),
        bannedWords = listOf("dangdut", "koplo", "kendang", "jedag jedug")
    ),
    INDO_INDIE_FOLK(
        id = "indo_indie_folk",
        displayName = "Indonesian Indie, Folk & Senja Pop",
        searchSeeds = listOf(
            "indie folk indonesia terpopuler",
            "lagu indie senja akustik",
            "pop indie indonesia terbaik"
        ),
        bannedWords = listOf("koplo", "dangdut", "kendang", "jedag jedug", "remix koplo")
    ),
    INDO_DANGDUT_KOPLO(
        id = "indo_dangdut_koplo",
        displayName = "Indonesian Dangdut & Koplo Jawa",
        searchSeeds = listOf(
            "dangdut koplo jawa hits",
            "lagu koplo ambyar terpopuler",
            "lagu jawa terpopuler"
        ),
        bannedWords = listOf("radiohead", "coldplay", "kpop", "metal")
    ),
    KPOP_ASIAN(
        id = "kpop_asian",
        displayName = "K-Pop & Asian Wave",
        searchSeeds = listOf(
            "kpop top trending hits",
            "korean pop best songs",
            "kpop girl group boy group hits"
        ),
        bannedWords = listOf("dangdut", "koplo", "kendang")
    ),
    UNKNOWN(
        id = "unknown",
        displayName = "Unknown Culture",
        searchSeeds = emptyList(),
        bannedWords = emptyList()
    );
}

object MusifyAutomixEngine {

    private val indoIndieFolkKeywords = listOf(
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
    )

    private val indoDangdutKoploKeywords = listOf(
        "denny caknan", "guyon waton", "happy asmara", "gilga sahid", "ndarboy genk",
        "shinta arsinta", "woro widowati", "difarina indra", "ndx aka", "aftershine",
        "didi kempot", "fira cantika", "yenny inka", "sasya arkhisna", "tasya rosmala"
    )

    private val westernAltIndieKeywords = listOf(
        "radiohead", "billie eilish", "lana del rey", "coldplay", "lorde",
        "the neighbourhood", "cigarettes after sex", "arctic monkeys", "phoebe bridgers",
        "bleachers", "clairo", "mitski", "girl in red", "conan gray", "beabadoobee",
        "wallows", "the 1975", "beach house", "men i trust", "cage the elephant", "chappell roan"
    )

    private val westernPopRnbKeywords = listOf(
        "bruno mars", "taylor swift", "sabrina carpenter", "olivia rodrigo",
        "the weeknd", "ed sheeran", "ariana grande", "justin bieber", "dua lipa",
        "maroon 5", "harry styles", "charlie puth", "shawn mendes", "lady gaga",
        "adele", "sza", "post malone", "katy perry", "sam smith", "rihanna",
        "selena gomez", "tate mcrae", "camila cabello", "benson boone"
    )

    private val westernRockMetalKeywords = listOf(
        "linkin park", "green day", "metallica", "avenged sevenfold", "nirvana",
        "muse", "foo fighters", "my chemical romance", "bring me the horizon",
        "red hot chili peppers", "paramore", "blink-182", "fall out boy", "oasis"
    )

    private val kpopAsianKeywords = listOf(
        "bts", "blackpink", "newjeans", "ive", "aespa", "twice", "stray kids",
        "txt", "le sserafim", "jungkook", "jennie", "rosé", "lisa",
        "taeyeon", "iu", "exo", "red velvet", "itzy", "enhypen", "babymonster"
    )

    private data class ClusterDefinition(
        val cluster: CultureCluster,
        val keywords: List<String>
    )

    private val CLUSTER_DEFINITIONS = listOf(
        ClusterDefinition(CultureCluster.INDO_INDIE_FOLK, indoIndieFolkKeywords),
        ClusterDefinition(CultureCluster.INDO_DANGDUT_KOPLO, indoDangdutKoploKeywords),
        ClusterDefinition(CultureCluster.WESTERN_ALT_INDIE, westernAltIndieKeywords),
        ClusterDefinition(CultureCluster.WESTERN_POP_RNB, westernPopRnbKeywords),
        ClusterDefinition(CultureCluster.WESTERN_ROCK_METAL, westernRockMetalKeywords),
        ClusterDefinition(CultureCluster.KPOP_ASIAN, kpopAsianKeywords)
    )

    private val bootlegTitleRegex = "\\b(cover by|karaoke|instrumental|tribute to|lofi remix|originally performed by|as made famous by|backing track|dj\\s+(?:remix|tiktok|jedag)|slowed\\s*(?:and|\\+)?\\s*reverb)\\b"
        .toRegex(RegexOption.IGNORE_CASE)

    private val bootlegArtistRegex = "\\b(karaoke|tribute band|tribute crew|the karaoke|paris music)\\b"
        .toRegex(RegexOption.IGNORE_CASE)

    private val jawaTitleOrArtistRegex = "\\b(tresno|lungo|loro|dalan|kisinan|tiwas|wirang|nemen|cidro|sewu|bojo|sayang|amung)\\b"
        .toRegex(RegexOption.IGNORE_CASE)

    private val jawaStrictDangdutRegex = "\\b(tresno|lungo|loro|dalan|kisinan|tiwas|wirang|nemen|cidro|sewu|bojo|koplo|dangdut)\\b"
        .toRegex(RegexOption.IGNORE_CASE)

    private val indoTitleRegex = "\\b(yang|dan|aku|kamu|kita|hati|cinta|senja|rindu|malam|tentang|kembali|bila|saat|menanti|hujan|hilang|selamat|pulang|bunga)\\b"
        .toRegex(RegexOption.IGNORE_CASE)

    private val hangulRegex = "[\\u3131-\\uD79D]".toRegex()

    private val dangdutKendangRegex = "\\b(dangdut|koplo|kendang)\\b".toRegex(RegexOption.IGNORE_CASE)
    private val dangdutRemixRegex = "\\b(dangdut|koplo|kendang|remix koplo)\\b".toRegex(RegexOption.IGNORE_CASE)

    fun detectCulture(artist: String, title: String): CultureCluster {
        val cleanArt = artist.lowercase().trim()
        val cleanTit = title.lowercase().trim()

        if (cleanArt.isEmpty() && cleanTit.isEmpty()) {
            return CultureCluster.UNKNOWN
        }

        // 1. Keyword matching on artist name
        for (def in CLUSTER_DEFINITIONS) {
            if (matchesArtist(cleanArt, def.keywords)) {
                return def.cluster
            }
        }

        // 2. Jawa language heuristic
        if (jawaTitleOrArtistRegex.containsMatchIn(cleanTit) || jawaTitleOrArtistRegex.containsMatchIn(cleanArt)) {
            return CultureCluster.INDO_DANGDUT_KOPLO
        }

        // 3. Indonesian lyrics heuristic
        if (indoTitleRegex.containsMatchIn(cleanTit)) {
            return CultureCluster.INDO_INDIE_FOLK
        }

        // 4. Hangul / K-Pop heuristic
        if (hangulRegex.containsMatchIn(cleanTit) || hangulRegex.containsMatchIn(cleanArt)) {
            return CultureCluster.KPOP_ASIAN
        }

        // 5. Default fallback
        return CultureCluster.WESTERN_ALT_INDIE
    }

    fun isBootlegOrKaraoke(title: String, artist: String): Boolean {
        val cleanTit = title.lowercase().trim()
        val cleanArt = artist.lowercase().trim()
        return bootlegTitleRegex.containsMatchIn(cleanTit) || bootlegArtistRegex.containsMatchIn(cleanArt)
    }

    fun isBootlegOrKaraoke(track: Track): Boolean {
        return isBootlegOrKaraoke(track.title, track.artist.name)
    }

    fun isCompatibleTrack(candidate: Track, seedTrack: Track, seedCluster: CultureCluster): Boolean {
        if (candidate.title.isBlank()) return false
        val candArt = candidate.artist.name.lowercase().trim()
        val candTit = candidate.title.lowercase().trim()
        val seedArt = seedTrack.artist.name.lowercase().trim()

        // 1. Reject generic bootlegs, unofficial covers, karaoke, slowed/reverb
        if (isBootlegOrKaraoke(candidate.title, candidate.artist.name)) {
            return false
        }

        // 2. Same artist is always 100% compatible
        if (candArt.isNotEmpty() && seedArt.isNotEmpty() && (candArt.contains(seedArt) || seedArt.contains(candArt))) {
            return true
        }

        // 3. Check cluster banned words
        for (banned in seedCluster.bannedWords) {
            if (candArt.contains(banned) || candTit.contains(banned)) {
                return false
            }
        }

        // 4. Strict culture isolation
        val isSeedIndo = seedCluster == CultureCluster.INDO_INDIE_FOLK || seedCluster == CultureCluster.INDO_DANGDUT_KOPLO
        val isSeedWestern = seedCluster == CultureCluster.WESTERN_ALT_INDIE ||
                seedCluster == CultureCluster.WESTERN_ROCK_METAL ||
                seedCluster == CultureCluster.WESTERN_POP_RNB

        if (isSeedIndo) {
            if (seedCluster == CultureCluster.INDO_DANGDUT_KOPLO) {
                val isCandDangdut = indoDangdutKoploKeywords.any { k -> candArt.contains(k) }
                val hasJawa = jawaStrictDangdutRegex.containsMatchIn(candTit)
                return isCandDangdut || hasJawa
            }

            // If seed is non-dangdut Indo, strictly reject dangdut
            if (indoDangdutKoploKeywords.any { k -> candArt.contains(k) }) return false
            if (dangdutRemixRegex.containsMatchIn(candTit)) return false

            // Reject non-Indonesian candidate
            val candCulture = detectCulture(candidate.artist.name, candidate.title)
            if (candCulture != CultureCluster.INDO_INDIE_FOLK && candCulture != CultureCluster.INDO_DANGDUT_KOPLO) {
                return false
            }
            return true
        }

        if (isSeedWestern) {
            if (dangdutKendangRegex.containsMatchIn(candTit)) return false
            val candCulture = detectCulture(candidate.artist.name, candidate.title)
            if (candCulture == CultureCluster.INDO_INDIE_FOLK || candCulture == CultureCluster.INDO_DANGDUT_KOPLO) {
                return false
            }
            return true
        }

        if (seedCluster == CultureCluster.KPOP_ASIAN) {
            val candCulture = detectCulture(candidate.artist.name, candidate.title)
            return candCulture == CultureCluster.KPOP_ASIAN
        }

        return true
    }

    private fun matchesArtist(cleanArt: String, keywords: List<String>): Boolean {
        if (cleanArt.isEmpty()) return false
        return keywords.any { k ->
            cleanArt.equals(k, ignoreCase = true) ||
            cleanArt.contains(k, ignoreCase = true) ||
            (cleanArt.length >= 4 && k.contains(cleanArt, ignoreCase = true))
        }
    }
}
