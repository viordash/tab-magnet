[![Deploy Extension](https://github.com/viordash/tab-magnet/actions/workflows/deploy.yml/badge.svg)](https://github.com/viordash/tab-magnet/actions/workflows/deploy.yml)

# Tab Magnet
vscode extension

**Tab Magnet** automatically keeps your related file tabs together.

When you work with languages that use pairs of files (like C++ Header/Source, or Angular Component/Template), opening one file usually leaves its pair scattered somewhere else in the tab bar. **Tab Magnet** solves this by automatically moving the active tab right next to its related file.

## Features

*   **Automatic Grouping:** Just open a file or switch to an existing tab. If a related file is found in the current group, they will "snap" together.
*   **Smart Positioning:** The extension knows where files usually belong. For example, Header files (`.h`) are placed to the **Right** of Source files (`.c`), while HTML/JS files are placed to the **Left** of CSS files.
*   **Flexible Matching:** Works with files in the same folder, in `include/` folders, or in parallel folder structures (e.g. `src/` and `test/`).
*   **Fully Configurable:** Built-in defaults cover most cases, but you can define your own rules in VS Code settings.

## Supported File Pairs (Built-in)

Tab Magnet works out of the box for:

### C / C++
*   `.c` ↔ `.h`
*   `.cpp` ↔ `.hpp` / `.h`
*   Supports separation of source and headers (e.g. `src/file.cpp` and `include/file.h`).

### Web Development
*   **General:** `.js` / `.ts` ↔ `.html` ↔ `.css`
*   **Angular:** `.component.ts` ↔ `.component.html` ↔ `.component.scss` ↔ `.spec.ts`
*   **Tests:** Source files are grouped with their tests (e.g. `file.ts` ↔ `file.spec.ts` or `test/file.test.ts`).

### C# / .NET
*   `.cs` ↔ `.cshtml` (Razor Pages)
*   `.cs` ↔ `.razor` (Blazor)
*   `.xaml.cs` ↔ `.xaml` (WPF/MAUI)

## Extension Settings

You can define your own pairing rules using the `tabMagnet.rules` setting in your `settings.json`.

**Important:** If you define custom rules, **built-in defaults will be disabled**. This gives you full control and prevents conflicts with standard patterns.

The extension matches files by stripping all extensions and comparing the base names.
Use the `$(name)` placeholder to match this base name.

If you want to add a new rule but keep built-in support, you must copy the default rules you need into your settings.

### Example 1: Go Lang tests
```json
"tabMagnet.rules": [
    { 
        "left": "$(name).go", 
        "right": "$(name)_test.go" 
    }
]
```

### Example 2: React Native (JS + Styles)
Because the extension strips all suffixes (like `.styles.js`), this works automatically:
```json
"tabMagnet.rules": [
    { 
        "left": "$(name).js", 
        "right": "$(name).styles.js" 
    }
]
```

### Example 3: Custom C++ folder structure
If you keep your tests in a separate `tests/` folder with the same filename:
```json
"tabMagnet.rules": [
    { 
        "left": "src/$(name).cpp", 
        "right": "tests/Test_$(name).cpp" 
    }
]
```

## Known Issues

*   The extension works within the current **Tab Group**. It does not move tabs between split editors.
*   Ordering is triggered on `onDidChangeActiveTextEditor`. If you manually drag a tab away, it might snap back if you click it again while its pair is open.

## Release Notes

### 0.0.1
Initial release.
*   Core functionality implemented.
*   Support for C/C++, Web (JS/TS/HTML/CSS), and C# (.cs/Razor).

### 0.0.2
*   **Fix:** Improved file matching to use full paths.
*   **Improvement:** Tabs are now automatically pinned (`keepEditor`) after grouping.
*   Added GitHub Actions workflow for automatic deployment.

### 0.0.3
*   **New Feature:** Added `tabMagnet.rules` configuration. Users can now define custom pairing patterns.
*   **New Feature:** Added support for **Angular** projects (`.component.ts`, `.html`, `.scss`).
*   **Refactor:** Completely rewrote the matching logic to use flexible bidirectional patterns.
*   **Improvement:** Enhanced matching algorithm to support filenames with suffixes/prefixes (e.g. `_test.go`, `Test_File.cpp`).
*   **Improvement:** Better support for complex folder structures (e.g. "cousin" folders like `src/` and `include/`).
*   **Fix:** Fixed path separators handling for Windows.