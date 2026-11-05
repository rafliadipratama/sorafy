import SwiftUI

public struct TrackRowView: View {
    public let track: Track
    public let isCurrent: Bool
    public let onPlay: () -> Void
    public let onLike: (() -> Void)?

    public init(
        track: Track,
        isCurrent: Bool = false,
        onPlay: @escaping () -> Void,
        onLike: (() -> Void)? = nil
    ) {
        self.track = track
        self.isCurrent = isCurrent
        self.onPlay = onPlay
        self.onLike = onLike
    }

    public var body: some View {
        Button(action: onPlay) {
            HStack(spacing: 14) {
                // Artwork
                AsyncImage(url: URL(string: track.coverUrl)) { phase in
                    switch phase {
                    case .success(let image):
                        image
                            .resizable()
                            .aspectRatio(contentMode: .fill)
                    default:
                        ZStack {
                            Color(white: 0.15)
                            Image(systemName: "music.note")
                                .foregroundColor(.secondary)
                        }
                    }
                }
                .frame(width: 48, height: 48)
                .clipShape(RoundedRectangle(cornerRadius: 8, style: .continuous))
                .overlay(
                    RoundedRectangle(cornerRadius: 8, style: .continuous)
                        .stroke(Color.white.opacity(0.08), lineWidth: 1)
                )

                // Track Info
                VStack(alignment: .leading, spacing: 3) {
                    Text(track.cleanTitle)
                        .font(.system(size: 15, weight: .semibold))
                        .foregroundColor(isCurrent ? .accentColor : .primary)
                        .lineLimit(1)

                    Text(track.fullArtistDisplay)
                        .font(.system(size: 13, weight: .regular))
                        .foregroundColor(.secondary)
                        .lineLimit(1)
                }

                Spacer()

                // Duration
                Text(track.durationFormatted)
                    .font(.system(size: 12, weight: .medium, design: .monospaced))
                    .foregroundColor(.secondary)

                // Like Button
                if let onLike = onLike {
                    Button(action: onLike) {
                        Image(systemName: track.isLiked ? "heart.fill" : "heart")
                            .font(.system(size: 15))
                            .foregroundColor(track.isLiked ? .red : .secondary)
                    }
                    .buttonStyle(.plain)
                    .padding(.leading, 6)
                }
            }
            .padding(.vertical, 4)
            .contentShape(Rectangle())
        }
        .buttonStyle(.plain)
    }
}
