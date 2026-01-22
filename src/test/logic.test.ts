import * as assert from 'assert';
import { Position, getPairPattern, getPosition } from '../logic';


suite('getPosition Logic Tests', () => {
    test('Sibling', () => {
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

    test('Sibling2', () => {
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

    test('Cousin', () => {
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

    test('Cousin2', () => {
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

    test('Nephew (Include)', () => {
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

    test('Second cousins (exact pattern)', () => {
        const majorFile = "~/Test/library/SpiLib/SpiLib.cpp";
        const minorFile = "~/Test/include/library/SpiLib.h";
        const pairs = [{ left: 'library/SpiLib/$(name).cpp', right: 'include/library/$(name).h' }];

        assert.strictEqual(getPosition(pairs, majorFile, minorFile), Position.Left);
        assert.strictEqual(getPosition(pairs, minorFile, majorFile), Position.Right);
        assert.strictEqual(getPosition(pairs, majorFile, '/src/SpiLib.h'), undefined);
        assert.strictEqual(getPosition(pairs, '/SpiLib.cpp', minorFile), undefined);
    });

    test('Second cousins (* pattern)', () => {
        const majorFile = "~/Test/library/SpiLib/SpiLib.cpp";
        const minorFile = "~/Test/include/library/SpiLib.h";
        const pairs = [{ left: 'library/SpiLib/$(name).cpp', right: 'include/*/$(name).h' }];

        assert.strictEqual(getPosition(pairs, majorFile, minorFile), Position.Left);
        assert.strictEqual(getPosition(pairs, minorFile, majorFile), Position.Right);
        assert.strictEqual(getPosition(pairs, majorFile, '/src/SpiLib.h'), undefined);
        assert.strictEqual(getPosition(pairs, '/SpiLib.cpp', minorFile), undefined);
    });

    test('Suffix in name', () => {
        const majorFile = "/src/component.ts";
        const minorFile = "/src/component.spec.ts";
        const pairs = [{ left: '$(name).ts', right: '$(name).spec.ts' }];

        assert.strictEqual(getPosition(pairs, majorFile, minorFile), Position.Left);
        assert.strictEqual(getPosition(pairs, minorFile, majorFile), Position.Right);
        assert.strictEqual(getPosition(pairs, majorFile, '/test/component.spec.ts'), undefined);
        assert.strictEqual(getPosition(pairs, '/component.ts', minorFile), undefined);
    });

    test('Suffix in name, nephew (test)', () => {
        const majorFile = "/src/component.ts";
        const minorFile = "/src/test/component.spec.ts";
        const pairs = [{ left: '$(name).ts', right: 'test/$(name).spec.ts' }];

        assert.strictEqual(getPosition(pairs, majorFile, minorFile), Position.Left);
        assert.strictEqual(getPosition(pairs, minorFile, majorFile), Position.Right);
        assert.strictEqual(getPosition(pairs, majorFile, '/component.spec.ts'), undefined);
        assert.strictEqual(getPosition(pairs, '/component.ts', minorFile), undefined);
    });

    test('Suffix+ext and ext', () => {
        const majorFile = "/src/MainWindow.xaml.cs";
        const minorFile = "/src/MainWindow.xaml";
        const pairs = [{ left: '$(name).xaml.cs', right: '$(name).xaml' }];

        assert.strictEqual(getPosition(pairs, majorFile, minorFile), Position.Left);
        assert.strictEqual(getPosition(pairs, minorFile, majorFile), Position.Right);
        assert.strictEqual(getPosition(pairs, majorFile, '/test/MainWindow.xaml'), undefined);
        assert.strictEqual(getPosition(pairs, '/MainWindow.xaml.cs', minorFile), undefined);
    });

    test('Header in include', () => {
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

    test('Parent sibling match (../include)', () => {
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

    test('Recursive match (../**/include)', () => {
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

    test('Mismatch returns undefined', () => {
        const pos = getPosition(getPairPattern('/src/file.cpp'), '/src/file.cpp', '/other/file1.h');
        assert.strictEqual(pos, undefined);
    });

    // --- WEB TESTS (JS, TS, HTML, CSS) ---

    test('Web: HTML and CSS sibling', () => {
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

    test('Web: TS and HTML sibling', () => {
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

    test('Web: JS and CSS sibling', () => {
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

    test('Web: TS and HTML Angular component', () => {
        const majorFile = '/app/main/main.component.ts';
        const minorFile = '/app/main/main.component.html';

        {
            const pos = getPosition(getPairPattern(majorFile), majorFile, minorFile);
            assert.strictEqual(pos, Position.Left);
        }
        {
            const pos = getPosition(getPairPattern(minorFile), minorFile, majorFile);
            assert.strictEqual(pos, Position.Right);
        }
    });

    // // --- TYPESCRIPT TEST FOLDER ---

    test('TypeScript: Source and Test in subfolder', () => {
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

    test('C#: CS and CSHTML (Razor Pages)', () => {
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

    test('C#: CS and Razor (Blazor)', () => {
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

});

