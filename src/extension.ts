import * as vscode from 'vscode';
import * as path from 'path';

enum Position {
    Left,
    Right
}

type Pair = [string, Position];

const PAIR_EXTENSIONS: { [key: string]: Pair[] } = {
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


export function activate(context: vscode.ExtensionContext) {
    console.log('Tab Magnet is active');

    let disposable = vscode.window.onDidChangeActiveTextEditor(async (editor) => {
        if (!editor) {
            return;
        }
        await groupTabs(editor);
    });

    context.subscriptions.push(disposable);
}

async function groupTabs(activeEditor: vscode.TextEditor) {
    const doc = activeEditor.document;
    const isFile = doc.uri.scheme === 'file';
    if (!isFile) {
        return;
    }

    const activeTabGroup = vscode.window.tabGroups.activeTabGroup;
    if (!activeTabGroup) {
        return;
    }


    const currentTab = activeTabGroup.tabs.find(t =>
        t.input instanceof vscode.TabInputText &&
        t.input.uri.fsPath === doc.uri.fsPath
    );

    if (!currentTab) {
        return;
    }

    const currentExt = path.extname(doc.fileName).toLowerCase();
    const supportedFile = PAIR_EXTENSIONS[currentExt];

    if (!supportedFile) {
        return;
    }

    const currentDir = path.dirname(doc.fileName);
    const currentFullname = path.join(currentDir, path.basename(doc.fileName, currentExt));

    let pairTab: vscode.Tab | undefined;
    let position: Position | undefined;

    for (const tab of activeTabGroup.tabs) {
        const skipSelf = tab === currentTab;
        if (skipSelf) {
            continue;
        }

        if (!(tab.input instanceof vscode.TabInputText)) {
            continue;
        }
        const tabPath = tab.input.uri.fsPath;
        const tabDir = path.dirname(tabPath);
        if (tabDir !== currentDir) {
            continue;
        }

        const tabExt = path.extname(tabPath).toLowerCase();
        const tabFullname = path.join(tabDir, path.basename(tabPath, tabExt));
        if (tabFullname !== currentFullname) {
            continue;
        }
        const pair = supportedFile.find(pair => pair[0] == tabExt);
        if (!pair) {
            continue;
        }
        pairTab = tab;
        position = pair[1];
        break;
    }

    if (pairTab == undefined || position == undefined) {
        return;
    }

    const currentIndex = activeTabGroup.tabs.indexOf(currentTab);
    const pairIndex = activeTabGroup.tabs.indexOf(pairTab);

    let targetIndex;
    switch (position) {
        case Position.Left:
            targetIndex = pairIndex + 1;
            break;
        default:
            targetIndex = pairIndex;
            break;
    }

    const needMoveToLeft = currentIndex > targetIndex;
    if (needMoveToLeft) {
        const steps = currentIndex - targetIndex;
        if (steps >= 0) {
            console.log(`Move Tab to the left to "${steps}" steps`);
            await vscode.commands.executeCommand('moveActiveEditor', { to: 'left', by: 'tab', value: steps });
            await vscode.commands.executeCommand('workbench.action.keepEditor');
        }
    } else {
        const steps = (targetIndex - 1) - currentIndex;
        if (steps >= 0) {
            console.log(`Move Tab to the right to "${steps}" steps`);
            await vscode.commands.executeCommand('moveActiveEditor', { to: 'right', by: 'tab', value: steps });
            await vscode.commands.executeCommand('workbench.action.keepEditor');
        }
    }
}

export function deactivate() { }