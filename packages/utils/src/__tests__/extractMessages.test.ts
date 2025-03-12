import { describe, expect, it } from 'vitest';
import { extractMessages } from '../extract/extractMessages';
import { MessageNode } from '../extract/types';

describe('extractMessages', () => {
    it('should extract simple string literals', () => {
        const code = `
            t("aaa")
            t('bbb')
        `;
        const expected: MessageNode[] = [
            { message: "aaa", rang: expect.any(Object)  ,namespace:"default"},
            { message: "bbb", rang: expect.any(Object)  ,namespace:"default"}
        ];
        expect(extractMessages(code)).toEqual(expected);
    });

    it('should extract string literals with object arguments', () => {
        const code = `
            t("ccc", {xxx:xxx})
        `;
        const expected: MessageNode[] = [
            { message: "ccc", rang: expect.any(Object), vars: "{xxx:xxx}" ,namespace:"default" }
        ];
        expect(extractMessages(code)).toEqual(expected);
    });

    it('should extract string literals with array arguments', () => {
        const code = `
            t('ddd', [1,2,3,""])
        `;
        const expected: MessageNode[] = [
            { message: "ddd", rang: expect.any(Object), vars: "[1,2,3,\"\"]" ,namespace:"default" }
        ];
        expect(extractMessages(code)).toEqual(expected);
    });

    it('should extract string literals with object and object options', () => {
        const code = `
            t("eee", {xxx:xxx},{})
        `;
        const expected: MessageNode[] = [
            { message: "eee", rang: expect.any(Object), vars: "{xxx:xxx}", options: "{}"  ,namespace:"default"}
        ];
        expect(extractMessages(code)).toEqual(expected);
    });

    it('should extract string literals with array and object options', () => {
        const code = `
            t('fff', [1,2,3,""],{})
        `;
        const expected: MessageNode[] = [
            { message: "fff", rang: expect.any(Object), vars: "[1,2,3,\"\"]", options: "{}"  ,namespace:"default"}
        ];
        expect(extractMessages(code)).toEqual(expected);
    }); 
    it('提取段落时忽略message', () => {
        const code = `
            <Translate>aaa</Translate>
            <Translate id="a">bbb</Translate>
            <Translate id="x" vars="y">ccc</Translate>
            <Translate id="x" vars="y" options="z">ddd</Translate>
            <Translate id="x" vars="y" options="z">eee<div>x</div>eee</Translate>
        `;
        const expected: MessageNode[] = [ 
        ];
        expect(extractMessages(code)).toEqual(expected);
    });
    it('同时存在message和children时以message优先', () => {
        const code = `
            <Translate>aaa</Translate>
            <Translate id="a">bbb</Translate>
            <Translate id="x" vars="y">ccc</Translate>
            <Translate id="x" vars="y" options="z">ddd</Translate>
            <Translate id="x" vars="y" options="z">eee<div>x</div>eee</Translate>
        `;
        const expected: MessageNode[] = [ 
        ];
        expect(extractMessages(code)).toEqual(expected);
    });
});
 