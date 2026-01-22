import * as assert from 'assert';
import { Position, getPairPattern, getPosition } from '../logic';


suite('getPosition Logic Tests', () => {
    test('C++ Sibling: Source (.cpp) and Header (.h) in same folder', () => {
        const majorFile = '/src/file.cpp';
        const minorFile = '/src/file.h';
        const pairs = [{ left: '$(name).cpp', right: '$(name).h' }];

        assert.strictEqual(getPosition(pairs, majorFile, minorFile), Position.Left);
        assert.strictEqual(getPosition(pairs, minorFile, majorFile), Position.Right);
        assert.strictEqual(getPosition(pairs, majorFile, '/include/file.h'), undefined);
        assert.strictEqual(getPosition(pairs, '/file.cpp', minorFile), undefined);
        assert.strictEqual(getPosition(pairs, '/src/File.cpp', minorFile), undefined);
        assert.strictEqual(getPosition(pairs, '/src/File.h', majorFile), undefined);
    });

    test('C++ Sibling: Deeply nested Source and Header', () => {
        const majorFile = '/src/folder1/folder2/file.cpp';
        const minorFile = '/src/folder1/folder2/file.h';
        const pairs = [{ left: '$(name).cpp', right: '$(name).h' }];

        assert.strictEqual(getPosition(pairs, majorFile, minorFile), Position.Left);
        assert.strictEqual(getPosition(pairs, minorFile, majorFile), Position.Right);
        assert.strictEqual(getPosition(pairs, majorFile, '/include/file.h'), undefined);
        assert.strictEqual(getPosition(pairs, '/file.cpp', minorFile), undefined);
        assert.strictEqual(getPosition(pairs, '/src/folder1/folder2/File.cpp', minorFile), undefined);
        assert.strictEqual(getPosition(pairs, '/src/folder1/folder2/File.h', majorFile), undefined);
    });

    test('Pattern Match: Cousin folders using wildcard (*/$(name))', () => {
        const majorFile = '/src1/file.cpp';
        const minorFile = '/src2/file.h';
        const pairs = [{ left: '*/$(name).cpp', right: '*/$(name).h' }];

        assert.strictEqual(getPosition(pairs, majorFile, minorFile), Position.Left);
        assert.strictEqual(getPosition(pairs, minorFile, majorFile), Position.Right);
        assert.strictEqual(getPosition(pairs, majorFile, '/src/include/file.h'), undefined);
        assert.strictEqual(getPosition(pairs, '/file.cpp', minorFile), undefined);
        assert.strictEqual(getPosition(pairs, '/src/File.cpp', minorFile), undefined);
        assert.strictEqual(getPosition(pairs, '/src/File.h', majorFile), undefined);
    });

    test('Pattern Match: Deeply nested Cousin folders using wildcard', () => {
        const majorFile = '/project/folder1/folder2/src1/file.cpp';
        const minorFile = '/project/folder1/folder2/src2/file.h';
        const pairs = [{ left: '*/$(name).cpp', right: '*/$(name).h' }];

        assert.strictEqual(getPosition(pairs, majorFile, minorFile), Position.Left);
        assert.strictEqual(getPosition(pairs, minorFile, majorFile), Position.Right);
        assert.strictEqual(getPosition(pairs, majorFile, '/project/src/include/file.h'), undefined);
        assert.strictEqual(getPosition(pairs, '/file.cpp', minorFile), undefined);
        assert.strictEqual(getPosition(pairs, '/project/src/File.cpp', minorFile), undefined);
        assert.strictEqual(getPosition(pairs, '/project/src/File.h', majorFile), undefined);
    });

    test('C++ Structure: Header in "include" subdirectory', () => {
        const majorFile = '/src/file.cpp';
        const minorFile = '/src/include/file.h';
        const pairs = [{ left: '$(name).cpp', right: 'include/$(name).h' }];

        assert.strictEqual(getPosition(pairs, majorFile, minorFile), Position.Left);
        assert.strictEqual(getPosition(pairs, minorFile, majorFile), Position.Right);
        assert.strictEqual(getPosition(pairs, majorFile, '/src/file.h'), undefined);
        assert.strictEqual(getPosition(pairs, '/file.cpp', minorFile), undefined);
        assert.strictEqual(getPosition(pairs, '/src/File.cpp', minorFile), undefined);
        assert.strictEqual(getPosition(pairs, '/src/Include/file.h', majorFile), undefined);
    });

    test('Complex Path: Distinct "library" and "include" trees (Exact Pattern)', () => {
        const majorFile = "~/Test/library/SpiLib/SpiLib.cpp";
        const minorFile = "~/Test/include/library/SpiLib.h";
        const pairs = [{ left: 'library/SpiLib/$(name).cpp', right: 'include/library/$(name).h' }];

        assert.strictEqual(getPosition(pairs, majorFile, minorFile), Position.Left);
        assert.strictEqual(getPosition(pairs, minorFile, majorFile), Position.Right);
        assert.strictEqual(getPosition(pairs, majorFile, '/src/SpiLib.h'), undefined);
        assert.strictEqual(getPosition(pairs, '/SpiLib.cpp', minorFile), undefined);
    });

    test('Complex Path: Distinct trees using wildcard (*)', () => {
        const majorFile = "~/Test/library/SpiLib/SpiLib.cpp";
        const minorFile = "~/Test/include/library/SpiLib.h";
        const pairs = [{ left: 'library/SpiLib/$(name).cpp', right: 'include/*/$(name).h' }];

        assert.strictEqual(getPosition(pairs, majorFile, minorFile), Position.Left);
        assert.strictEqual(getPosition(pairs, minorFile, majorFile), Position.Right);
        assert.strictEqual(getPosition(pairs, majorFile, '/src/SpiLib.h'), undefined);
        assert.strictEqual(getPosition(pairs, '/SpiLib.cpp', minorFile), undefined);
    });

    test('TypeScript: Source (.ts) and Spec (.spec.ts) in same folder', () => {
        const majorFile = "/src/component.ts";
        const minorFile = "/src/component.spec.ts";
        const pairs = [{ left: '$(name).ts', right: '$(name).spec.ts' }];

        assert.strictEqual(getPosition(pairs, majorFile, minorFile), Position.Left);
        assert.strictEqual(getPosition(pairs, minorFile, majorFile), Position.Right);
        assert.strictEqual(getPosition(pairs, majorFile, '/test/component.spec.ts'), undefined);
        assert.strictEqual(getPosition(pairs, '/component.ts', minorFile), undefined);
    });

    test('TypeScript: Spec (.spec.ts) in "test" subfolder', () => {
        const majorFile = "/src/component.ts";
        const minorFile = "/src/test/component.spec.ts";
        const pairs = [{ left: '$(name).ts', right: 'test/$(name).spec.ts' }];

        assert.strictEqual(getPosition(pairs, majorFile, minorFile), Position.Left);
        assert.strictEqual(getPosition(pairs, minorFile, majorFile), Position.Right);
        assert.strictEqual(getPosition(pairs, majorFile, '/component.spec.ts'), undefined);
        assert.strictEqual(getPosition(pairs, '/component.ts', minorFile), undefined);
    });

    test('C# WPF: Code-behind (.xaml.cs) and XAML (.xaml)', () => {
        const majorFile = "/src/MainWindow.xaml.cs";
        const minorFile = "/src/MainWindow.xaml";
        const pairs = [{ left: '$(name).xaml.cs', right: '$(name).xaml' }];

        assert.strictEqual(getPosition(pairs, majorFile, minorFile), Position.Left);
        assert.strictEqual(getPosition(pairs, minorFile, majorFile), Position.Right);
        assert.strictEqual(getPosition(pairs, majorFile, '/test/MainWindow.xaml'), undefined);
        assert.strictEqual(getPosition(pairs, '/MainWindow.xaml.cs', minorFile), undefined);
    });

    test('Integration: C++ Header in "include" subfolder', () => {
        const majorFile = '/lib/file.cpp';
        const minorFile = '/lib/include/file.h';
        {
            const pos = getPosition(getPairPattern(majorFile), majorFile, minorFile);
            assert.strictEqual(pos, Position.Left);
        }
        {
            const pos = getPosition(getPairPattern(minorFile), minorFile, majorFile);
            assert.strictEqual(pos, Position.Right);
        }
    });

    test('Integration: C++ "src" vs "include" sibling folders (Legacy pattern check)', () => {
        const majorFile = '/proj/src/file.cpp';
        const minorFile = '/proj/include/file.h';
        {
            const pos = getPosition(getPairPattern(majorFile), majorFile, minorFile);
            assert.strictEqual(pos, Position.Left);
        }
        {
            const pos = getPosition(getPairPattern(minorFile), minorFile, majorFile);
            assert.strictEqual(pos, Position.Right);
        }
    });

    test('Integration: Deep folder matching using standard patterns', () => {
        const majorFile = '/proj/src/sub/file.cpp';
        const minorFile = '/proj/src/include/file.h';
        {
            const pos = getPosition(getPairPattern(majorFile), majorFile, minorFile);
            assert.strictEqual(pos, Position.Left);
        }
        {
            const pos = getPosition(getPairPattern(minorFile), minorFile, majorFile);
            assert.strictEqual(pos, Position.Right);
        }
    });

    test('Negative: Unrelated files return undefined', () => {
        const pos = getPosition(getPairPattern('/src/file.cpp'), '/src/file.cpp', '/other/file1.h');
        assert.strictEqual(pos, undefined);
    });

    // --- WEB TESTS (JS, TS, HTML, CSS) ---

    test('Integration: Web HTML and CSS sibling', () => {
        const majorFile = '/app/components/Header.html';
        const minorFile = '/app/components/Header.css';

        {
            const pos = getPosition(getPairPattern(majorFile), majorFile, minorFile);
            assert.strictEqual(pos, Position.Left);
        }
        {
            const pos = getPosition(getPairPattern(minorFile), minorFile, majorFile);
            assert.strictEqual(pos, Position.Right);
        }
    });

    test('Integration: Web TS and HTML sibling', () => {
        const majorFile = '/app/login/Login.ts';
        const minorFile = '/app/login/Login.html';

        {
            const pos = getPosition(getPairPattern(majorFile), majorFile, minorFile);
            assert.strictEqual(pos, Position.Left);
        }
        {
            const pos = getPosition(getPairPattern(minorFile), minorFile, majorFile);
            assert.strictEqual(pos, Position.Right);
        }
    });

    test('Integration: Web JS and CSS sibling', () => {
        const majorFile = '/static/script.js';
        const minorFile = '/static/script.css';

        {
            const pos = getPosition(getPairPattern(majorFile), majorFile, minorFile);
            assert.strictEqual(pos, Position.Left);
        }
        {
            const pos = getPosition(getPairPattern(minorFile), minorFile, majorFile);
            assert.strictEqual(pos, Position.Right);
        }
    });

    test('Integration: TypeScript Source and Test in subfolder', () => {
        const majorFile = '/project/src/logic.ts';
        const minorFile = '/project/src/test/logic.ts';

        {
            const pos = getPosition(getPairPattern(majorFile), majorFile, minorFile);
            assert.strictEqual(pos, Position.Left);
        }
        {
            const pos = getPosition(getPairPattern(minorFile), minorFile, majorFile);
            assert.strictEqual(pos, Position.Right);
        }
    });

    // --- C# / .NET TESTS ---

    test('Integration: C# Razor Pages (.cs and .cshtml)', () => {
        const majorFile = '/Pages/Index.cs';
        const minorFile = '/Pages/Index.cshtml';

        {
            const pos = getPosition(getPairPattern(majorFile), majorFile, minorFile);
            assert.strictEqual(pos, Position.Left);
        }
        {
            const pos = getPosition(getPairPattern(minorFile), minorFile, majorFile);
            assert.strictEqual(pos, Position.Right);
        }
    });

    test('Integration: C# Blazor (.cs and .razor)', () => {
        const majorFile = '/Components/Counter.cs';
        const minorFile = '/Components/Counter.razor';

        {
            const pos = getPosition(getPairPattern(majorFile), majorFile, minorFile);
            assert.strictEqual(pos, Position.Left);
        }
        {
            const pos = getPosition(getPairPattern(minorFile), minorFile, majorFile);
            assert.strictEqual(pos, Position.Right);
        }
    });

    // --- NEW TESTS FOR ANGULAR / MULTI-EXTENSION ---
    
    test('Angular Component: Multi-dot extension stripping (hero.component.ts -> hero)', () => {
        const majorFile = '/app/hero.component.ts';
        const minorFile = '/app/hero.component.html';
        
        // This relies on getFileName stripping BOTH .ts and .component
        // and matching against { left: '$(name).component.ts', right: '$(name).component.html' }
        
        {
            const pos = getPosition(getPairPattern(majorFile), majorFile, minorFile);
            assert.strictEqual(pos, Position.Left);
        }
        {
            const pos = getPosition(getPairPattern(minorFile), minorFile, majorFile);
            assert.strictEqual(pos, Position.Right);
        }
    });

});