package com.rafliadipratama.musiceuy

import android.app.Application
import com.rafliadipratama.musiceuy.data.network.NewPipeDownloader
import org.schabi.newpipe.extractor.NewPipe

class MusicEuyApp : Application() {
    override fun onCreate() {
        super.onCreate()
        // Older builds persisted the full Google session cookie in plain prefs.
        // It was never read back, so drop it from existing installs.
        getSharedPreferences("musiceuy_yt_auth", MODE_PRIVATE).edit().remove("cookie").apply()

        try {
            NewPipe.init(NewPipeDownloader.create())
        } catch (_: Exception) {
            // NewPipe init fallback
        }
    }
}
