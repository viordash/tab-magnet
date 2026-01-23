import * as path from 'path';
import { minimatch } from 'minimatch';

export enum Position {
    Left,
    Right
}

export type PairPattern = { left: string; right: string };
export const DEFAULT_PAIR_PATTERNS: PairPattern[] = [
    // C/C++ (Sibling)
    { left: '$(name).c', right: '$(name).h' },
    { left: '$(name).cpp', right: '$(name).h' },
    { left: '$(name).cpp', right: '$(name).hpp' },

    // C/C++ (Cousin folders)
    { left: '*/$(name).c', right: '*/$(name).h' },
    { left: '*/$(name).cpp', right: '*/$(name).h' },
    { left: '*/$(name).cpp', right: '*/$(name).hpp' },

    // C/C++ (Include folder)
    { left: '$(name).c', right: 'include/$(name).h' },
    { left: '$(name).cpp', right: 'include/$(name).h' },
    { left: '$(name).cpp', right: 'include/$(name).hpp' },

    // Typescript / Angular
    { left: '$(name).component.ts', right: '$(name).component.html' },
    { left: '$(name).component.ts', right: '$(name).component.scss' },
    { left: '$(name).component.html', right: '$(name).component.scss' },
    { left: '$(name).component.ts', right: '$(name).component.spec.ts' },

    // Typescript / Tests
    { left: '$(name).ts', right: '$(name).spec.ts' },
    { left: '$(name).ts', right: 'test/$(name).test.ts' },

    // Typescript / Web
    { left: '$(name).ts', right: '$(name).html' },
    { left: '$(name).ts', right: '$(name).css' },
    { left: '$(name).html', right: '$(name).css' },
    { left: '$(name).js', right: '$(name).css' },

    // C#
    { left: '$(name).xaml.cs', right: '$(name).xaml' },
    { left: '$(name).cs', right: '$(name).cshtml' },
    { left: '$(name).cs', right: '$(name).razor' }
];

function toUnix(p: string): string {
    return p.split(path.sep).join('/');
}

export function getPairPattern(currentPath: string, rules: PairPattern[]): PairPattern[] {
    const currentExt = path.extname(currentPath).toLowerCase();
    const pairs = rules.filter(pat => path.extname(pat.left) === currentExt
        || path.extname(pat.right) === currentExt);
    return pairs;
}

export function getFileName(baseName: string): string {
    let name = baseName;
    while (true) {
        const ext = path.extname(name);
        if (!ext) {
            break;
        }
        name = path.basename(name, ext);
    }
    return name;
}

function removeCommonPath(file1: string, file2: string): [string, string] {
    const parts1 = toUnix(file1).split('/');
    const parts2 = toUnix(file2).split('/');

    const minLength = Math.min(parts1.length, parts2.length);

    let divergenceIndex = 0;
    for (let i = 0; i < minLength; i++) {
        if (parts1[i] !== parts2[i]) {
            break;
        }
        divergenceIndex = i + 1;
    }

    if (divergenceIndex === 0) {
        return [toUnix(file1), toUnix(file2)];
    }

    const result1 = parts1.slice(divergenceIndex).join('/');
    const result2 = parts2.slice(divergenceIndex).join('/');

    return [result1, result2];
}

export function getPosition(pairs: PairPattern[], currentPath: string, tabPath: string): Position | undefined {
    const currentBaseName = path.basename(currentPath);
    const tabBaseName = path.basename(tabPath);
    const currentFilename = getFileName(currentBaseName);
    const tabFilename = getFileName(tabBaseName);

    let baseName;
    const currentPathIsBase = currentFilename.length <= tabFilename.length;
    if (currentPathIsBase) {
        baseName = currentFilename;
        if (!tabFilename.includes(baseName)) {
            return undefined;
        }
    } else {
        baseName = tabFilename;
        if (!currentFilename.includes(baseName)) {
            return undefined;
        }
    }

    const clearPaths = removeCommonPath(currentPath, tabPath);

    for (const pair of pairs) {
        const leftPattern = pair.left.split('$(name)').join(baseName);
        const rightPattern = pair.right.split('$(name)').join(baseName);

        if (minimatch(clearPaths[0], leftPattern) && minimatch(clearPaths[1], rightPattern)) {
            return Position.Left;
        }

        if (minimatch(clearPaths[1], leftPattern) && minimatch(clearPaths[0], rightPattern)) {
            return Position.Right;
        }
    }
    return undefined;
}