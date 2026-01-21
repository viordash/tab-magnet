import * as assert from 'assert';
import { PAIR_EXTENSIONS, Position, getPairInfo, getPosition } from '../logic';

suite('Logic Tests', () => {
    test('Header file (.h) expects source on the Left', () => {
        const result = getPairInfo('/path/to/file.h');
        assert.ok(result);
        assert.strictEqual(result[0][1], Position.Left);
    });

    test('Source file (.c) expects header on the Right', () => {
        const result = getPairInfo('file.c');
        assert.ok(result);
        assert.strictEqual(result[0][1], Position.Right);
    });

    test('Unknown extension returns null', () => {
        const result = getPairInfo('image.png');
        assert.strictEqual(result, undefined);
    });

    test('getPosition returns Left for h', () => {
        const supportedFile = PAIR_EXTENSIONS['.h'];
        const currentPath = "~/test_cpp/lib/src/test.h";
        const tabPath = "~/test_cpp/lib/src/test.cpp";
        const position = getPosition(supportedFile, currentPath, tabPath);
        assert.notEqual(position, undefined);
        assert.equal(position, Position.Left);
    });
});