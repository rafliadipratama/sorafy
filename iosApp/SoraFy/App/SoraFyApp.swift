import SwiftUI
import AVFoundation

@main
struct SoraFyApp: App {
    init() {
        // Activate Audio Session Category for background audio playback
        do {
            let audioSession = AVAudioSession.sharedInstance()
            try audioSession.setCategory(.playback, mode: .default, options: [])
            try audioSession.setActive(true)
        } catch {
            print("[SoraFy App] AVAudioSession initialization notice: \(error)")
        }
    }

    var body: some Scene {
        WindowGroup {
            MainTabView()
        }
    }
}
