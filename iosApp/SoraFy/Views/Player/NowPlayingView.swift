import SwiftUI

public struct NowPlayingView: View {
    @ObservedObject var viewModel: MusicPlayerViewModel
    @Environment(\.dismiss) private var dismiss

    @State private var isDraggingSeekbar = false
    @State private var dragPositionSec = 0.0
    @State private var volume: Double = 0.8

    public init(viewModel: MusicPlayerViewModel) {
        self.viewModel = viewModel
    }

    public var body: some View {
        ZStack {
            // Ambient Mesh Backdrop
            AmbientMeshBackdrop(
                coverUrl: viewModel.currentTrack?.coverUrl,
                isPlaying: viewModel.isPlaying
            )

            VStack(spacing: 0) {
                // Top Grabber & Controls
                HStack {
                    Button {
                        dismiss()
                    } label: {
                        Image(systemName: "chevron.down")
                            .font(.system(size: 18, weight: .bold))
                            .foregroundColor(.white.opacity(0.85))
                            .padding(8)
                    }

                    Spacer()

                    // Audio Badge / Stats for Nerds trigger
                    Button {
                        viewModel.isStatsPresented = true
                    } label: {
                        HStack(spacing: 4) {
                            Text("Opus HD")
                                .font(.system(size: 11, weight: .bold))
                            Image(systemName: "info.circle")
                                .font(.system(size: 11))
                        }
                        .foregroundColor(.white)
                        .padding(.horizontal, 10)
                        .padding(.vertical, 5)
                        .background(Color.white.opacity(0.12))
                        .clipShape(Capsule())
                    }
                }
                .padding(.horizontal, 24)
                .padding(.top, 14)

                Spacer(minLength: 20)

                // High-Res Artwork Box (Apple Music style)
                if let track = viewModel.currentTrack {
                    AsyncImage(url: URL(string: track.coverUrl)) { phase in
                        if let image = phase.image {
                            image
                                .resizable()
                                .aspectRatio(contentMode: .fill)
                        } else {
                            ZStack {
                                Color(white: 0.16)
                                Image(systemName: "music.note")
                                    .font(.system(size: 64))
                                    .foregroundColor(.white.opacity(0.3))
                            }
                        }
                    }
                    .frame(maxWidth: 320, maxHeight: 320)
                    .aspectRatio(1, contentMode: .fit)
                    .clipShape(RoundedRectangle(cornerRadius: 22, style: .continuous))
                    .overlay(
                        RoundedRectangle(cornerRadius: 22, style: .continuous)
                            .stroke(Color.white.opacity(0.1), lineWidth: 1)
                    )
                    .shadow(color: Color.black.opacity(0.55), radius: 36, x: 0, y: 18)
                    .scaleEffect(viewModel.isPlaying ? 1.0 : 0.94)
                    .animation(.spring(response: 0.4, dampingFraction: 0.75), value: viewModel.isPlaying)
                    .padding(.horizontal, 32)
                }

                Spacer(minLength: 28)

                // Track Metadata Row
                if let track = viewModel.currentTrack {
                    HStack(alignment: .center) {
                        VStack(alignment: .leading, spacing: 4) {
                            Text(track.cleanTitle)
                                .font(.system(size: 22, weight: .bold))
                                .foregroundColor(.white)
                                .lineLimit(1)

                            Text(track.fullArtistDisplay)
                                .font(.system(size: 16, weight: .medium))
                                .foregroundColor(.white.opacity(0.65))
                                .lineLimit(1)
                        }

                        Spacer()

                        Button {
                            viewModel.toggleLike(track: track)
                        } label: {
                            Image(systemName: track.isLiked ? "heart.fill" : "heart")
                                .font(.system(size: 22))
                                .foregroundColor(track.isLiked ? .red : .white.opacity(0.8))
                                .padding(8)
                        }
                    }
                    .padding(.horizontal, 32)
                }

                // Seekbar & Durations
                VStack(spacing: 8) {
                    Slider(
                        value: Binding(
                            get: {
                                isDraggingSeekbar ? dragPositionSec : viewModel.playbackTime
                            },
                            set: { newVal in
                                dragPositionSec = newVal
                            }
                        ),
                        in: 0...max(viewModel.duration, 1.0)
                    ) { editing in
                        isDraggingSeekbar = editing
                        if !editing {
                            viewModel.seek(to: dragPositionSec)
                        }
                    }
                    .tint(.white)

                    HStack {
                        Text(formatTime(isDraggingSeekbar ? dragPositionSec : viewModel.playbackTime))
                            .font(.system(size: 12, weight: .medium, design: .monospaced))
                            .foregroundColor(.white.opacity(0.6))

                        Spacer()

                        Text(formatTime(viewModel.duration))
                            .font(.system(size: 12, weight: .medium, design: .monospaced))
                            .foregroundColor(.white.opacity(0.6))
                    }
                }
                .padding(.horizontal, 32)
                .padding(.top, 14)

                // Transport Controls (Shuffle, Prev, Play/Pause, Next, Repeat)
                HStack(spacing: 28) {
                    Button {
                        viewModel.toggleShuffle()
                    } label: {
                        Image(systemName: "shuffle")
                            .font(.system(size: 18, weight: .semibold))
                            .foregroundColor(viewModel.isShuffle ? .white : .white.opacity(0.45))
                    }

                    Button {
                        viewModel.playPrevious()
                    } label: {
                        Image(systemName: "backward.fill")
                            .font(.system(size: 26))
                            .foregroundColor(.white)
                    }

                    Button {
                        viewModel.togglePlayPause()
                    } label: {
                        Image(systemName: viewModel.isPlaying ? "pause.circle.fill" : "play.circle.fill")
                            .font(.system(size: 64))
                            .foregroundColor(.white)
                    }

                    Button {
                        viewModel.playNext()
                    } label: {
                        Image(systemName: "forward.fill")
                            .font(.system(size: 26))
                            .foregroundColor(.white)
                    }

                    Button {
                        viewModel.cycleRepeatMode()
                    } label: {
                        Image(systemName: viewModel.repeatMode == 2 ? "repeat.1" : "repeat")
                            .font(.system(size: 18, weight: .semibold))
                            .foregroundColor(viewModel.repeatMode > 0 ? .white : .white.opacity(0.45))
                    }
                }
                .padding(.top, 18)

                // Apple Music Volume Slider
                HStack(spacing: 12) {
                    Button {
                        volume = 0.0
                    } label: {
                        Image(systemName: "speaker.fill")
                            .font(.system(size: 12, weight: .semibold))
                            .foregroundColor(.white.opacity(0.55))
                    }

                    Slider(value: $volume, in: 0...1.0)
                        .tint(.white)

                    Button {
                        volume = 1.0
                    } label: {
                        Image(systemName: "speaker.wave.3.fill")
                            .font(.system(size: 14, weight: .semibold))
                            .foregroundColor(.white.opacity(0.55))
                    }
                }
                .padding(.horizontal, 32)
                .padding(.top, 16)

                // Bottom Action Bar (Lyrics & Details)
                HStack(spacing: 40) {
                    Button {
                        viewModel.isLyricsPresented = true
                    } label: {
                        Image(systemName: "quote.bubble")
                            .font(.system(size: 20))
                            .foregroundColor(viewModel.lyrics.hasSyncedLyrics ? .white : .white.opacity(0.45))
                    }

                    Button {
                        viewModel.isStatsPresented = true
                    } label: {
                        Image(systemName: "chart.bar.xaxis")
                            .font(.system(size: 19))
                            .foregroundColor(.white.opacity(0.65))
                    }
                }
                .padding(.top, 24)
                .padding(.bottom, 36)
            }
        }
        .sheet(isPresented: $viewModel.isLyricsPresented) {
            LyricsView(viewModel: viewModel)
        }
        .sheet(isPresented: $viewModel.isStatsPresented) {
            StatsForNerdsView(viewModel: viewModel)
        }
        .preferredColorScheme(.dark)
    }

    private func formatTime(_ seconds: Double) -> String {
        guard !seconds.isNaN && seconds >= 0 else { return "0:00" }
        let total = Int(seconds)
        let mins = total / 60
        let secs = total % 60
        return String(format: "%02d:%02d", mins, secs)
    }
}
