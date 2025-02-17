import { describe, expect, it } from 'vitest';
import { extractMessages, TranslateNode } from '../extractMessages';
import { getFileNamespace } from '../getFileNamespace';

describe('extractMessages', () => {
    it('should extract simple string literals', () => {
        const code = `
            t("aaa")
            t('bbb')
        `;
        const expected: TranslateNode[] = [
            { text: "aaa", rang: expect.any(Object)  ,namespace:"default"},
            { text: "bbb", rang: expect.any(Object)  ,namespace:"default"}
        ];
        expect(extractMessages(code)).toEqual(expected);
    });

    it('should extract string literals with object arguments', () => {
        const code = `
            t("ccc", {xxx:xxx})
        `;
        const expected: TranslateNode[] = [
            { text: "ccc", rang: expect.any(Object), args: "{xxx:xxx}" ,namespace:"default" }
        ];
        expect(extractMessages(code)).toEqual(expected);
    });

    it('should extract string literals with array arguments', () => {
        const code = `
            t('ddd', [1,2,3,""])
        `;
        const expected: TranslateNode[] = [
            { text: "ddd", rang: expect.any(Object), args: "[1,2,3,\"\"]" ,namespace:"default" }
        ];
        expect(extractMessages(code)).toEqual(expected);
    });

    it('should extract string literals with object and object options', () => {
        const code = `
            t("eee", {xxx:xxx},{})
        `;
        const expected: TranslateNode[] = [
            { text: "eee", rang: expect.any(Object), args: "{xxx:xxx}", options: "{}"  ,namespace:"default"}
        ];
        expect(extractMessages(code)).toEqual(expected);
    });

    it('should extract string literals with array and object options', () => {
        const code = `
            t('fff', [1,2,3,""],{})
        `;
        const expected: TranslateNode[] = [
            { text: "fff", rang: expect.any(Object), args: "[1,2,3,\"\"]", options: "{}"  ,namespace:"default"}
        ];
        expect(extractMessages(code)).toEqual(expected);
    });

    it('should extract string literals with object and function options', () => {
        const code = `
            t("ggg", {xxx:xxx},()=>{})
        `;
        const expected: TranslateNode[] = [
            { text: "ggg", rang: expect.any(Object), args: "{xxx:xxx}", options: "()=>{}" ,namespace:"default" }
        ];
        expect(extractMessages(code)).toEqual(expected);
    });

    it('should extract string literals with array and function options', () => {
        const code = `
            t('hhh', [1,2,3,""],()=>{})
        `;
        const expected: TranslateNode[] = [
            { text: "hhh", rang: expect.any(Object), args: "[1,2,3,\"\"]", options: "()=>{}" ,namespace:"default"}
        ];
        expect(extractMessages(code)).toEqual(expected);
    });
});

// 添加 getNamespace 的测试用例
describe('getFileNamespace', () => {
    const namespaces: Record<string, string | string[] | ((file: string) => boolean)> = {
        "a": "src/a",
        "b": ["src/b", "src/c"],
        "c": (file: string) => file.endsWith(".ts")
    };

    it('should return the correct namespace for a file in a single path', () => {
        expect(getFileNamespace("src/a/xxx.js", namespaces)).toBe("a");
    });

    it('should return the correct namespace for a file in multiple paths', () => {
        expect(getFileNamespace("src/b/xxx.js", namespaces)).toBe("b");
        expect(getFileNamespace("src/c/xxx.js", namespaces)).toBe("b");
    });

    it('should return the correct namespace for a file using a function', () => {
        expect(getFileNamespace("src/cxx/xxx.ts", namespaces)).toBe("c");
    });

    it('should return the default namespace for a file not in any namespace', () => {
        expect(getFileNamespace("src/d/xxx.js", namespaces)).toBe("default");
    });
});