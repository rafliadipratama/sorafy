import SwiftUI

public struct LyricsView: View {
    @ObservedObject var viewModel: MusicPlayerViewModel

    public init(viewModel: MusicPlayerViewModel) {
        self.viewModel = viewModel
    }

    public var body: some View {
        ZStack {
            AmbientMeshBackdrop(
                coverUrl: viewModel.currentTrack?.coverUrl,
                isPlaying: viewModel.isPlaying
            )

            VStack(spacing: 0) {
                // Header Bar
                HStack {
                    VStack(alignment: .leading, spacing: 2) {
                        Text(viewModel.currentTrack?.cleanTitle ?? "Lirik")
                            .font(.system(size: 15, weight: .bold))
                            .foregroundColor(.white)
                            .lineLimit(1)

                        Text(viewModel.currentTrack?.artist.name ?? "")
                            .font(.system(size: 13, weight: .regular))
                            .foregroundColor(.white.opacity(0.6))
                    }

                    Spacer()

                    Button {
                        viewModel.isLyricsPresented = false
                    } label: {
                        Image(systemName: "chevron.down")
                            .font(.system(size: 16, weight: .semibold))
                            .foregroundColor(.white.opacity(0.8))
                            .padding(8)
                            .background(Color.white.opacity(0.12))
                            .clipShape(Circle())
                    }
                }
                .padding(.horizontal, 24)
                .padding(.top, 16)
                .padding(.bottom, 20)

                // Lyrics Content
                if viewModel.lyrics.hasSyncedLyrics {
                    ScrollViewReader { proxy in
                        ScrollView(showsIndicators: false) {
                            LazyVStack(alignment: .leading, spacing: 22) {
                                ForEach(Array(viewModel.lyrics.syncedLyrics.enumerated()), id: \.element.id) { index, line in
                                    let isActive = (index == viewModel.activeLyricIndex)

                                    Button {
                                        viewModel.seek(to: Double(line.timestampMs) / 1000.0)
                                    } label: {
                                        Text(line.text)
                                            .font(.system(
                                                size: isActive ? 26 : 22,
                                                weight: isActive ? .bold : .semibold
                                            ))
                                            .foregroundColor(isActive ? .white : .white.opacity(0.35))
                                            .scaleEffect(isActive ? 1.02 : 1.0, anchor: .leading)
                                            .multilineTextAlignment(.leading)
                                            .animation(.spring(response: 0.35, dampingFraction: 0.8), value: isActive)
                                    }
                                    .buttonStyle(.plain)
                                    .id(line.id)
                                }
                            }
                            .padding(.horizontal, 28)
                            .padding(.vertical, 40)
                        }
                        .onChange(of: viewModel.activeLyricIndex) { newIndex in
                            if newIndex >= 0 && newIndex < viewModel.lyrics.syncedLyrics.count {
                                withAnimation(.spring(response: 0.45, dampingFraction: 0.85)) {
                                    proxy.scrollTo(viewModel.lyrics.syncedLyrics[newIndex].id, anchor: .center)
                                }
                            }
                        }
                    }
                } else if let plain = viewModel.lyrics.plainLyrics, !plain.isEmpty {
                    ScrollView(showsIndicators: false) {
                        Text(plain)
                            .font(.system(size: 20, weight: .medium))
                            .foregroundColor(.white.opacity(0.85))
                            .lineSpacing(10)
                            .padding(28)
                    }
                } else {
                    VStack(spacing: 12) {
                        Spacer()
                        Image(systemName: "quote.bubble")
                            .font(.system(size: 44))
                            .foregroundColor(.white.opacity(0.4))
                        Text("Lirik tidak tersedia untuk lagu ini")
                            .font(.system(size: 15, weight: .medium))
                            .foregroundColor(.white.opacity(0.5))
                        Spacer()
                    }
                }
            }
        }
        .preferredColorScheme(.dark)
    }
}
