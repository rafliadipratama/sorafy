import SwiftUI

public struct LibraryView: View {
    @ObservedObject var viewModel: MusicPlayerViewModel
    @State private var selectedTab: Int = 0 // 0: Disukai, 1: Riwayat

    public init(viewModel: MusicPlayerViewModel) {
        self.viewModel = viewModel
    }

    public var body: some View {
        NavigationStack {
            ZStack {
                Color.black.ignoresSafeArea()

                VStack(spacing: 0) {
                    // Segmented Control
                    Picker("Pustaka", selection: $selectedTab) {
                        Text("Disukai (\(viewModel.likedTracks.count))").tag(0)
                        Text("Riwayat (\(viewModel.historyTracks.count))").tag(1)
                    }
                    .pickerStyle(.segmented)
                    .padding(.horizontal, 20)
                    .padding(.top, 10)
                    .padding(.bottom, 16)

                    let tracks = (selectedTab == 0) ? viewModel.likedTracks : viewModel.historyTracks

                    if tracks.isEmpty {
                        VStack(spacing: 12) {
                            Spacer()
                            Image(systemName: selectedTab == 0 ? "heart.slash" : "clock")
                                .font(.system(size: 44))
                                .foregroundColor(.secondary.opacity(0.4))
                            Text(selectedTab == 0 ? "Belum ada lagu yang disukai" : "Belum ada riwayat putar")
                                .font(.system(size: 14))
                                .foregroundColor(.secondary)
                            Spacer()
                        }
                    } else {
                        ScrollView(showsIndicators: false) {
                            LazyVStack(spacing: 6) {
                                ForEach(tracks) { track in
                                    TrackRowView(
                                        track: track,
                                        isCurrent: viewModel.currentTrack?.id == track.id,
                                        onPlay: {
                                            viewModel.playTrack(track, queue: tracks)
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
                    }
                }
            }
            .navigationTitle("Pustaka")
            .toolbarColorScheme(.dark, for: .navigationBar)
        }
    }
}
