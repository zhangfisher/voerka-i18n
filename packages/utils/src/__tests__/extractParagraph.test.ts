import { describe, expect, it } from 'vitest';
import { extractParagraphs, ParagraphNode } from '../extract/ast/extractParagraphs';
 

describe('extractParagraphs', () => {
    it('提取段落', () => {
        const code = `
            <Translate>aaa</Translate>
            <Translate id="a">bbb</Translate>
            <Translate id="x" vars="y">ccc</Translate>
            <Translate id="x" vars="y" options="z">ddd</Translate>
            <Translate id="x" vars="y" options="z">eee<div>x</div>eee</Translate>
        `;
        const expected: ParagraphNode[] = [
            { message: "aaa", rang: expect.any(Object), namespace:"default",file:undefined}, 
            { message: "bbb", id: "a", rang: expect.any(Object), namespace:"default",file:undefined}, 
            { message: "ccc", id: "x", vars: "y", rang: expect.any(Object), namespace:"default",file:undefined}, 
            { message: "ddd", id: "x", vars: "y", options: "z", rang: expect.any(Object), namespace:"default",file:undefined},
            { message: "eee\n<div>x</div>\neee", id: "x", vars: "y", options: "z", rang: expect.any(Object), namespace:"default",file:undefined}
        ];
        expect(extractParagraphs(code)).toEqual(expected);
    });
 
});
 