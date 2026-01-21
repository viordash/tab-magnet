import * as assert from 'assert';
import { PAIR_EXTENSIONS, Position, getPairInfo, getPosition } from '../logic';


suite('Minimatch Logic Tests', () => {
    test('Exact match (sibling)', () => {
        const currentPath = '/src/file.cpp';
        const tabPath = '/src/file.h';
        {
            const pos = getPosition(PAIR_EXTENSIONS['.cpp'], currentPath, tabPath);
            assert.strictEqual(pos, Position.Right);
        }
        {
            const pos = getPosition(PAIR_EXTENSIONS['.h'], tabPath, currentPath);
            assert.notEqual(pos, undefined);
            assert.strictEqual(pos, Position.Left);
        }
    });

    test('Header in include', () => {
        const currentPath = '/lib/file.cpp';
        const tabPath = '/lib/include/file.h';
        {
            const pos = getPosition(PAIR_EXTENSIONS['.cpp'], currentPath, tabPath);
            assert.strictEqual(pos, Position.Right);
        }
        {
            const pos = getPosition(PAIR_EXTENSIONS['.h'], tabPath, currentPath);
            assert.strictEqual(pos, Position.Left);
        }
    });

    test('Parent sibling match (../include)', () => {
        const currentPath = '/proj/src/file.cpp';
        const tabPath = '/proj/include/file.h';
        {
            const pos = getPosition(PAIR_EXTENSIONS['.cpp'], currentPath, tabPath);
            assert.strictEqual(pos, Position.Right);
        }
        {
            const pos = getPosition(PAIR_EXTENSIONS['.h'], tabPath, currentPath);
            assert.strictEqual(pos, Position.Left);
        }
    });

    test('Recursive match (../**/include)', () => {
        const pairInfo = {
            '.cpp': { position: Position.Left, patterns: ["../**"] },
            '.h': { position: Position.Right, patterns: ["../include"] }
        };

        const currentPath = '/proj/src/sub/file.cpp';
        const tabPath = '/proj/src/include/file.h';
        {
            const pos = getPosition(pairInfo, currentPath, tabPath);
            assert.strictEqual(pos, Position.Right);
        }
        {
            const pos = getPosition(pairInfo, tabPath, currentPath);
            assert.strictEqual(pos, Position.Left);
        }
    });

    test('Windows path normalization', () => {
        const pos = getPosition(PAIR_EXTENSIONS['.cpp'], '/src/file.cpp', '/include/file.h');
        assert.strictEqual(pos, Position.Right);
    });

    test('Mismatch returns undefined', () => {
        const pos = getPosition(PAIR_EXTENSIONS['.cpp'], '/src/file.cpp', '/other/file.h');
        assert.strictEqual(pos, undefined);
    });

    test('Custom. Two step up folders', () => {
        const pairInfo = {
            '.cpp': { position: Position.Left, patterns: ["../../library/**"] },
            '.h': { position: Position.Right, patterns: ["../../include/library"] }
        };

        const currentPath = "~/Test/library/SpiLib/SpiLib.cpp";
        const tabPath = "~/Test/include/library/SpiLib.h";
        {
            const pos = getPosition(pairInfo, currentPath, tabPath);
            assert.strictEqual(pos, Position.Right);
        }
        {
            const pos = getPosition(pairInfo, tabPath, currentPath);
            assert.strictEqual(pos, Position.Left);
        }
    });

    // --- WEB TESTS (JS, TS, HTML, CSS) ---

    test('Web: HTML and CSS sibling', () => {
        const currentPath = '/app/components/Header.html';
        const tabPath = '/app/components/Header.css';

        // HTML -> CSS (Left -> Right)
        {
            const pos = getPosition(PAIR_EXTENSIONS['.html'], currentPath, tabPath);
            assert.strictEqual(pos, Position.Right);
        }

        // CSS -> HTML (Left -> Left)
        {
            const pos = getPosition(PAIR_EXTENSIONS['.css'], tabPath, currentPath);
            assert.strictEqual(pos, Position.Left);
        }
    });

    test('Web: TS and HTML sibling', () => {
        const currentPath = '/app/login/Login.ts';
        const tabPath = '/app/login/Login.html';

        // TS -> HTML (Right)
        // '.ts': [['.html', Position.Right]]
        {
            const pos = getPosition(PAIR_EXTENSIONS['.ts'], currentPath, tabPath);
            assert.strictEqual(pos, Position.Right);
        }

        // HTML -> TS (Left)
        // '.html': [['.ts', Position.Left]]
        {
            const pos = getPosition(PAIR_EXTENSIONS['.html'], tabPath, currentPath);
            assert.strictEqual(pos, Position.Left);
        }
    });

    test('Web: JS and CSS sibling', () => {
        const currentPath = '/static/script.js';
        const tabPath = '/static/script.css';

        // JS -> CSS (Right)
        // '.js': [['.css', Position.Right]]
        {
            const pos = getPosition(PAIR_EXTENSIONS['.js'], currentPath, tabPath);
            assert.strictEqual(pos, Position.Right);
        }
    });

    // --- TYPESCRIPT TEST FOLDER ---

    test('TypeScript: Source and Test in subfolder', () => {
        const currentPath = '/project/src/logic.ts';
        const tabPath = '/project/src/test/logic.ts';

        // .ts -> .ts (in a test folder) -> Right
        {
            const pos = getPosition(PAIR_EXTENSIONS['.ts'], currentPath, tabPath);
            assert.strictEqual(pos, Position.Right);
        }
    });

    // --- C# / .NET TESTS ---

    test('C#: CS and CSHTML (Razor Pages)', () => {
        const currentPath = '/Pages/Index.cs';
        const tabPath = '/Pages/Index.cshtml';

        // .cs -> .cshtml (Right)
        {
            const pos = getPosition(PAIR_EXTENSIONS['.cs'], currentPath, tabPath);
            assert.strictEqual(pos, Position.Right);
        }

        // .cshtml -> .cs (Left)
        {
            const pos = getPosition(PAIR_EXTENSIONS['.cshtml'], tabPath, currentPath);
            assert.strictEqual(pos, Position.Left);
        }
    });

    test('C#: CS and Razor (Blazor)', () => {
        const currentPath = '/Components/Counter.cs';
        const tabPath = '/Components/Counter.razor';

        // .cs -> .razor (Right)
        {
            const pos = getPosition(PAIR_EXTENSIONS['.cs'], currentPath, tabPath);
            assert.strictEqual(pos, Position.Right);
        }

        // .razor -> .cs (Left)
        {
            const pos = getPosition(PAIR_EXTENSIONS['.razor'], tabPath, currentPath);
            assert.strictEqual(pos, Position.Left);
        }
    });

});

