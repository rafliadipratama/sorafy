import SwiftUI

public struct MainTabView: View {
    @StateObject private var viewModel = MusicPlayerViewModel.shared

    public init() {}

    public var body: some View {
        ZStack(alignment: .bottom) {
            TabView {
                HomeView(viewModel: viewModel)
                    .tabItem {
                        Label("Home", systemImage: "music.house.fill")
                    }

                LibraryView(viewModel: viewModel)
                    .tabItem {
                        Label("Library", systemImage: "square.stack.fill")
                    }

                SettingsView(viewModel: viewModel)
                    .tabItem {
                        Label("Settings", systemImage: "gearshape.fill")
                    }
            }
            .tint(.white)

            // Floating MiniPlayer docked above the tab bar
            MiniPlayerView(viewModel: viewModel)
                .padding(.bottom, 50)
        }
        .fullScreenCover(isPresented: $viewModel.isNowPlayingPresented) {
            NowPlayingView(viewModel: viewModel)
        }
        .preferredColorScheme(.dark)
    }
}
