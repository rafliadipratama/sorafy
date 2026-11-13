import SwiftUI

private struct OfficialChart: Identifiable {
    let id = UUID()
    let title: String
    let subtitle: String
    let coverUrl: String
    let gradientColors: [Color]
}

private struct CategoryItem: Identifiable {
    let id = UUID()
    let title: String
    let icon: String
    let coverUrl: String
}

public struct HomeView: View {
    @ObservedObject var viewModel: MusicPlayerViewModel
    @State private var isSearchPresented: Bool = false
    @State private var selectedFilter: String = "All"

    private let filterPills: [String] = [
        "All", "Chill & Relax", "Focus & Study", "Workout Energy", "Indo Pop", "Rock & Alternative"
    ]

    private let topCategories: [CategoryItem] = [
        CategoryItem(
            title: "Chill & Relax",
            icon: "headphones",
            coverUrl: "https://i.scdn.co/image/ab67706f000000020408713c731caaf1f800615a"
        ),
        CategoryItem(
            title: "Focus & Study",
            icon: "cup.and.saucer.fill",
            coverUrl: "https://i.scdn.co/image/ab67706f000000026020f2f6476db518ef747da4"
        ),
        CategoryItem(
            title: "Workout Energy",
            icon: "bolt.heart.fill",
            coverUrl: "https://i.scdn.co/image/ab67706f00000002385ff7ec006cdc4922f52557"
        ),
        CategoryItem(
            title: "Indo Pop",
            icon: "music.note",
            coverUrl: "https://yt3.googleusercontent.com/PR-EXqPEf4aHFFLHknd2II-rvvVINdq7mS_eaHe4NEX11w2P6N8SztkPlouSzvGX6gtuMeeJXro=s576"
        ),
        CategoryItem(
            title: "Rock & Alternative",
            icon: "guitars.fill",
            coverUrl: "https://i.scdn.co/image/ab67706f00000002694bf33281695f3b7542a09a"
        )
    ]

    private let officialCharts: [OfficialChart] = [
        OfficialChart(
            title: "Top 50 Indonesia",
            subtitle: "Official Indonesian Charts",
            coverUrl: "https://yt3.googleusercontent.com/wHZJ1dYK2lbb3ocVJMe1fE_FWf_pZI2ydIOwgSV9YeZcJpYSc8vAHHjt6_o4bRU9InAGeomx0v4n=s576",
            gradientColors: [Color(red: 0.0, green: 0.47, blue: 0.57), Color(red: 0.47, green: 1.0, blue: 0.84)]
        ),
        OfficialChart(
            title: "Top 50 Global",
            subtitle: "Most Popular Global Charts",
            coverUrl: "https://yt3.googleusercontent.com/t4PqTAJLy66M235aV912vM8pEKnAC0QM_zfhSomgdnQYYmBDJxoOzh1l0gWA7CRf9r_XyyEn0Go=s576",
            gradientColors: [Color(red: 0.54, green: 0.14, blue: 0.53), Color(red: 0.91, green: 0.25, blue: 0.34)]
        ),
        OfficialChart(
            title: "Viral Hits Indonesia",
            subtitle: "Trending Viral Hits",
            coverUrl: "https://yt3.googleusercontent.com/2qHUJ20mtWoAZBU80LpQkNfu7EXSKKNs8K-MFFV5vIuFKDseRNHb1cVbmuzmfHvNJKKZGJ-cJKI=s576",
            gradientColors: [Color(red: 0.07, green: 0.60, blue: 0.56), Color(red: 0.22, green: 0.94, blue: 0.49)]
        ),
        OfficialChart(
            title: "New Releases 2026",
            subtitle: "Fresh Music Drops",
            coverUrl: "https://yt3.googleusercontent.com/DF1qlviHbfG6kvfw1FBVtGGP-QHA-vpDs4-JZ-h51QCmPbW6XEzRIzcAkanyTzw9k4hopm62hJk=s576",
            gradientColors: [Color(red: 1.0, green: 0.25, blue: 0.42), Color(red: 1.0, green: 0.29, blue: 0.17)]
        )
    ]

    public init(viewModel: MusicPlayerViewModel) {
        self.viewModel = viewModel
    }

    public var body: some View {
        NavigationStack {
            ZStack {
                Color(red: 0.043, green: 0.051, blue: 0.063) // Obsidian Background #0B0D10
                    .ignoresSafeArea()

                ScrollView(showsIndicators: false) {
                    VStack(alignment: .leading, spacing: 24) {
                        // Brand Header & Top Search Action
                        HStack {
                            HStack(spacing: 8) {
                                Circle()
                                    .fill(Color(red: 0.0, green: 0.898, blue: 0.60)) // BrandGreen #00E599
                                    .frame(width: 12, height: 12)
                                Text("sorafy")
                                    .font(.system(size: 26, weight: .black, design: .rounded))
                                    .foregroundColor(.white)
                            }
                            Spacer()

                            Button {
                                isSearchPresented = true
                            } label: {
                                Image(systemName: "magnifyingglass")
                                    .font(.system(size: 16, weight: .bold))
                                    .foregroundColor(.white)
                                    .frame(width: 38, height: 38)
                                    .background(Color.white.opacity(0.08))
                                    .clipShape(Circle())
                            }
                            .buttonStyle(.plain)
                        }
                        .padding(.horizontal, 20)
                        .padding(.top, 10)

                        // Category Filter Pills
                        ScrollView(.horizontal, showsIndicators: false) {
                            HStack(spacing: 8) {
                                ForEach(filterPills, id: \.self) { pill in
                                    let isSelected = selectedFilter == pill
                                    Button {
                                        selectedFilter = pill
                                        if pill != "All" {
                                            Task {
                                                await viewModel.search(query: pill)
                                            }
                                        }
                                    } label: {
                                        Text(pill)
                                            .font(.system(size: 12.5, weight: isSelected ? .bold : .medium))
                                            .foregroundColor(isSelected ? Color(red: 0.05, green: 0.05, blue: 0.07) : .white.opacity(0.85))
                                            .padding(.horizontal, 14)
                                            .padding(.vertical, 7)
                                            .background(isSelected ? Color(red: 0.0, green: 0.898, blue: 0.60) : Color.white.opacity(0.06))
                                            .clipShape(Capsule())
                                    }
                                    .buttonStyle(.plain)
                                }
                            }
                            .padding(.horizontal, 20)
                        }

                        // Top Categories
                        VStack(alignment: .leading, spacing: 12) {
                            SectionTitle(title: "Top Categories", icon: "square.grid.2x2.fill")

                            ScrollView(.horizontal, showsIndicators: false) {
                                LazyHStack(spacing: 12) {
                                    ForEach(topCategories) { category in
                                        Button {
                                            selectedFilter = category.title
                                            Task {
                                                await viewModel.search(query: category.title)
                                            }
                                        } label: {
                                            HStack(spacing: 10) {
                                                AsyncImage(url: URL(string: category.coverUrl)) { phase in
                                                    if let img = phase.image {
                                                        img.resizable().aspectRatio(contentMode: .fill)
                                                    } else {
                                                        Color.white.opacity(0.08)
                                                            .overlay(
                                                                Image(systemName: category.icon)
                                                                    .font(.system(size: 13, weight: .semibold))
                                                                    .foregroundColor(Color(red: 0.0, green: 0.898, blue: 0.60))
                                                            )
                                                    }
                                                }
                                                .frame(width: 36, height: 36)
                                                .clipShape(RoundedRectangle(cornerRadius: 8, style: .continuous))

                                                Text(category.title)
                                                    .font(.system(size: 13, weight: .semibold))
                                                    .foregroundColor(.white)
                                            }
                                            .padding(.leading, 6)
                                            .padding(.trailing, 14)
                                            .padding(.vertical, 6)
                                            .background(Color.white.opacity(0.05))
                                            .clipShape(RoundedRectangle(cornerRadius: 12, style: .continuous))
                                            .overlay(
                                                RoundedRectangle(cornerRadius: 12, style: .continuous)
                                                    .stroke(Color.white.opacity(0.08), lineWidth: 1)
                                            )
                                        }
                                        .buttonStyle(.plain)
                                    }
                                }
                                .padding(.horizontal, 20)
                            }
                        }

                        // 1. Official Charts Hero Carousel (BitChord TopPicks Style)
                        VStack(alignment: .leading, spacing: 12) {
                            SectionTitle(title: "Top 50 Hits", icon: "chart.bar.fill")

                            ScrollView(.horizontal, showsIndicators: false) {
                                LazyHStack(spacing: 14) {
                                    ForEach(officialCharts) { chart in
                                        Button {
                                            if !viewModel.exploreData.trendingTracks.isEmpty {
                                                viewModel.playTrack(viewModel.exploreData.trendingTracks[0], queue: viewModel.exploreData.trendingTracks)
                                            }
                                        } label: {
                                            ZStack(alignment: .bottomLeading) {
                                                AsyncImage(url: URL(string: chart.coverUrl)) { phase in
                                                    if let img = phase.image {
                                                        img.resizable().aspectRatio(contentMode: .fill)
                                                    } else {
                                                        LinearGradient(
                                                            colors: chart.gradientColors,
                                                            startPoint: .topLeading,
                                                            endPoint: .bottomTrailing
                                                        )
                                                    }
                                                }
                                                .frame(width: 175, height: 118)
                                                .clipShape(RoundedRectangle(cornerRadius: 16, style: .continuous))

                                                // Gradient scrim overlay
                                                LinearGradient(
                                                    colors: [Color.black.opacity(0.15), Color.black.opacity(0.85)],
                                                    startPoint: .top,
                                                    endPoint: .bottom
                                                )
                                                .frame(width: 175, height: 118)
                                                .clipShape(RoundedRectangle(cornerRadius: 16, style: .continuous))

                                                VStack(alignment: .leading, spacing: 2) {
                                                    Spacer()
                                                    HStack(alignment: .bottom) {
                                                        VStack(alignment: .leading, spacing: 2) {
                                                            Text(chart.title)
                                                                 .font(.system(size: 14, weight: .bold))
                                                                .foregroundColor(.white)
                                                                .lineLimit(1)
                                                            Text(chart.subtitle)
                                                                .font(.system(size: 11, weight: .regular))
                                                                .foregroundColor(.white.opacity(0.8))
                                                                .lineLimit(1)
                                                        }
                                                        Spacer()
                                                        Circle()
                                                            .fill(Color.black.opacity(0.55))
                                                            .frame(width: 28, height: 28)
                                                            .overlay(
                                                                Image(systemName: "play.fill")
                                                                    .font(.system(size: 11))
                                                                    .foregroundColor(.white)
                                                            )
                                                    }
                                                }
                                                .padding(12)
                                                .frame(width: 175, height: 118)
                                            }
                                        }
                                        .buttonStyle(.plain)
                                    }
                                }
                                .padding(.horizontal, 20)
                            }
                        }

                        // 2. Quick Picks (BitChord 4-row-per-column horizontal pager)
                        if !viewModel.exploreData.trendingTracks.isEmpty {
                            VStack(alignment: .leading, spacing: 12) {
                                SectionTitle(title: "Quick Picks", icon: "bolt.fill")

                                let chunkedTracks = chunked(Array(viewModel.exploreData.trendingTracks.prefix(16)), size: 4)
                                ScrollView(.horizontal, showsIndicators: false) {
                                    LazyHStack(alignment: .top, spacing: 16) {
                                        ForEach(0..<chunkedTracks.count, id: \.self) { colIndex in
                                            VStack(alignment: .leading, spacing: 8) {
                                                ForEach(chunkedTracks[colIndex]) { track in
                                                    CompactSongRow(
                                                        track: track,
                                                        isCurrent: viewModel.currentTrack?.id == track.id,
                                                        isPlaying: viewModel.isPlaying,
                                                        onPlay: {
                                                            viewModel.playTrack(track, queue: viewModel.exploreData.trendingTracks)
                                                        }
                                                    )
                                                    .frame(width: 300)
                                                }
                                            }
                                        }
                                    }
                                    .padding(.horizontal, 20)
                                }
                            }
                        }

                        // 3. Recently Played (History)
                        if !viewModel.historyTracks.isEmpty {
                            VStack(alignment: .leading, spacing: 12) {
                                SectionTitle(title: "Recently Played", icon: "clock.arrow.circlepath")

                                ScrollView(.horizontal, showsIndicators: false) {
                                    LazyHStack(spacing: 14) {
                                        ForEach(Array(viewModel.historyTracks.prefix(12))) { track in
                                            Button {
                                                viewModel.playTrack(track, queue: viewModel.historyTracks)
                                            } label: {
                                                VStack(alignment: .leading, spacing: 6) {
                                                    AsyncImage(url: URL(string: track.coverUrl)) { phase in
                                                        if let img = phase.image {
                                                            img.resizable().aspectRatio(contentMode: .fill)
                                                        } else {
                                                            Color(white: 0.15)
                                                        }
                                                    }
                                                    .frame(width: 130, height: 130)
                                                    .clipShape(RoundedRectangle(cornerRadius: 14, style: .continuous))
                                                    .overlay(
                                                        RoundedRectangle(cornerRadius: 14, style: .continuous)
                                                            .stroke(Color.white.opacity(0.08), lineWidth: 1)
                                                    )

                                                    Text(track.cleanTitle)
                                                        .font(.system(size: 13, weight: .semibold))
                                                        .foregroundColor(.white)
                                                        .lineLimit(1)
                                                        .frame(width: 130, alignment: .leading)

                                                    Text(track.artist.name)
                                                        .font(.system(size: 11, weight: .regular))
                                                        .foregroundColor(.white.opacity(0.65))
                                                        .lineLimit(1)
                                                        .frame(width: 130, alignment: .leading)
                                                }
                                            }
                                            .buttonStyle(.plain)
                                        }
                                    }
                                    .padding(.horizontal, 20)
                                }
                            }
                        }

                        // 4. Popular Playlists
                        if !viewModel.exploreData.communityPlaylists.isEmpty {
                            VStack(alignment: .leading, spacing: 12) {
                                SectionTitle(title: "Popular Playlists", icon: "music.note.list")

                                ScrollView(.horizontal, showsIndicators: false) {
                                    LazyHStack(spacing: 14) {
                                        ForEach(viewModel.exploreData.communityPlaylists) { playlist in
                                            VStack(alignment: .leading, spacing: 6) {
                                                AsyncImage(url: URL(string: playlist.coverUrl ?? "")) { phase in
                                                    if let img = phase.image {
                                                        img.resizable().aspectRatio(contentMode: .fill)
                                                    } else {
                                                        Color(white: 0.15)
                                                    }
                                                }
                                                .frame(width: 136, height: 136)
                                                .clipShape(RoundedRectangle(cornerRadius: 14, style: .continuous))
                                                .overlay(
                                                    RoundedRectangle(cornerRadius: 14, style: .continuous)
                                                        .stroke(Color.white.opacity(0.08), lineWidth: 1)
                                                )

                                                Text(playlist.name)
                                                    .font(.system(size: 13, weight: .semibold))
                                                    .foregroundColor(.white)
                                                    .lineLimit(1)
                                                    .frame(width: 136, alignment: .leading)

                                                Text(playlist.description.isEmpty ? "Curated Playlist" : playlist.description)
                                                    .font(.system(size: 11, weight: .regular))
                                                    .foregroundColor(.white.opacity(0.65))
                                                    .lineLimit(1)
                                                    .frame(width: 136, alignment: .leading)
                                            }
                                        }
                                    }
                                    .padding(.horizontal, 20)
                                }
                            }
                        }

                        // 5. Popular Artists For You
                        if !viewModel.exploreData.popularArtists.isEmpty {
                            VStack(alignment: .leading, spacing: 12) {
                                SectionTitle(title: "Popular Artists For You", icon: "mic.fill")

                                ScrollView(.horizontal, showsIndicators: false) {
                                    LazyHStack(spacing: 16) {
                                        ForEach(viewModel.exploreData.popularArtists) { artist in
                                            VStack(alignment: .center, spacing: 6) {
                                                AsyncImage(url: URL(string: artist.avatarUrl ?? "")) { phase in
                                                    if let img = phase.image {
                                                        img.resizable().aspectRatio(contentMode: .fill)
                                                    } else {
                                                        Color(white: 0.15)
                                                    }
                                                }
                                                .frame(width: 90, height: 90)
                                                .clipShape(Circle())
                                                .overlay(
                                                    Circle().stroke(Color.white.opacity(0.12), lineWidth: 1)
                                                )

                                                Text(artist.name)
                                                    .font(.system(size: 12, weight: .medium))
                                                    .foregroundColor(.white)
                                                    .lineLimit(1)
                                                    .frame(width: 90, alignment: .center)
                                            }
                                        }
                                    }
                                    .padding(.horizontal, 20)
                                }
                            }
                        }
                    }
                    .padding(.bottom, 120) // space for mini player and bottom nav
                }
            }
            .navigationBarHidden(true)
            .sheet(isPresented: $isSearchPresented) {
                SearchView(viewModel: viewModel)
            }
        }
    }

    private func chunked<T>(_ array: [T], size: Int) -> [[T]] {
        stride(from: 0, to: array.count, by: size).map {
            Array(array[$0..<min($0 + size, array.count)])
        }
    }
}

private struct SectionTitle: View {
    let title: String
    let icon: String

    var body: some View {
        HStack(spacing: 8) {
            Image(systemName: icon)
                .font(.system(size: 14, weight: .semibold))
                .foregroundColor(Color(red: 0.0, green: 0.898, blue: 0.60)) // #00E599
            Text(title)
                .font(.system(size: 18, weight: .bold))
                .foregroundColor(.white)
        }
        .padding(.horizontal, 20)
    }
}

private struct CompactSongRow: View {
    let track: Track
    let isCurrent: Bool
    let isPlaying: Bool
    let onPlay: () -> Void

    var body: some View {
        Button(action: onPlay) {
            HStack(spacing: 12) {
                AsyncImage(url: URL(string: track.coverUrl)) { phase in
                    if let img = phase.image {
                        img.resizable().aspectRatio(contentMode: .fill)
                    } else {
                        Color(white: 0.15)
                    }
                }
                .frame(width: 48, height: 48)
                .clipShape(RoundedRectangle(cornerRadius: 10, style: .continuous))
                .overlay(
                    ZStack {
                        if isCurrent {
                            Color.black.opacity(0.4)
                            Image(systemName: isPlaying ? "waveform" : "play.fill")
                                .font(.system(size: 14))
                                .foregroundColor(Color(red: 0.0, green: 0.898, blue: 0.60))
                        }
                    }
                )

                VStack(alignment: .leading, spacing: 2) {
                    Text(track.cleanTitle)
                        .font(.system(size: 14, weight: .semibold))
                        .foregroundColor(isCurrent ? Color(red: 0.0, green: 0.898, blue: 0.60) : .white)
                        .lineLimit(1)

                    Text(track.fullArtistDisplay)
                        .font(.system(size: 12, weight: .regular))
                        .foregroundColor(.white.opacity(0.65))
                        .lineLimit(1)
                }

                Spacer()
            }
            .padding(.vertical, 4)
            .padding(.horizontal, 8)
            .background(
                RoundedRectangle(cornerRadius: 12, style: .continuous)
                    .fill(isCurrent ? Color(white: 0.16) : Color.white.opacity(0.04))
            )
        }
        .buttonStyle(.plain)
    }
}
