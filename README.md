# vscode extension Tab Magnet

**Tab Magnet** automatically keeps your related file tabs together.

When you work with languages that use pairs of files (like C++ Header/Source, or Angular Component/Template), opening one file usually leaves its pair scattered somewhere else in the tab bar. **Tab Magnet** solves this by automatically moving the active tab right next to its related file.

## Features

*   **Automatic Grouping:** Just open a file or switch to an existing tab. If a related file is found in the current group, they will "snap" together.
*   **Smart Positioning:** The extension knows where files usually belong. For example, Header files (`.h`) are placed to the **Left** of Source files (`.c`), while CSS files are placed to the **Right** of HTML/JS files.
*   **Zero Configuration:** Works out of the box.

## Supported File Pairs

Currently, Tab Magnet supports the following associations:

### C / C++
*   `.c` ↔ `.h`
*   `.cpp` ↔ `.hpp` / `.h` / `.hxx`
*   `.cc` ↔ `.hh`

### Web Development
*   `.js` / `.ts` ↔ `.html` ↔ `.css`
*   `.spec.ts` (Tests) are grouped with their source files.

### C# / .NET
*   `.cs` ↔ `.cshtml` (Razor Pages)
*   `.cs` ↔ `.razor` (Blazor)

## Requirements

No special requirements. Just install and enjoy organized tabs.

## Extension Settings

Currently, there are no configurable settings. The extension uses opinionated defaults for file positioning (e.g., Headers on the right).

## Known Issues

*   The extension works within the current **Tab Group**. It does not move tabs between split editors.
*   Ordering is triggered on `onDidChangeActiveTextEditor`. If you manually drag a tab away, it might snap back if you click it again while its pair is open.

## Release Notes

### 1.0.0

Initial release.
*   Core functionality implemented.
*   Support for C/C++, Web (JS/TS/HTML/CSS), and C# (.cs/Razor).
