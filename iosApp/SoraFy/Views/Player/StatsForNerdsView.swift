import SwiftUI

public struct StatsForNerdsView: View {
    @ObservedObject var viewModel: MusicPlayerViewModel
    @Environment(\.dismiss) private var dismiss

    public init(viewModel: MusicPlayerViewModel) {
        self.viewModel = viewModel
    }

    public var body: some View {
        NavigationStack {
            ZStack {
                Color(white: 0.08)
                    .ignoresSafeArea()

                ScrollView {
                    VStack(alignment: .leading, spacing: 16) {
                        Text("Informasi teknis diagnostik aliran audio real-time dan konfigurasi pemutaran.")
                            .font(.system(size: 13))
                            .foregroundColor(.secondary)
                            .padding(.horizontal, 4)

                        VStack(spacing: 1) {
                            if let track = viewModel.currentTrack {
                                statRow(title: "Track Title", value: track.cleanTitle)
                                statRow(title: "Artist", value: track.artist.name)
                                statRow(title: "Track ID", value: track.id)
                                statRow(title: "Codec", value: "AAC (mp4a.40.2 / itag 140)")
                                statRow(title: "Sample Rate", value: "48,000 Hz · Stereo")
                                statRow(title: "Bitrate", value: "160 kbps (High Quality)")
                                statRow(title: "Playhead Position", value: "\(track.durationFormatted) / \(formatSeconds(viewModel.playbackTime))")
                                statRow(title: "Audio Engine", value: "AVFoundation (AVPlayer Hardware Core)")
                                statRow(title: "Session Category", value: "AVAudioSessionCategoryPlayback")
                                statRow(title: "Lockscreen Control", value: "MPNowPlayingInfoCenter Active")
                            } else {
                                Text("Tidak ada trek audio yang sedang diputar.")
                                    .font(.system(size: 13))
                                    .foregroundColor(.secondary)
                                    .padding()
                            }
                        }
                        .background(Color(white: 0.14))
                        .clipShape(RoundedRectangle(cornerRadius: 14, style: .continuous))
                        .overlay(
                            RoundedRectangle(cornerRadius: 14, style: .continuous)
                                .stroke(Color.white.opacity(0.08), lineWidth: 1)
                        )
                    }
                    .padding(20)
                }
            }
            .navigationTitle("Stats for Nerds")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .topBarTrailing) {
                    Button("Tutup") {
                        dismiss()
                    }
                    .foregroundColor(.white)
                }
            }
        }
        .preferredColorScheme(.dark)
    }

    private func statRow(title: String, value: String) -> some View {
        HStack(alignment: .top) {
            Text(title)
                .font(.system(size: 12, weight: .medium, design: .monospaced))
                .foregroundColor(.secondary)
                .frame(width: 140, alignment: .leading)

            Spacer()

            Text(value)
                .font(.system(size: 12, weight: .semibold, design: .monospaced))
                .foregroundColor(.primary)
                .multilineTextAlignment(.trailing)
        }
        .padding(.horizontal, 16)
        .padding(.vertical, 11)
        .background(Color(white: 0.11))
    }

    private func formatSeconds(_ secs: Double) -> String {
        let s = Int(secs)
        return String(format: "%02d:%02d", s / 60, s % 60)
    }
}
