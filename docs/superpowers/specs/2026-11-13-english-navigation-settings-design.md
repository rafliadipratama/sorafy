# English Default UI, 3-Tab Bottom Bar & Settings Plugins Spec

## Intent & The Why
Mobile users on SoraFy want an intuitive internationalized interface defaulting to English, a clean 3-item bottom navigation bar (Home, Library, Settings), and the Plugins feature integrated into Settings.

## Goals
1. Default application language is English (`"en"`) across Android and iOS.
2. Bottom navigation bar has exactly 3 tabs:
   - **Home**
   - **Library**
   - **Settings**
3. The Search functionality is accessible directly from the Home screen top bar via a dedicated search icon.
4. The Plugins manager is consolidated inside `SettingsScreen` under a dedicated "Plugins & Extensions" section.
5. All hardcoded Indonesian UI labels in Home and Player are standardized to English.

## Non-Goals
- Do NOT remove search capabilities; search remains fully accessible from the top bar.
- Do NOT delete the underlying plugin engine (`PluginManager`); only relocate its UI into Settings.
