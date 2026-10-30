cask "sorafy" do
  version "2.0.0"
  sha256 :no_check

  url "https://github.com/rafliadipratama/sorafy/releases/download/v#{version}/SoraFy-#{version}.dmg",
      verified: "github.com/rafliadipratama/sorafy/"
  name "SoraFy"
  desc "High-fidelity cross-platform music streaming player with MPD, AI MCP & Jam Remote"
  homepage "https://github.com/rafliadipratama/sorafy"

  livecheck do
    url :url
    strategy :github_latest
  end

  app "SoraFy.app"

  zap trash: [
    "~/Library/Application Support/sorafy",
    "~/Library/Caches/com.rafliadipratama.sorafy",
    "~/Library/Preferences/com.rafliadipratama.sorafy.plist",
    "~/Library/Saved Application State/com.rafliadipratama.sorafy.savedState",
  ]
end
