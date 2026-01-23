import * as vscode from 'vscode';
import { getPairPattern, getPosition, Position, PairPattern, DEFAULT_PAIR_PATTERNS } from './logic';

let activeRules: PairPattern[] = [];

export function activate(context: vscode.ExtensionContext) {
    console.log('Tab Magnet is active');

    updateRules();

    context.subscriptions.push(vscode.workspace.onDidChangeConfiguration(e => {
        if (e.affectsConfiguration('tabMagnet.rules')) {
            updateRules();
        }
    }));

    let disposable = vscode.window.onDidChangeActiveTextEditor(async (editor) => {
        if (!editor) {
            return;
        }
        await groupTabs(editor);
    });

    context.subscriptions.push(disposable);
}

function updateRules() {
    const config = vscode.workspace.getConfiguration('tabMagnet');
    const userRules = config.get<PairPattern[]>('rules');
    
    if (userRules && userRules.length > 0) {
        activeRules = userRules;
        console.log(`Tab Magnet: Custom rules active. Defaults ignored. Total rules: ${activeRules.length}`);
    } else {
        activeRules = DEFAULT_PAIR_PATTERNS;
        console.log(`Tab Magnet: Default rules active. Total rules: ${activeRules.length}`);
    }
}

export async function moveTab(tabGroup: vscode.TabGroup, currentTab: vscode.Tab, pairTab: vscode.Tab, position: Position) {
    const currentIndex = tabGroup.tabs.indexOf(currentTab);
    const pairIndex = tabGroup.tabs.indexOf(pairTab);

    let targetIndex;
    switch (position) {
        case Position.Left:
            targetIndex = pairIndex;
            break;
        default:
            targetIndex = pairIndex + 1;
            break;
    }

    const needMoveToLeft = currentIndex > targetIndex;
    if (needMoveToLeft) {
        const steps = currentIndex - targetIndex;
        if (steps > 0) {
            console.log(`Move Tab to the left to "${steps}" steps`);
            await vscode.commands.executeCommand('moveActiveEditor', { to: 'left', by: 'tab', value: steps });
        }
    } else {
        const steps = (targetIndex - 1) - currentIndex;
        if (steps > 0) {
            console.log(`Move Tab to the right to "${steps}" steps`);
            await vscode.commands.executeCommand('moveActiveEditor', { to: 'right', by: 'tab', value: steps });
        }
    }
    await vscode.commands.executeCommand('workbench.action.keepEditor');
}

async function groupTabs(activeEditor: vscode.TextEditor) {
    if (!vscode.workspace.workspaceFolders || vscode.workspace.workspaceFolders.length === 0) {
        console.error(`Root path not found!!! Exit.`);
        return;
    }

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

    const supportedPair = getPairPattern(doc.fileName, activeRules);
    if (supportedPair.length === 0) {
        return;
    }

    for (const tab of activeTabGroup.tabs) {
        const skipSelf = tab === currentTab;
        if (skipSelf) {
            continue;
        }

        if (!(tab.input instanceof vscode.TabInputText)) {
            continue;
        }

        const position = getPosition(supportedPair, doc.fileName, tab.input.uri.fsPath);
        if (position !== undefined) {
            await moveTab(activeTabGroup, currentTab, tab, position);
            break;
        }
    }
}

export function deactivate() { }