import * as path from 'path';

export enum Position {
    Left,
    Right
}

export type Pair = [string, Position];

export const PAIR_EXTENSIONS: { [key: string]: Pair[] } = {
    // C/C++
    '.c': [['.h', Position.Right]],
    '.h': [['.c', Position.Left], ['.cpp', Position.Left]],
    '.cpp': [['.hpp', Position.Right], ['.h', Position.Right], ['.hxx', Position.Right]],
    '.hpp': [['.c', Position.Left], ['.cpp', Position.Left]],
    '.cc': [['.hh', Position.Right], ['.h', Position.Right]],
    '.hh': [['.cc', Position.Left]],

    // Web
    '.js': [['.css', Position.Right], ['.html', Position.Right], ['.ts', Position.Left]],
    '.ts': [['.css', Position.Right], ['.html', Position.Right], ['.spec.ts', Position.Right]],
    '.html': [['.css', Position.Left], ['.ts', Position.Left], ['js', Position.Left]],
    '.css': [['.html', Position.Left], ['.ts', Position.Left], ['js', Position.Left]],

    // C# / Razor
    '.cs': [['.cshtml', Position.Right], ['.razor', Position.Right]],
    '.cshtml': [['.cs', Position.Left], ['.razor', Position.Left]],
    '.razor': [['.cs', Position.Left], ['.cshtml', Position.Left]],
};


export function getPairInfo(currentPath: string): Pair[] | undefined {
    const currentExt = path.extname(currentPath).toLowerCase();
    const supportedFile = PAIR_EXTENSIONS[currentExt];

    if (!supportedFile) {
        return;
    }

    return supportedFile;
}

export function getPosition(pairInfo: Pair[], currentPath: string, tabPath: string): Position | undefined {
    const currentExt = path.extname(currentPath).toLowerCase();
    const currentDir = path.dirname(currentPath);
    const currentFullname = path.join(currentDir, path.basename(currentPath, currentExt));

    const tabDir = path.dirname(tabPath);
    if (tabDir !== currentDir) {
        return;
    }

    const tabExt = path.extname(tabPath).toLowerCase();
    const tabFullname = path.join(tabDir, path.basename(tabPath, tabExt));
    if (tabFullname !== currentFullname) {
        return;
    }
    const pair = pairInfo.find(pair => pair[0] == tabExt);
    if (!pair) {
        return;
    }
    return pair[1];
}
