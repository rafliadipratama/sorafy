import SwiftUI

public struct MainTabView: View {
    @StateObject private var viewModel = MusicPlayerViewModel.shared

    public init() {}

    public var body: some View {
        ZStack(alignment: .bottom) {
            TabView {
                HomeView(viewModel: viewModel)
                    .tabItem {
                        Label("Beranda", systemImage: "music.house.fill")
                    }

                SearchView(viewModel: viewModel)
                    .tabItem {
                        Label("Cari", systemImage: "magnifyingglass")
                    }

                LibraryView(viewModel: viewModel)
                    .tabItem {
                        Label("Pustaka", systemImage: "square.stack.fill")
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
