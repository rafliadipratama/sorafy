// swift-tools-version: 5.9
import PackageDescription

let package = Package(
    name: "SoraFy",
    platforms: [
        .iOS(.v16),
        .macOS(.v13)
    ],
    products: [
        .library(
            name: "SoraFy",
            targets: ["SoraFy"]
        ),
    ],
    dependencies: [],
    targets: [
        .target(
            name: "SoraFy",
            path: "SoraFy"
        )
    ]
)
