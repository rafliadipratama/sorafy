# SoraFy release (R8) keep rules.
#
# The riskiest parts of this app under shrinking are the YouTube stream
# extractors: they rely on reflection (Jackson), a JS engine (Rhino) and a
# WebView JavaScript bridge, none of which R8 can see being used.

# ---------------------------------------------------------------
# Serialization & Core Reflection: Annotations must be readable at runtime.
# ---------------------------------------------------------------
-keepattributes *Annotation*,Signature,InnerClasses,EnclosingMethod

# ---------------------------------------------------------------
# NewPipeExtractor + Rhino: Rhino evaluates YouTube's player JS to decipher
# stream signatures. Rhino resolves classes reflectively and warns about
# optional JDK-only pieces that are absent on Android.
# ---------------------------------------------------------------
-keep class org.schabi.newpipe.extractor.** { *; }
-dontwarn org.schabi.newpipe.extractor.**
-keep class org.mozilla.javascript.** { *; }
-keep class org.mozilla.classfile.** { *; }
-dontwarn org.mozilla.javascript.**
-dontwarn org.mozilla.classfile.**
-keep class com.grack.nanojson.** { *; }
-keep class org.jsoup.** { *; }
-dontwarn org.jsoup.**

# ---------------------------------------------------------------
# WebView JavaScript bridge in YouTubeCipherSolver ("EjsBridge"). Methods
# called from JS are invoked reflectively and would otherwise be stripped.
# ---------------------------------------------------------------
-keepclassmembers class com.rafliadipratama.musiceuy.solver.** {
    @android.webkit.JavascriptInterface <methods>;
}

# ---------------------------------------------------------------
# OkHttp / Okio: platform-specific optionals that are not present on Android.
# ---------------------------------------------------------------
-dontwarn okhttp3.**
-dontwarn okio.**
-dontwarn org.conscrypt.**
-dontwarn org.bouncycastle.**
-dontwarn org.openjsse.**

# ---------------------------------------------------------------
# Strip debug logging from release builds. Several call sites log fully
# resolved, signed stream URLs; this keeps them out of shipped binaries.
# Log.w/e are kept so real faults remain diagnosable.
# ---------------------------------------------------------------
-assumenosideeffects class android.util.Log {
    public static *** d(...);
    public static *** v(...);
    public static *** i(...);
}
