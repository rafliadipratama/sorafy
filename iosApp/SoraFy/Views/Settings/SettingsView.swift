import SwiftUI

public struct PluginItem: Identifiable {
    public let id: String
    public var name: String
    public var description: String
    public var version: String
    public var isEnabled: Bool

    public init(id: String, name: String, description: String, version: String, isEnabled: Bool) {
        self.id = id
        self.name = name
        self.description = description
        self.version = version
        self.isEnabled = isEnabled
    }
}

public struct SettingsView: View {
    @ObservedObject var viewModel: MusicPlayerViewModel

    // Audio & Playback settings
    @AppStorage("sorafy_audio_quality") private var audioQuality: String = "Opus HD (160 kbps)"
    @AppStorage("sorafy_crossmix_style") private var crossmixStyle: String = "Equal Power"
    @AppStorage("sorafy_volume_normalization") private var isVolumeNormalizationEnabled: Bool = true

    // Preferences
    @AppStorage("sorafy_language") private var selectedLanguage: String = "English"
    @State private var cacheSizeDisplay: String = "48.2 MB"
    @State private var showClearCacheAlert: Bool = false
    @State private var isCacheCleared: Bool = false

    // Plugins & Extensions
    @State private var plugins: [PluginItem] = [
        PluginItem(
            id: "ytm_resolver",
            name: "YouTube Music Resolver",
            description: "Primary audio stream extractor with high-res Opus support",
            version: "v2.4.0",
            isEnabled: true
        ),
        PluginItem(
            id: "audion_dsp",
            name: "Audion Sound Parser",
            description: "Advanced spatial audio enhancer and lossless filter",
            version: "v1.2.1",
            isEnabled: true
        ),
        PluginItem(
            id: "spotify_meta",
            name: "Spotify Metadata Bridge",
            description: "Cross-references tracks and album art from public registry",
            version: "v1.0.8",
            isEnabled: true
        ),
        PluginItem(
            id: "lrclib_sync",
            name: "LRCLIB Lyrics Sync",
            description: "Real-time synchronized LRC lyrics provider",
            version: "v2.0.0",
            isEnabled: true
        ),
        PluginItem(
            id: "soundcloud_resolver",
            name: "SoundCloud Fallback",
            description: "Alternative audio streaming source for indie and live tracks",
            version: "v1.1.0",
            isEnabled: false
        )
    ]

    @State private var showAddPluginSheet: Bool = false
    @State private var newPluginName: String = ""
    @State private var newPluginDescription: String = ""
    @State private var newPluginEndpoint: String = ""

    private let crossmixStyles = ["Equal Power", "Smooth Blend", "Bass Swap", "Club Echo", "Off"]
    private let languages = ["English", "Bahasa Indonesia", "日本語 (Japanese)"]

    public init(viewModel: MusicPlayerViewModel) {
        self.viewModel = viewModel
    }

    public var body: some View {
        NavigationStack {
            ZStack {
                Color(red: 0.043, green: 0.051, blue: 0.063) // Obsidian Background #0B0D10
                    .ignoresSafeArea()

                ScrollView(showsIndicators: false) {
                    VStack(alignment: .leading, spacing: 24) {
                        // Header
                        headerView

                        // Section 1: Audio & Playback
                        audioPlaybackSection

                        // Section 2: Plugins & Extensions
                        pluginsExtensionsSection

                        // Section 3: Preferences
                        preferencesSection

                        // App Version Footer
                        appVersionFooter
                    }
                    .padding(.horizontal, 20)
                    .padding(.top, 16)
                    .padding(.bottom, 120) // Space for floating MiniPlayer & TabBar
                }
            }
            .navigationBarHidden(true)
            .sheet(isPresented: $showAddPluginSheet) {
                addPluginSheet
            }
            .alert("Clear Audio Cache", isPresented: $showClearCacheAlert) {
                Button("Cancel", role: .cancel) {}
                Button("Clear", role: .destructive) {
                    viewModel.clearAudioCache()
                    cacheSizeDisplay = "0.0 MB"
                    isCacheCleared = true
                }
            } message: {
                Text("This will remove all locally cached audio stream chunks and temporary session files.")
            }
        }
    }

    // MARK: - Header
    private var headerView: some View {
        HStack(spacing: 14) {
            ZStack {
                RoundedRectangle(cornerRadius: 14, style: .continuous)
                    .fill(Color(red: 0.0, green: 0.898, blue: 0.60).opacity(0.15))
                    .frame(width: 44, height: 44)

                Image(systemName: "gearshape.fill")
                    .font(.system(size: 22))
                    .foregroundColor(Color(red: 0.0, green: 0.898, blue: 0.60)) // BrandGreen #00E599
            }

            VStack(alignment: .leading, spacing: 2) {
                Text("Settings")
                    .font(.system(size: 26, weight: .black, design: .rounded))
                    .foregroundColor(.white)

                Text("Audio engine, extensions & preferences")
                    .font(.system(size: 13, weight: .regular))
                    .foregroundColor(.white.opacity(0.65))
            }

            Spacer()
        }
        .padding(.top, 6)
    }

    // MARK: - Section 1: Audio & Playback
    private var audioPlaybackSection: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Audio & Playback")
                .font(.system(size: 16, weight: .bold))
                .foregroundColor(.white)

            VStack(spacing: 12) {
                // Quality Opus HD
                HStack(spacing: 14) {
                    ZStack {
                        Circle()
                            .fill(Color(red: 0.0, green: 0.79, blue: 1.0).opacity(0.15))
                            .frame(width: 36, height: 36)
                        Image(systemName: "waveform.badge.plus")
                            .font(.system(size: 16))
                            .foregroundColor(Color(red: 0.0, green: 0.79, blue: 1.0))
                    }

                    VStack(alignment: .leading, spacing: 2) {
                        Text("Stream Quality")
                            .font(.system(size: 14, weight: .semibold))
                            .foregroundColor(.white)
                        Text("Quality Opus HD (160 kbps, 48 kHz)")
                            .font(.system(size: 12))
                            .foregroundColor(.white.opacity(0.6))
                    }

                    Spacer()

                    Text("Opus HD")
                        .font(.system(size: 11, weight: .bold))
                        .foregroundColor(Color(red: 0.0, green: 0.898, blue: 0.60))
                        .padding(.horizontal, 9)
                        .padding(.vertical, 5)
                        .background(Color(red: 0.0, green: 0.898, blue: 0.60).opacity(0.12))
                        .clipShape(Capsule())
                }
                .padding(14)
                .background(Color.white.opacity(0.04))
                .clipShape(RoundedRectangle(cornerRadius: 14, style: .continuous))

                // Crossmix Transition
                VStack(alignment: .leading, spacing: 10) {
                    HStack(spacing: 14) {
                        ZStack {
                            Circle()
                                .fill(Color(red: 0.0, green: 0.79, blue: 1.0).opacity(0.15))
                                .frame(width: 36, height: 36)
                            Image(systemName: "speedometer")
                                .font(.system(size: 16))
                                .foregroundColor(Color(red: 0.0, green: 0.79, blue: 1.0))
                        }

                        VStack(alignment: .leading, spacing: 2) {
                            Text("Crossmix Transitions")
                                .font(.system(size: 14, weight: .semibold))
                                .foregroundColor(.white)
                            Text("Active: \(crossmixStyle)")
                                .font(.system(size: 12))
                                .foregroundColor(Color(red: 0.0, green: 0.79, blue: 1.0))
                        }

                        Spacer()
                    }

                    // Style Chip Selector
                    ScrollView(.horizontal, showsIndicators: false) {
                        HStack(spacing: 8) {
                            ForEach(crossmixStyles, id: \.self) { style in
                                let isSelected = crossmixStyle == style
                                Button {
                                    crossmixStyle = style
                                } label: {
                                    Text(style)
                                        .font(.system(size: 12, weight: isSelected ? .bold : .medium))
                                        .foregroundColor(isSelected ? Color(red: 0.05, green: 0.05, blue: 0.07) : .white.opacity(0.8))
                                        .padding(.horizontal, 12)
                                        .padding(.vertical, 7)
                                        .background(isSelected ? Color(red: 0.0, green: 0.79, blue: 1.0) : Color.white.opacity(0.06))
                                        .clipShape(RoundedRectangle(cornerRadius: 10, style: .continuous))
                                }
                                .buttonStyle(.plain)
                            }
                        }
                    }
                }
                .padding(14)
                .background(Color.white.opacity(0.04))
                .clipShape(RoundedRectangle(cornerRadius: 14, style: .continuous))

                // Volume Normalization
                HStack(spacing: 14) {
                    ZStack {
                        Circle()
                            .fill(Color(red: 1.0, green: 0.60, blue: 0.0).opacity(0.15))
                            .frame(width: 36, height: 36)
                        Image(systemName: "speaker.wave.2.fill")
                            .font(.system(size: 16))
                            .foregroundColor(Color(red: 1.0, green: 0.60, blue: 0.0))
                    }

                    VStack(alignment: .leading, spacing: 2) {
                        Text("Volume Normalization")
                            .font(.system(size: 14, weight: .semibold))
                            .foregroundColor(.white)
                        Text("Auto volume leveling (-14 LUFS target)")
                            .font(.system(size: 12))
                            .foregroundColor(.white.opacity(0.6))
                    }

                    Spacer()

                    Toggle("", isOn: $isVolumeNormalizationEnabled)
                        .labelsHidden()
                        .tint(Color(red: 0.0, green: 0.898, blue: 0.60))
                }
                .padding(14)
                .background(Color.white.opacity(0.04))
                .clipShape(RoundedRectangle(cornerRadius: 14, style: .continuous))
            }
            .padding(16)
            .background(Color(white: 0.09))
            .clipShape(RoundedRectangle(cornerRadius: 18, style: .continuous))
            .overlay(
                RoundedRectangle(cornerRadius: 18, style: .continuous)
                    .stroke(Color.white.opacity(0.06), lineWidth: 1)
            )
        }
    }

    // MARK: - Section 2: Plugins & Extensions
    private var pluginsExtensionsSection: some View {
        VStack(alignment: .leading, spacing: 12) {
            let activeCount = plugins.filter { $0.isEnabled }.count

            HStack {
                VStack(alignment: .leading, spacing: 2) {
                    Text("Plugins & Extensions")
                        .font(.system(size: 16, weight: .bold))
                        .foregroundColor(.white)
                    Text("\(activeCount) of \(plugins.count) active plugins")
                        .font(.system(size: 12, weight: .medium))
                        .foregroundColor(Color(red: 0.0, green: 0.898, blue: 0.60))
                }

                Spacer()

                Button {
                    showAddPluginSheet = true
                } label: {
                    HStack(spacing: 5) {
                        Image(systemName: "plus")
                            .font(.system(size: 11, weight: .bold))
                        Text("Add Plugin")
                            .font(.system(size: 12, weight: .bold))
                    }
                    .foregroundColor(Color(red: 0.05, green: 0.05, blue: 0.07))
                    .padding(.horizontal, 12)
                    .padding(.vertical, 7)
                    .background(Color(red: 0.0, green: 0.898, blue: 0.60))
                    .clipShape(RoundedRectangle(cornerRadius: 10, style: .continuous))
                }
                .buttonStyle(.plain)
            }

            VStack(spacing: 10) {
                ForEach($plugins) { $plugin in
                    HStack(alignment: .top, spacing: 12) {
                        ZStack {
                            Circle()
                                .fill(Color(red: 0.0, green: 0.898, blue: 0.60).opacity(0.12))
                                .frame(width: 36, height: 36)
                            Image(systemName: "puzzlepiece.extension.fill")
                                .font(.system(size: 16))
                                .foregroundColor(Color(red: 0.0, green: 0.898, blue: 0.60))
                        }

                        VStack(alignment: .leading, spacing: 3) {
                            HStack(spacing: 6) {
                                Text(plugin.name)
                                    .font(.system(size: 14, weight: .semibold))
                                    .foregroundColor(.white)

                                Text(plugin.version)
                                    .font(.system(size: 10, weight: .bold))
                                    .foregroundColor(.white.opacity(0.55))
                                    .padding(.horizontal, 6)
                                    .padding(.vertical, 2)
                                    .background(Color.white.opacity(0.06))
                                    .clipShape(Capsule())
                            }

                            Text(plugin.description)
                                .font(.system(size: 11.5))
                                .foregroundColor(.white.opacity(0.6))
                                .lineLimit(2)
                        }

                        Spacer()

                        Toggle("", isOn: $plugin.isEnabled)
                            .labelsHidden()
                            .tint(Color(red: 0.0, green: 0.898, blue: 0.60))
                    }
                    .padding(14)
                    .background(Color(white: 0.09))
                    .clipShape(RoundedRectangle(cornerRadius: 16, style: .continuous))
                    .overlay(
                        RoundedRectangle(cornerRadius: 16, style: .continuous)
                            .stroke(Color.white.opacity(0.06), lineWidth: 1)
                    )
                }
            }
        }
    }

    // MARK: - Section 3: Preferences
    private var preferencesSection: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Preferences")
                .font(.system(size: 16, weight: .bold))
                .foregroundColor(.white)

            VStack(spacing: 12) {
                // Language
                HStack(spacing: 14) {
                    ZStack {
                        Circle()
                            .fill(Color(red: 0.22, green: 0.94, blue: 0.49).opacity(0.15))
                            .frame(width: 36, height: 36)
                        Image(systemName: "globe")
                            .font(.system(size: 16))
                            .foregroundColor(Color(red: 0.22, green: 0.94, blue: 0.49))
                    }

                    VStack(alignment: .leading, spacing: 2) {
                        Text("Language")
                            .font(.system(size: 14, weight: .semibold))
                            .foregroundColor(.white)
                        Text(selectedLanguage)
                            .font(.system(size: 12))
                            .foregroundColor(.white.opacity(0.6))
                    }

                    Spacer()

                    Menu {
                        ForEach(languages, id: \.self) { lang in
                            Button(lang) {
                                selectedLanguage = lang
                            }
                        }
                    } label: {
                        HStack(spacing: 4) {
                            Text(selectedLanguage)
                                .font(.system(size: 13, weight: .medium))
                                .foregroundColor(.white.opacity(0.8))
                            Image(systemName: "chevron.up.chevron.down")
                                .font(.system(size: 11))
                                .foregroundColor(.white.opacity(0.5))
                        }
                        .padding(.horizontal, 10)
                        .padding(.vertical, 6)
                        .background(Color.white.opacity(0.06))
                        .clipShape(RoundedRectangle(cornerRadius: 8, style: .continuous))
                    }
                }
                .padding(14)
                .background(Color.white.opacity(0.04))
                .clipShape(RoundedRectangle(cornerRadius: 14, style: .continuous))

                // Clear Audio Cache
                HStack(spacing: 14) {
                    ZStack {
                        Circle()
                            .fill(Color(red: 1.0, green: 0.32, blue: 0.32).opacity(0.15))
                            .frame(width: 36, height: 36)
                        Image(systemName: "trash.fill")
                            .font(.system(size: 16))
                            .foregroundColor(Color(red: 1.0, green: 0.32, blue: 0.32))
                    }

                    VStack(alignment: .leading, spacing: 2) {
                        Text("Clear Audio Cache")
                            .font(.system(size: 14, weight: .semibold))
                            .foregroundColor(.white)
                        Text("Used: \(cacheSizeDisplay)")
                            .font(.system(size: 12))
                            .foregroundColor(.white.opacity(0.6))
                    }

                    Spacer()

                    Button {
                        showClearCacheAlert = true
                    } label: {
                        Text("Clear")
                            .font(.system(size: 12, weight: .bold))
                            .foregroundColor(Color(red: 1.0, green: 0.32, blue: 0.32))
                            .padding(.horizontal, 12)
                            .padding(.vertical, 6)
                            .background(Color(red: 1.0, green: 0.32, blue: 0.32).opacity(0.12))
                            .clipShape(RoundedRectangle(cornerRadius: 8, style: .continuous))
                    }
                    .buttonStyle(.plain)
                }
                .padding(14)
                .background(Color.white.opacity(0.04))
                .clipShape(RoundedRectangle(cornerRadius: 14, style: .continuous))
            }
            .padding(16)
            .background(Color(white: 0.09))
            .clipShape(RoundedRectangle(cornerRadius: 18, style: .continuous))
            .overlay(
                RoundedRectangle(cornerRadius: 18, style: .continuous)
                    .stroke(Color.white.opacity(0.06), lineWidth: 1)
            )
        }
    }

    // MARK: - App Version Badge
    private var appVersionFooter: some View {
        VStack(spacing: 6) {
            HStack(spacing: 6) {
                Text("SoraFy iOS v2.0 - BitChord Edition")
                    .font(.system(size: 12, weight: .bold))
                    .foregroundColor(Color(red: 0.0, green: 0.898, blue: 0.60))
            }
            .padding(.horizontal, 16)
            .padding(.vertical, 8)
            .background(Color(white: 0.09))
            .clipShape(Capsule())
            .overlay(
                Capsule()
                    .stroke(Color(red: 0.0, green: 0.898, blue: 0.60).opacity(0.3), lineWidth: 1)
            )

            Text("Next-Gen Modular Audio Architecture")
                .font(.system(size: 11))
                .foregroundColor(.white.opacity(0.5))
        }
        .frame(maxWidth: .infinity)
        .padding(.top, 10)
    }

    // MARK: - Add Plugin Sheet
    private var addPluginSheet: some View {
        NavigationStack {
            ZStack {
                Color(red: 0.043, green: 0.051, blue: 0.063).ignoresSafeArea()

                VStack(spacing: 20) {
                    Text("Add Custom Plugin")
                        .font(.system(size: 18, weight: .bold))
                        .foregroundColor(.white)
                        .padding(.top, 16)

                    Text("Enter metadata for an external audio resolver (Audion / Spotube resolver format compatible):")
                        .font(.system(size: 13))
                        .foregroundColor(.white.opacity(0.7))
                        .multilineTextAlignment(.leading)

                    VStack(spacing: 14) {
                        VStack(alignment: .leading, spacing: 6) {
                            Text("Plugin Name")
                                .font(.system(size: 12, weight: .medium))
                                .foregroundColor(.white.opacity(0.7))
                            TextField("e.g. SoundCloud / Web Stream", text: $newPluginName)
                                .textFieldStyle(.plain)
                                .padding(12)
                                .background(Color.white.opacity(0.06))
                                .clipShape(RoundedRectangle(cornerRadius: 10, style: .continuous))
                                .foregroundColor(.white)
                        }

                        VStack(alignment: .leading, spacing: 6) {
                            Text("Short Description")
                                .font(.system(size: 12, weight: .medium))
                                .foregroundColor(.white.opacity(0.7))
                            TextField("Brief overview of functionality", text: $newPluginDescription)
                                .textFieldStyle(.plain)
                                .padding(12)
                                .background(Color.white.opacity(0.06))
                                .clipShape(RoundedRectangle(cornerRadius: 10, style: .continuous))
                                .foregroundColor(.white)
                        }

                        VStack(alignment: .leading, spacing: 6) {
                            Text("Endpoint URL / Script Path")
                                .font(.system(size: 12, weight: .medium))
                                .foregroundColor(.white.opacity(0.7))
                            TextField("https://...", text: $newPluginEndpoint)
                                .textFieldStyle(.plain)
                                .padding(12)
                                .background(Color.white.opacity(0.06))
                                .clipShape(RoundedRectangle(cornerRadius: 10, style: .continuous))
                                .foregroundColor(.white)
                                .autocorrectionDisabled()
                        }
                    }

                    Spacer()

                    HStack(spacing: 14) {
                        Button("Cancel") {
                            showAddPluginSheet = false
                            newPluginName = ""
                            newPluginDescription = ""
                            newPluginEndpoint = ""
                        }
                        .foregroundColor(.white.opacity(0.7))
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 12)
                        .background(Color.white.opacity(0.08))
                        .clipShape(RoundedRectangle(cornerRadius: 12, style: .continuous))

                        Button("Add Plugin") {
                            let trimmedName = newPluginName.trimmingCharacters(in: .whitespacesAndNewlines)
                            let finalName = trimmedName.isEmpty ? "Custom Resolver" : trimmedName
                            let finalDesc = newPluginDescription.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty ? "Custom audio resolver plugin" : newPluginDescription
                            let newPlugin = PluginItem(
                                id: UUID().uuidString,
                                name: finalName,
                                description: finalDesc,
                                version: "v1.0.0",
                                isEnabled: true
                            )
                            plugins.append(newPlugin)
                            showAddPluginSheet = false
                            newPluginName = ""
                            newPluginDescription = ""
                            newPluginEndpoint = ""
                        }
                        .foregroundColor(Color(red: 0.05, green: 0.05, blue: 0.07))
                        .font(.system(size: 15, weight: .bold))
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 12)
                        .background(Color(red: 0.0, green: 0.898, blue: 0.60))
                        .clipShape(RoundedRectangle(cornerRadius: 12, style: .continuous))
                    }
                    .padding(.bottom, 16)
                }
                .padding(.horizontal, 20)
            }
        }
        .presentationDetents([.medium])
    }
}
