import SwiftUI

public struct MiniPlayerView: View {
    @ObservedObject var viewModel: MusicPlayerViewModel

    public init(viewModel: MusicPlayerViewModel) {
        self.viewModel = viewModel
    }

    public var body: some View {
        if let track = viewModel.currentTrack {
            Button {
                viewModel.isNowPlayingPresented = true
            } label: {
                HStack(spacing: 12) {
                    // Artwork
                    AsyncImage(url: URL(string: track.coverUrl)) { phase in
                        if let image = phase.image {
                            image
                                .resizable()
                                .aspectRatio(contentMode: .fill)
                        } else {
                            Color(white: 0.2)
                        }
                    }
                    .frame(width: 44, height: 44)
                    .clipShape(RoundedRectangle(cornerRadius: 8, style: .continuous))
                    .overlay(
                        RoundedRectangle(cornerRadius: 8, style: .continuous)
                            .stroke(Color.white.opacity(0.1), lineWidth: 1)
                    )

                    // Track Info
                    VStack(alignment: .leading, spacing: 2) {
                        Text(track.cleanTitle)
                            .font(.system(size: 14, weight: .semibold))
                            .foregroundColor(.white)
                            .lineLimit(1)

                        Text(track.artist.name)
                            .font(.system(size: 12, weight: .regular))
                            .foregroundColor(.white.opacity(0.65))
                            .lineLimit(1)
                    }

                    Spacer()

                    // Play/Pause Button
                    Button {
                        viewModel.togglePlayPause()
                    } label: {
                        Image(systemName: viewModel.isPlaying ? "pause.fill" : "play.fill")
                            .font(.system(size: 18))
                            .foregroundColor(.white)
                            .frame(width: 36, height: 36)
                    }
                    .buttonStyle(.plain)

                    // Next Button
                    Button {
                        viewModel.playNext()
                    } label: {
                        Image(systemName: "forward.fill")
                            .font(.system(size: 16))
                            .foregroundColor(.white.opacity(0.8))
                            .frame(width: 32, height: 32)
                    }
                    .buttonStyle(.plain)
                }
                .padding(.horizontal, 14)
                .padding(.vertical, 8)
                .background(
                    RoundedRectangle(cornerRadius: 14, style: .continuous)
                        .fill(Color(white: 0.12).opacity(0.92))
                        .background(
                            RoundedRectangle(cornerRadius: 14, style: .continuous)
                                .fill(.ultraThinMaterial)
                        )
                )
                .overlay(
                    RoundedRectangle(cornerRadius: 14, style: .continuous)
                        .stroke(Color.white.opacity(0.12), lineWidth: 0.8)
                )
                .shadow(color: Color.black.opacity(0.35), radius: 16, x: 0, y: 6)
                .padding(.horizontal, 16)
                .padding(.bottom, 6)
            }
            .buttonStyle(.plain)
        }
    }
}
