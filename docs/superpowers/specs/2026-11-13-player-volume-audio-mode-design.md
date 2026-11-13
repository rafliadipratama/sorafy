# Player Volume Control & Audio/Video Switch Spec

## Intent & The Why
Mobile users on SoraFy want an authentic Apple Music experience on the screen player.
Currently:
1. The top "Lagu | Video" pill switch appears on all songs, cluttering the view when playing pure MP3/audio tracks where no video exists.
2. There is no in-app volume slider, forcing users to rely only on physical hardware buttons, unlike Apple Music which features an elegant inline volume slider.

## Goals
1. Conditionally show `AudioVideoToggleSwitch` only if `track.isVideo == true`. For pure audio/MP3 tracks (`!track.isVideo`), hide the toggle switch so the cover artwork and top bar are clean and spacious.
2. Add an Apple Music-style volume slider (`AppleMusicVolumeSlider`) positioned directly beneath the primary playback controls (`PrimaryControlsRow`) and above the bottom utility row (`BottomUtilityRow`).
3. Bind the volume slider directly to device media stream volume (`AudioManager.STREAM_MUSIC`) with real-time bidirectional synchronization (slider adjusts volume; hardware buttons update slider position).
4. Maintain parities across both Android and iOS (`iosApp/`).

## Non-Goals & Anti-Goals
- Do NOT disrupt existing seekbar (`ApplePlaybackSlider`) or lyrics/queue view states.
- Do NOT introduce heavy background polling for volume (use Android `ContentObserver` or `BroadcastReceiver` / iOS `MPVolumeView` listener).
- Do NOT modify audio engine playback pipelines or volume attenuation algorithms.

## UI Layout
```
[ Top Header: Dismiss arrow, "Sedang Memutar", Context Menu ]
[ Optional: AudioVideoToggleSwitch ONLY IF track.isVideo == true ]
[ Artwork Stage / Lyrics / Queue ]
[ Track Title, Artist, Badge, Heart, Download ]
[ PlaybackSeekbar (ApplePlaybackSlider: elapsed, bar, remaining) ]
[ PrimaryControlsRow: Previous, Play/Pause, Next ]
[ AppleMusicVolumeSlider: VolumeLow Icon | --- Progress Bar --- | VolumeHigh Icon ]
[ BottomUtilityRow: Lyrics, Queue ]
```
