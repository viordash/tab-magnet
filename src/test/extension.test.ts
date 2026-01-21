import * as assert from 'assert';

import * as vscode from 'vscode';
import { getPosition, PAIR_EXTENSIONS, Position } from '../extension';

suite('Extension Test Suite', () => {
	vscode.window.showInformationMessage('Start all tests.');

	test('getPosition returns Left for h', () => {		
		const supportedFile = PAIR_EXTENSIONS['.h'];
		const currentPath = "~/test_cpp/lib/src/test.h";
		const tabPath = "~/test_cpp/lib/src/test.cpp";
		const position = getPosition(supportedFile, currentPath, tabPath);
		assert.ok(position);
		assert.equal(position, Position.Left);
		assert.strictEqual(-1, [1, 2, 3].indexOf(5));
		assert.strictEqual(-1, [1, 2, 3].indexOf(0));
	});
});
