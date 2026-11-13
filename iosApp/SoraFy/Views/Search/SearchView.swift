import SwiftUI

private struct ExploreCategory: Identifiable {
    let id = UUID()
    let title: String
    let query: String
    let coverUrl: String
    let gradientColors: [Color]
}

public struct SearchView: View {
    @ObservedObject var viewModel: MusicPlayerViewModel
    @Environment(\.dismiss) private var dismiss
    @State private var searchText: String = ""

    private let trendingTags: [String] = [
        "Bernadya", "Sheila On 7", "Hindia", "Coldplay", "Tulus", "NIKI", "Denny Caknan"
    ]

    private let exploreCategories: [ExploreCategory] = [
        ExploreCategory(
            title: "Indo Pop",
            query: "Pop Indonesia Hits",
            coverUrl: "https://yt3.googleusercontent.com/PR-EXqPEf4aHFFLHknd2II-rvvVINdq7mS_eaHe4NEX11w2P6N8SztkPlouSzvGX6gtuMeeJXro=s576",
            gradientColors: [Color(red: 0.91, green: 0.12, blue: 0.39), Color(red: 1.0, green: 0.38, blue: 0.56)]
        ),
        ExploreCategory(
            title: "Indie Vibe",
            query: "Indie Indonesia",
            coverUrl: "https://i.scdn.co/image/ab67706f000000027dea5c0e18df3727eacdc4e1",
            gradientColors: [Color(red: 0.49, green: 0.34, blue: 0.76), Color(red: 0.70, green: 0.62, blue: 0.86)]
        ),
        ExploreCategory(
            title: "Dangdut & Koplo",
            query: "Dangdut Koplo Viral",
            coverUrl: "https://yt3.googleusercontent.com/2qHUJ20mtWoAZBU80LpQkNfu7EXSKKNs8K-MFFV5vIuFKDseRNHb1cVbmuzmfHvNJKKZGJ-cJKI=s576",
            gradientColors: [Color(red: 1.0, green: 0.60, blue: 0.0), Color(red: 1.0, green: 0.72, blue: 0.30)]
        ),
        ExploreCategory(
            title: "2000s Rock",
            query: "Rock Indonesia 2000an",
            coverUrl: "https://i.scdn.co/image/ab67706f00000002694bf33281695f3b7542a09a",
            gradientColors: [Color(red: 0.83, green: 0.18, blue: 0.18), Color(red: 0.94, green: 0.33, blue: 0.31)]
        ),
        ExploreCategory(
            title: "Acoustic & Chill",
            query: "Akustik Indonesia",
            coverUrl: "https://i.scdn.co/image/ab67706f000000020408713c731caaf1f800615a",
            gradientColors: [Color(red: 0.0, green: 0.59, blue: 0.53), Color(red: 0.30, green: 0.71, blue: 0.67)]
        ),
        ExploreCategory(
            title: "Lo-Fi Beats",
            query: "Lofi Hip Hop Beats",
            coverUrl: "https://i.scdn.co/image/ab67706f000000026020f2f6476db518ef747da4",
            gradientColors: [Color(red: 0.25, green: 0.32, blue: 0.71), Color(red: 0.47, green: 0.53, blue: 0.80)]
        ),
        ExploreCategory(
            title: "Hip-Hop & R&B",
            query: "Hip Hop Indonesia",
            coverUrl: "https://i.scdn.co/image/ab67706f00000002876581e4be85838f0e1ad09d",
            gradientColors: [Color(red: 0.10, green: 0.14, blue: 0.49), Color(red: 0.0, green: 0.74, blue: 0.83)]
        ),
        ExploreCategory(
            title: "90s Nostalgia",
            query: "Lagu Nostalgia 90an",
            coverUrl: "https://i.scdn.co/image/ab67706f0000000281ee550c81bbff8053a023e8",
            gradientColors: [Color(red: 0.36, green: 0.25, blue: 0.22), Color(red: 0.55, green: 0.43, blue: 0.39)]
        )
    ]

    private let gridColumns: [GridItem] = [
        GridItem(.flexible(), spacing: 12),
        GridItem(.flexible(), spacing: 12)
    ]

    public init(viewModel: MusicPlayerViewModel) {
        self.viewModel = viewModel
    }

    public var body: some View {
        NavigationStack {
            ZStack {
                Color(red: 0.043, green: 0.051, blue: 0.063) // Obsidian Background #0B0D10
                    .ignoresSafeArea()

                VStack(spacing: 0) {
                    // Search Input
                    HStack(spacing: 10) {
                        Image(systemName: "magnifyingglass")
                            .foregroundColor(.secondary)

                        TextField("Search songs, artists, or albums...", text: $searchText)
                            .foregroundColor(.white)
                            .autocorrectionDisabled()
                            .onSubmit {
                                Task {
                                    await viewModel.search(query: searchText)
                                }
                            }

                        if !searchText.isEmpty {
                            Button {
                                searchText = ""
                                viewModel.searchResults = []
                            } label: {
                                Image(systemName: "xmark.circle.fill")
                                    .foregroundColor(.secondary)
                            }
                            .buttonStyle(.plain)
                        }
                    }
                    .padding(12)
                    .background(Color(white: 0.12))
                    .clipShape(RoundedRectangle(cornerRadius: 12, style: .continuous))
                    .padding(.horizontal, 20)
                    .padding(.top, 10)
                    .padding(.bottom, 14)

                    // Main Content
                    if viewModel.isSearching {
                        Spacer()
                        ProgressView("Searching songs...")
                            .tint(.white)
                            .foregroundColor(.secondary)
                        Spacer()
                    } else if !searchText.trimmingCharacters(in: .whitespaces).isEmpty {
                        // Search Results State
                        if !viewModel.searchResults.isEmpty {
                            ScrollView(showsIndicators: false) {
                                LazyVStack(spacing: 6) {
                                    ForEach(viewModel.searchResults) { track in
                                        TrackRowView(
                                            track: track,
                                            isCurrent: viewModel.currentTrack?.id == track.id,
                                            onPlay: {
                                                viewModel.playTrack(track, queue: viewModel.searchResults)
                                            },
                                            onLike: {
                                                viewModel.toggleLike(track: track)
                                            }
                                        )
                                        .padding(.horizontal, 20)
                                    }
                                }
                                .padding(.top, 8)
                                .padding(.bottom, 90)
                            }
                        } else {
                            VStack(spacing: 14) {
                                Spacer()
                                Image(systemName: "music.note.magnifyingglass")
                                    .font(.system(size: 48))
                                    .foregroundColor(.secondary.opacity(0.4))
                                Text("No results found for \"\(searchText)\"")
                                    .font(.system(size: 14))
                                    .foregroundColor(.secondary)
                                Spacer()
                            }
                        }
                    } else {
                        // Default Empty State: Trending Now & Explore Categories
                        ScrollView(showsIndicators: false) {
                            VStack(alignment: .leading, spacing: 24) {
                                // Trending Now Tags
                                VStack(alignment: .leading, spacing: 12) {
                                    HStack(spacing: 8) {
                                        Image(systemName: "chart.line.uptrend.xyaxis")
                                            .font(.system(size: 14, weight: .semibold))
                                            .foregroundColor(Color(red: 0.0, green: 0.898, blue: 0.60)) // BrandGreen #00E599
                                        Text("Trending Now")
                                            .font(.system(size: 18, weight: .bold))
                                            .foregroundColor(.white)
                                    }
                                    .padding(.horizontal, 20)

                                    ScrollView(.horizontal, showsIndicators: false) {
                                        LazyHStack(spacing: 8) {
                                            ForEach(trendingTags, id: \.self) { tag in
                                                Button {
                                                    searchText = tag
                                                    Task {
                                                        await viewModel.search(query: tag)
                                                    }
                                                } label: {
                                                    Text(tag)
                                                        .font(.system(size: 13, weight: .semibold))
                                                        .foregroundColor(.white.opacity(0.88))
                                                        .padding(.horizontal, 14)
                                                        .padding(.vertical, 8)
                                                        .background(Color.white.opacity(0.06))
                                                        .clipShape(Capsule())
                                                        .overlay(
                                                            Capsule()
                                                                .stroke(Color.white.opacity(0.08), lineWidth: 1)
                                                        )
                                                }
                                                .buttonStyle(.plain)
                                            }
                                        }
                                        .padding(.horizontal, 20)
                                    }
                                }

                                // Explore Categories
                                VStack(alignment: .leading, spacing: 12) {
                                    HStack(spacing: 8) {
                                        Image(systemName: "square.grid.2x2.fill")
                                            .font(.system(size: 14, weight: .semibold))
                                            .foregroundColor(Color(red: 0.0, green: 0.898, blue: 0.60))
                                        Text("Explore Categories")
                                            .font(.system(size: 18, weight: .bold))
                                            .foregroundColor(.white)
                                    }
                                    .padding(.horizontal, 20)

                                    LazyVGrid(columns: gridColumns, spacing: 12) {
                                        ForEach(exploreCategories) { category in
                                            Button {
                                                searchText = category.title
                                                Task {
                                                    await viewModel.search(query: category.query)
                                                }
                                            } label: {
                                                ZStack(alignment: .bottomTrailing) {
                                                    LinearGradient(
                                                        colors: category.gradientColors,
                                                        startPoint: .topLeading,
                                                        endPoint: .bottomTrailing
                                                    )

                                                    VStack(alignment: .leading) {
                                                        Text(category.title)
                                                            .font(.system(size: 15, weight: .bold))
                                                            .foregroundColor(.white)
                                                            .lineLimit(2)
                                                            .multilineTextAlignment(.leading)
                                                            .padding(.top, 12)
                                                            .padding(.leading, 12)
                                                            .padding(.trailing, 46)
                                                        Spacer()
                                                    }
                                                    .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .topLeading)

                                                    AsyncImage(url: URL(string: category.coverUrl)) { phase in
                                                        if let img = phase.image {
                                                            img.resizable().aspectRatio(contentMode: .fill)
                                                        } else {
                                                            Color.white.opacity(0.18)
                                                        }
                                                    }
                                                    .frame(width: 56, height: 56)
                                                    .clipShape(RoundedRectangle(cornerRadius: 6, style: .continuous))
                                                    .rotationEffect(.degrees(20))
                                                    .offset(x: 14, y: 12)
                                                    .shadow(color: Color.black.opacity(0.35), radius: 4, x: 0, y: 2)
                                                }
                                                .frame(height: 90)
                                                .clipShape(RoundedRectangle(cornerRadius: 14, style: .continuous))
                                                .contentShape(RoundedRectangle(cornerRadius: 14, style: .continuous))
                                            }
                                            .buttonStyle(.plain)
                                        }
                                    }
                                    .padding(.horizontal, 20)
                                }
                            }
                            .padding(.top, 4)
                            .padding(.bottom, 90)
                        }
                    }
                }
            }
            .navigationTitle("Search")
            .navigationBarTitleDisplayMode(.inline)
            .toolbarColorScheme(.dark, for: .navigationBar)
            .toolbar {
                ToolbarItem(placement: .topBarTrailing) {
                    Button("Done") {
                        dismiss()
                    }
                    .font(.system(size: 15, weight: .semibold))
                    .foregroundColor(Color(red: 0.0, green: 0.898, blue: 0.60))
                }
            }
        }
    }
}
