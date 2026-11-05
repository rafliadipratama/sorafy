import Foundation
import AVFoundation
import MediaPlayer
import Combine

public final class AudioPlayerService: NSObject, ObservableObject {
    public static let shared = AudioPlayerService()

    private var player: AVPlayer?
    private var timeObserverToken: Any?
    private var cancellables = Set<AnyCancellable>()

    @Published public var isPlaying: Bool = false
    @Published public var currentPositionSec: Double = 0.0
    @Published public var durationSec: Double = 0.0
    @Published public var isBuffering: Bool = false

    public var onTrackFinished: (() -> Void)?

    private override init() {
        super.init()
        setupAudioSession()
        setupRemoteCommands()
    }

    private func setupAudioSession() {
        do {
            let session = AVAudioSession.sharedInstance()
            try session.setCategory(.playback, mode: .default, options: [])
            try session.setActive(true)
        } catch {
            print("[SoraFy Audio] Failed to set up AVAudioSession: \(error)")
        }
    }

    public func loadAndPlay(streamUrl: String, track: Track) {
        guard let url = URL(string: streamUrl) else { return }

        // Remove old observers
        if let token = timeObserverToken {
            player?.removeTimeObserver(token)
            timeObserverToken = nil
        }
        NotificationCenter.default.removeObserver(self, name: .AVPlayerItemDidPlayToEndTime, object: nil)

        let playerItem = AVPlayerItem(url: url)
        if player == nil {
            player = AVPlayer(playerItem: playerItem)
            player?.automaticallyWaitsToMinimizeStalling = true
        } else {
            player?.replaceCurrentItem(with: playerItem)
        }

        NotificationCenter.default.addObserver(
            self,
            selector: #selector(playerItemDidReachEnd),
            name: .AVPlayerItemDidPlayToEndTime,
            object: playerItem
        )

        // Periodic time observer for smooth seekbar and lyrics sync (every 0.1 sec)
        let interval = CMTime(seconds: 0.1, preferredTimescale: CMTimeScale(NSEC_PER_SEC))
        timeObserverToken = player?.addPeriodicTimeObserver(forInterval: interval, queue: .main) { [weak self] time in
            guard let self = self else { return }
            self.currentPositionSec = time.seconds
            if let duration = self.player?.currentItem?.duration.seconds, !duration.isNaN, duration > 0 {
                self.durationSec = duration
            }
            self.updateNowPlayingPlaybackInfo()
        }

        player?.play()
        isPlaying = true
        updateNowPlayingMetadata(track: track)
    }

    public func togglePlayPause() {
        guard let p = player else { return }
        if isPlaying {
            p.pause()
            isPlaying = false
        } else {
            p.play()
            isPlaying = true
        }
        updateNowPlayingPlaybackInfo()
    }

    public func seek(to seconds: Double) {
        let targetTime = CMTime(seconds: seconds, preferredTimescale: 600)
        player?.seek(to: targetTime, toleranceBefore: .zero, toleranceAfter: .zero)
        currentPositionSec = seconds
        updateNowPlayingPlaybackInfo()
    }

    @objc private func playerItemDidReachEnd() {
        isPlaying = false
        onTrackFinished?()
    }

    // MARK: - Lock Screen & Control Center (MPNowPlayingInfoCenter)
    private func updateNowPlayingMetadata(track: Track) {
        var info: [String: Any] = [
            MPMediaItemPropertyTitle: track.cleanTitle,
            MPMediaItemPropertyArtist: track.artist.name,
            MPNowPlayingInfoPropertyPlaybackRate: 1.0,
            MPMediaItemPropertyPlaybackDuration: Double(track.durationSec)
        ]
        if let album = track.albumTitle {
            info[MPMediaItemPropertyAlbumTitle] = album
        }

        MPNowPlayingInfoCenter.default().nowPlayingInfo = info

        // Load Artwork asynchronously
        if let coverUrl = URL(string: track.coverUrl) {
            URLSession.shared.dataTask(with: coverUrl) { [weak self] data, _, _ in
                guard let data = data, let image = UIImage(data: data) else { return }
                DispatchQueue.main.async {
                    var currentInfo = MPNowPlayingInfoCenter.default().nowPlayingInfo ?? [:]
                    currentInfo[MPMediaItemPropertyArtwork] = MPMediaItemArtwork(boundsSize: image.size) { _ in image }
                    MPNowPlayingInfoCenter.default().nowPlayingInfo = currentInfo
                }
            }.resume()
        }
    }

    private func updateNowPlayingPlaybackInfo() {
        guard var info = MPNowPlayingInfoCenter.default().nowPlayingInfo else { return }
        info[MPNowPlayingInfoPropertyElapsedPlaybackTime] = currentPositionSec
        info[MPNowPlayingInfoPropertyPlaybackRate] = isPlaying ? 1.0 : 0.0
        MPNowPlayingInfoCenter.default().nowPlayingInfo = info
    }

    // MARK: - Remote Command Center (Headphones, Lockscreen, CarPlay)
    private func setupRemoteCommands() {
        let commandCenter = MPRemoteCommandCenter.shared()

        commandCenter.playCommand.addTarget { [weak self] _ in
            self?.player?.play()
            self?.isPlaying = true
            return .success
        }

        commandCenter.pauseCommand.addTarget { [weak self] _ in
            self?.player?.pause()
            self?.isPlaying = false
            return .success
        }

        commandCenter.togglePlayPauseCommand.addTarget { [weak self] _ in
            self?.togglePlayPause()
            return .success
        }

        commandCenter.changePlaybackPositionCommand.addTarget { [weak self] event in
            guard let self = self, let posEvent = event as? MPChangePlaybackPositionCommandEvent else {
                return .commandFailed
            }
            self.seek(to: posEvent.positionTime)
            return .success
        }
    }
}
