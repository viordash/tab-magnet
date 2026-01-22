# Change Log

All notable changes to the "tab-magnet" extension will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/).

## [0.0.3]

### Added
- **Configuration:** Added `tabMagnet.rules` setting in `package.json`. Users can now define custom pairing patterns via `settings.json`.
- **Angular Support:** Added built-in patterns for Angular projects (`.component.ts`, `.html`, `.scss`, `.spec.ts`).
- **Windows Support:** Implemented path normalization to correctly handle backslashes separators.
- **Minimatch:** Integrated `minimatch` library for flexible glob pattern matching (e.g. `*/$(name).cpp`).

### Changed
- **Core Refactor:** Completely rewrote the matching logic. Replaced hardcoded maps with a bidirectional linear pattern list (`{ left, right }`).
- Improved support for complex folder structures (e.g. "cousin" folders like `src/` and `test/`) by dynamically calculating relative paths.

## [0.0.2]

### Added
- GitHub Actions workflow for automatic build and deployment.

### Changed
- Tabs are now automatically pinned (`workbench.action.keepEditor`) after grouping. This prevents the "Preview" tab from being replaced when switching focus.

### Fixed
- Fixed file matching to use full paths instead of just filenames. This resolves issues where different files with the same name (in different folders) were incorrectly paired.
- Fixed an "off-by-one" error in the tab movement logic when moving tabs to the right.

## [0.0.1]

- Initial release.
- Basic support for C/C++ (`.c/.h`, `.cpp/.hpp`).
- Basic support for Web (`.js/.ts`, `.html`, `.css`).
- Basic support for C# (`.cs`, `.cshtml`, `.razor`).