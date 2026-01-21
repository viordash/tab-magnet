import * as path from 'path';
import { minimatch } from 'minimatch';

export enum Position {
    Left,
    Right
}

type Pair = { position: Position; patterns: string[] };
type Pairs = { [key: string]: Pair };

export const PAIR_EXTENSIONS: { [key: string]: Pairs } = {
    // --- C / C++ ---
    '.cpp': {
        '.h': { position: Position.Right, patterns: [".", "include", "../include"] },
        '.hpp': { position: Position.Right, patterns: [".", "include", "../include"] }
    },
    '.c': {
        '.h': { position: Position.Right, patterns: [".", "include", "../include"] }
    },
    '.h': {
        '.c': { position: Position.Left, patterns: [".", "..", "../src"] },
        '.cpp': { position: Position.Left, patterns: [".", "..", "../src"] }
    },
    '.hpp': {
        '.c': { position: Position.Left, patterns: [".", "..", "../src"] },
        '.cpp': { position: Position.Left, patterns: [".", "..", "../src"] }
    },

    // --- Web (JS / TS / HTML / CSS) ---
    '.js': {
        '.css': { position: Position.Right, patterns: ["."] },
        '.html': { position: Position.Right, patterns: ["."] },
        '.ts': { position: Position.Left, patterns: ["."] }
    },
    '.ts': {
        '.css': { position: Position.Right, patterns: ["."] },
        '.html': { position: Position.Right, patterns: ["."] },
        '.ts': { position: Position.Right, patterns: ["test"] },
    },
    '.html': {
        '.css': { position: Position.Right, patterns: ["."] },
        '.ts': { position: Position.Left, patterns: ["."] },
        '.js': { position: Position.Left, patterns: ["."] }
    },
    '.css': {
        '.html': { position: Position.Left, patterns: ["."] },
        '.ts': { position: Position.Left, patterns: ["."] },
        '.js': { position: Position.Left, patterns: ["."] }
    },

    // --- C# / .NET ---
    '.cs': {
        '.cshtml': { position: Position.Right, patterns: ["."] },
        '.razor': { position: Position.Right, patterns: ["."] }
    },
    '.cshtml': {
        '.cs': { position: Position.Left, patterns: ["."] },
        '.razor': { position: Position.Left, patterns: ["."] }
    },
    '.razor': {
        '.cs': { position: Position.Left, patterns: ["."] },
        '.cshtml': { position: Position.Left, patterns: ["."] }
    }
};


function toUnixPath(p: string): string {
    return p.split(path.sep).join('/');
}

export function getPairInfo(currentPath: string): Pairs | undefined {
    const currentExt = path.extname(currentPath).toLowerCase();
    return PAIR_EXTENSIONS[currentExt];
}

export function getPosition(pairInfo: Pairs, currentPath: string, tabPath: string): Position | undefined {
    const currentExt = path.extname(currentPath).toLowerCase();
    const currentName = path.basename(currentPath, currentExt);

    const tabExt = path.extname(tabPath).toLowerCase();
    const tabName = path.basename(tabPath, tabExt);

    if (currentName !== tabName) {
        return undefined;
    }

    const pair = pairInfo[tabExt];
    if (!pair) {
        return undefined;
    }

    const currentDir = path.dirname(currentPath);
    const tabDir = path.dirname(tabPath);

    let relativePath = path.relative(currentDir, tabDir);
    if (!relativePath) {
        relativePath = '.';
    }

    const normalizedRelative = toUnixPath(relativePath);

    for (const pattern of pair.patterns) {
        if (minimatch(normalizedRelative, pattern)) {
            return pair.position;
        }
    }

    return undefined;
}