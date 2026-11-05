import SwiftUI

public struct AmbientMeshBackdrop: View {
    public let coverUrl: String?
    public var isPlaying: Bool

    public init(coverUrl: String?, isPlaying: Bool = true) {
        self.coverUrl = coverUrl
        self.isPlaying = isPlaying
    }

    public var body: some View {
        ZStack {
            Color.black

            if let coverUrl = coverUrl, let url = URL(string: coverUrl) {
                AsyncImage(url: url) { phase in
                    if let image = phase.image {
                        image
                            .resizable()
                            .aspectRatio(contentMode: .fill)
                            .frame(maxWidth: .infinity, maxHeight: .infinity)
                            .blur(radius: 80)
                            .saturation(1.3)
                            .brightness(-0.35)
                            .opacity(isPlaying ? 0.75 : 0.45)
                            .animation(.easeInOut(duration: 0.8), value: isPlaying)
                            .animation(.easeInOut(duration: 0.8), value: coverUrl)
                    }
                }
            }
        }
        .ignoresSafeArea()
    }
}
