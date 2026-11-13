import SwiftUI

public struct SearchView: View {
    @ObservedObject var viewModel: MusicPlayerViewModel
    @State private var searchText: String = ""

    public init(viewModel: MusicPlayerViewModel) {
        self.viewModel = viewModel
    }

    public var body: some View {
        NavigationStack {
            ZStack {
                Color.black.ignoresSafeArea()

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
                        }
                    }
                    .padding(12)
                    .background(Color(white: 0.12))
                    .clipShape(RoundedRectangle(cornerRadius: 12, style: .continuous))
                    .padding(.horizontal, 20)
                    .padding(.top, 10)
                    .padding(.bottom, 14)

                    // Results List
                    if viewModel.isSearching {
                        Spacer()
                        ProgressView("Searching songs...")
                            .tint(.white)
                            .foregroundColor(.secondary)
                        Spacer()
                    } else if !viewModel.searchResults.isEmpty {
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
                            Text("Search millions of songs from multiple sources")
                                .font(.system(size: 14))
                                .foregroundColor(.secondary)
                            Spacer()
                        }
                    }
                }
            }
            .navigationTitle("Search")
            .toolbarColorScheme(.dark, for: .navigationBar)
        }
    }
}
