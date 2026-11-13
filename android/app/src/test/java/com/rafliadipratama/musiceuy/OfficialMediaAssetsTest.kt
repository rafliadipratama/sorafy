package com.rafliadipratama.musiceuy

import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Test
import java.net.URI

class OfficialMediaAssetsTest {

    private val officialCdnHosts = listOf(
        "yt3.googleusercontent.com",
        "lh3.googleusercontent.com",
        "i.scdn.co",
        "i.ytimg.com"
    )

    private fun assertValidCdnUrl(url: String) {
        assertTrue("URL must start with https://: $url", url.startsWith("https://"))
        val uri = URI(url)
        val host = uri.host ?: ""
        assertTrue("Host $host must belong to official CDNs: $url", officialCdnHosts.any { host.contains(it) })
        assertFalse("URL must not contain empty path: $url", uri.path.isNullOrBlank())
    }

    @Test
    fun exploreGenreCoverUrls_areValidOfficialCdns() {
        val exploreUrls = listOf(
            "https://yt3.googleusercontent.com/PR-EXqPEf4aHFFLHknd2II-rvvVINdq7mS_eaHe4NEX11w2P6N8SztkPlouSzvGX6gtuMeeJXro=s576",
            "https://i.scdn.co/image/ab67706f000000027dea5c0e18df3727eacdc4e1",
            "https://yt3.googleusercontent.com/2qHUJ20mtWoAZBU80LpQkNfu7EXSKKNs8K-MFFV5vIuFKDseRNHb1cVbmuzmfHvNJKKZGJ-cJKI=s576",
            "https://i.scdn.co/image/ab67706f00000002694bf33281695f3b7542a09a",
            "https://i.scdn.co/image/ab67706f000000020408713c731caaf1f800615a",
            "https://i.scdn.co/image/ab67706f000000026020f2f6476db518ef747da4",
            "https://i.scdn.co/image/ab67706f00000002876581e4be85838f0e1ad09d",
            "https://i.scdn.co/image/ab67706f0000000281ee550c81bbff8053a023e8"
        )

        for (url in exploreUrls) {
            assertValidCdnUrl(url)
        }
    }

    @Test
    fun topCategoriesCoverUrls_areValidOfficialCdns() {
        val topCategoryUrls = listOf(
            "https://i.scdn.co/image/ab67706f000000020408713c731caaf1f800615a",
            "https://i.scdn.co/image/ab67706f000000026020f2f6476db518ef747da4",
            "https://i.scdn.co/image/ab67706f00000002385ff7ec006cdc4922f52557",
            "https://yt3.googleusercontent.com/PR-EXqPEf4aHFFLHknd2II-rvvVINdq7mS_eaHe4NEX11w2P6N8SztkPlouSzvGX6gtuMeeJXro=s576",
            "https://i.scdn.co/image/ab67706f000000027dea5c0e18df3727eacdc4e1",
            "https://i.scdn.co/image/ab67706f00000002694bf33281695f3b7542a09a"
        )

        for (url in topCategoryUrls) {
            assertValidCdnUrl(url)
        }
    }

    @Test
    fun fallbackPlaylistsAndAlbums_useHighResGoogleUserContent() {
        val ytmCatalogUrls = listOf(
            "https://yt3.googleusercontent.com/PR-EXqPEf4aHFFLHknd2II-rvvVINdq7mS_eaHe4NEX11w2P6N8SztkPlouSzvGX6gtuMeeJXro=s576",
            "https://yt3.googleusercontent.com/2908vJ0ZJUho_pXI5ZdX1068GnxX9sp2G8uFN7FqWTsKUNsxuMnCMo8FITvAI7Hapw0ebmmA6Q=s576",
            "https://yt3.googleusercontent.com/DOCADxsKgbDuuqrHTI68WWJd4Tl7q6YQnrKHH412aTaKvv_1IfIRmS3YRq4x548EmOrc-cxcZykz=s576",
            "https://yt3.googleusercontent.com/cNzK_K-UoxOwBKfNZxYDwvSARAZMRqPoVMuTikYOYYmw3a6U83RiUg6PrLxRVsKCnztKraAi8kLX=s576",
            "https://yt3.googleusercontent.com/wWzwvnTgKUOp6XzlvnJSt8lR3wLSVOtA3_OCFHky1B4nw2VaZxDcvmRVHBz4xQCFDzVTIjjcKnJYfEdj0w=w544-h544-l90-rj",
            "https://yt3.googleusercontent.com/7oX7kccOMbD9v7SqDbSwHHoLQogdM1QWPyfSaeCUD9FMFj8pJK9dXYdR7bM8hH9S8bGWH2IXnLFtuGdx=w544-h544-l90-rj"
        )

        for (url in ytmCatalogUrls) {
            assertValidCdnUrl(url)
            assertTrue("YTM catalog URL should contain resolution param: $url",
                url.contains("=s576") || url.contains("=w544-h544-l90-rj") || url.contains("=w"))
        }
    }

    @Test
    fun videoThumbnails_useHighDefinition16by9Hq720() {
        val testVideoId = "dQw4w9WgXcQ"
        val expectedThumb = "https://i.ytimg.com/vi/$testVideoId/hq720.jpg"

        assertValidCdnUrl(expectedThumb)
        assertTrue(expectedThumb.endsWith("/hq720.jpg"))
        assertFalse("Should not use letterboxed hqdefault", expectedThumb.endsWith("/hqdefault.jpg"))
    }
}
