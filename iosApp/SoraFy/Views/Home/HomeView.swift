import SwiftUI

public struct HomeView: View {
    @ObservedObject var viewModel: MusicPlayerViewModel

    public init(viewModel: MusicPlayerViewModel) {
        self.viewModel = viewModel
    }

    public var body: some View {
        NavigationStack {
            ZStack {
                Color.black.ignoresSafeArea()

                ScrollView(showsIndicators: false) {
                    VStack(alignment: .leading, spacing: 28) {
                        // Quick Picks / Top Indonesia Section
                        VStack(alignment: .leading, spacing: 14) {
                            Text("Top 50 Indonesia")
                                .font(.system(size: 22, weight: .bold))
                                .foregroundColor(.white)
                                .padding(.horizontal, 20)

                            if viewModel.exploreData.trendingTracks.isEmpty {
                                HStack {
                                    Spacer()
                                    ProgressView()
                                        .tint(.white)
                                        .padding(.vertical, 40)
                                    Spacer()
                                }
                            } else {
                                LazyVStack(spacing: 8) {
                                    ForEach(viewModel.exploreData.trendingTracks) { track in
                                        TrackRowView(
                                            track: track,
                                            isCurrent: viewModel.currentTrack?.id == track.id,
                                            onPlay: {
                                                viewModel.playTrack(track, queue: viewModel.exploreData.trendingTracks)
                                            },
                                            onLike: {
                                                viewModel.toggleLike(track: track)
                                            }
                                        )
                                        .padding(.horizontal, 20)
                                    }
                                }
                            }
                        }

                        // Recently Played / History Section
                        if !viewModel.historyTracks.isEmpty {
                            VStack(alignment: .leading, spacing: 14) {
                                Text("Putar Lagi")
                                    .font(.system(size: 20, weight: .bold))
                                    .foregroundColor(.white)
                                    .padding(.horizontal, 20)

                                ScrollView(.horizontal, showsIndicators: false) {
                                    LazyHStack(spacing: 16) {
                                        ForEach(viewModel.historyTracks.prefix(12)) { track in
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
                                                    .clipShape(RoundedRectangle(cornerRadius: 12, style: .continuous))

                                                    Text(track.cleanTitle)
                                                        .font(.system(size: 13, weight: .semibold))
                                                        .foregroundColor(.white)
                                                        .lineLimit(1)
                                                        .frame(width: 130, alignment: .leading)

                                                    Text(track.artist.name)
                                                        .font(.system(size: 11, weight: .regular))
                                                        .foregroundColor(.secondary)
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
                    }
                    .padding(.top, 16)
                    .padding(.bottom, 90) // space for mini player
                }
            }
            .navigationTitle("SoraFy")
            .toolbarColorScheme(.dark, for: .navigationBar)
        }
    }
}
