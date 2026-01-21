import * as vscode from 'vscode';
import { getPairInfo, getPosition, Position } from './logic';


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

export async function moveTab(tabGroup: vscode.TabGroup, currentTab: vscode.Tab, pairTab: vscode.Tab, position: Position) {
    const currentIndex = tabGroup.tabs.indexOf(currentTab);
    const pairIndex = tabGroup.tabs.indexOf(pairTab);

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

    const supportedPair = getPairInfo(doc.fileName);
    if (!supportedPair) {
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