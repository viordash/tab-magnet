import * as path from 'path';
import { minimatch } from 'minimatch';

export enum Position {
    Left,
    Right
}



// type Pair = { position: Position; patterns: string[] };
// type Pairs = { [key: string]: Pair };

// export const PAIR_EXTENSIONS: { [key: string]: Pairs } = {
//     // --- C / C++ ---
//     '.cpp': {
//         '.h': { position: Position.Right, patterns: [".", "include", "../include"] },
//         '.hpp': { position: Position.Right, patterns: [".", "include", "../include"] }
//     },
//     '.c': {
//         '.h': { position: Position.Right, patterns: [".", "include", "../include"] }
//     },
//     '.h': {
//         '.c': { position: Position.Left, patterns: [".", "..", "../src"] },
//         '.cpp': { position: Position.Left, patterns: [".", "..", "../src"] }
//     },
//     '.hpp': {
//         '.c': { position: Position.Left, patterns: [".", "..", "../src"] },
//         '.cpp': { position: Position.Left, patterns: [".", "..", "../src"] }
//     },

//     // --- Web (JS / TS / HTML / CSS) ---
//     '.js': {
//         '.css': { position: Position.Right, patterns: ["."] },
//         '.html': { position: Position.Right, patterns: ["."] },
//         '.ts': { position: Position.Left, patterns: ["."] }
//     },
//     '.ts': {
//         '.css': { position: Position.Right, patterns: ["."] },
//         '.html': { position: Position.Right, patterns: ["."] },
//         '.ts': { position: Position.Right, patterns: ["test"] },
//     },
//     '.html': {
//         '.css': { position: Position.Right, patterns: ["."] },
//         '.ts': { position: Position.Left, patterns: ["."] },
//         '.js': { position: Position.Left, patterns: ["."] }
//     },
//     '.css': {
//         '.html': { position: Position.Left, patterns: ["."] },
//         '.ts': { position: Position.Left, patterns: ["."] },
//         '.js': { position: Position.Left, patterns: ["."] }
//     },

//     // --- C# / .NET ---
//     '.cs': {
//         '.cshtml': { position: Position.Right, patterns: ["."] },
//         '.razor': { position: Position.Right, patterns: ["."] }
//     },
//     '.cshtml': {
//         '.cs': { position: Position.Left, patterns: ["."] },
//         '.razor': { position: Position.Left, patterns: ["."] }
//     },
//     '.razor': {
//         '.cs': { position: Position.Left, patterns: ["."] },
//         '.cshtml': { position: Position.Left, patterns: ["."] }
//     }
// };



// function toUnixPath(p: string): string {
//     return p.split(path.sep).join('/');
// }

// export function getPairInfo(currentPath: string): Pairs | undefined {
//     const currentExt = path.extname(currentPath).toLowerCase();
//     return PAIR_EXTENSIONS[currentExt];
// }

// export function getPosition(pairInfo: Pairs, currentPath: string, tabPath: string): Position | undefined {
//     const currentExt = path.extname(currentPath).toLowerCase();
//     const currentName = path.basename(currentPath, currentExt);

//     const tabExt = path.extname(tabPath).toLowerCase();
//     const tabName = path.basename(tabPath, tabExt);

//     if (currentName !== tabName) {
//         return undefined;
//     }

//     const pair = pairInfo[tabExt];
//     if (!pair) {
//         return undefined;
//     }

//     const currentDir = path.dirname(currentPath);
//     const tabDir = path.dirname(tabPath);

//     const relativeFull = path.relative(currentPath, tabPath);
//     console.log(`relativeFull: "${relativeFull}"`);

//     const relativeDir = path.relative(currentDir, tabDir);
//     console.log(`relativeDir: "${relativeDir}"`);

//     let relativePath = path.relative(currentDir, tabDir);
//     if (!relativePath) {
//         relativePath = '.';
//     }

//     const normalizedRelative = toUnixPath(relativePath);

//     for (const pattern of pair.patterns) {
//         if (minimatch(normalizedRelative, pattern)) {
//             return pair.position;
//         }
//     }

//     return undefined;
// }



type PairPattern = { left: string; right: string };
export const PAIR_PATTERNS: PairPattern[] = [
    { left: '**/$(name).c', right: '**/$(name).h' },

    { left: '**/$(name).cpp', right: '**/$(name).h' },
    { left: '**/$(name).cpp', right: '**/$(name).hpp' },
    { left: '**/$(name).c', right: '**/include/$(name).h' },
    { left: '**/$(name).cpp', right: '**/include/$(name).h' },
    { left: '**/$(name).cpp', right: '**/include/$(name).hpp' },
    { left: '**/$(name).ts', right: '**/test/$(name).spec.ts' },
    { left: '**/$(name).ts', right: '**/$(name).spec.ts' }

];

export function getPairPattern(currentPath: string): PairPattern[] {
    const currentExt = path.extname(currentPath).toLowerCase();
    const pairs = PAIR_PATTERNS.filter(pat => path.extname(pat.left) === currentExt || path.extname(pat.right) === currentExt);
    return pairs;
}

export function getFileParts(baseName: string): { baseName: string, extensions: string[] } {
    let extensions: string[] = [];
    while (baseName.length > 0) {
        const ext = path.extname(baseName).toLowerCase();
        if (ext.length == 0) {
            break;
        }
        extensions.push(ext);
        baseName = path.basename(baseName, ext);
    }
    return { baseName, extensions };
}

export function getPosition(pairs: PairPattern[], currentPath: string, tabPath: string, root: string): Position | undefined {
    const currentBaseName = path.basename(currentPath);
    const currentParts = getFileParts(currentBaseName);
    const tabBaseName = path.basename(tabPath);
    const tabParts = getFileParts(tabBaseName);

    if (currentParts.baseName !== tabParts.baseName) {
        return;
    }


    const currentExt = path.extname(currentPath).toLowerCase();
    // const currentName = path.basename(currentPath, currentExt);

    const tabExt = path.extname(tabPath).toLowerCase();
    // const tabName = path.basename(tabPath, tabExt);


    const currentDir = path.relative(root, path.dirname(currentPath));
    const tabDir = path.relative(root, path.dirname(tabPath));

    let relativeCurrentPath = path.join(currentDir, currentBaseName);
    let relativeTabPath = path.join(tabDir, tabBaseName);

    // let relativeCurrentPath = path.normalize(path.join(path.relative(tabDir, currentDir), currentName + currentExt));
    // let relativeTabPath = path.normalize(path.join(path.relative(currentDir, tabDir), tabName + tabExt));

    // console.log(`relative from: "${tabDir}" to: "${currentDir}" = "${relativeCurrentPath}"`);
    // console.log(`relative from: "${currentDir}" to: "${tabDir}" = "${relativeTabPath}"`);


    for (const pair of pairs) {
        const leftPattern = pair.left.split('$(name)').join(currentParts.baseName);
        const rightPattern = pair.right.split('$(name)').join(tabParts.baseName);

        if (minimatch(relativeCurrentPath, leftPattern) && minimatch(relativeTabPath, rightPattern)) {
            return Position.Left;
        }

        if (minimatch(relativeTabPath, leftPattern) && minimatch(relativeCurrentPath, rightPattern)) {
            return Position.Right;
        }


        // if (leftPattern == relativeCurrentPath && rightPattern == relativeTabPath) {
        //     return Position.Left;
        // }

        // if (leftPattern == relativeTabPath && rightPattern == relativeCurrentPath) {
        //     return Position.Right;
        // }
    }
    return undefined;
}