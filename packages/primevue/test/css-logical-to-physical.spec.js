test('does not duplicate physical properties', async () => {
    const postcss = require('postcss');
    const logicalToPhysical = require('../../scripts/css-logical-to-physical');
    const input = `
        .foo {
            margin-inline-start: 10px;
            margin-left: 10px;
        }
    `;
    const result = await postcss([logicalToPhysical()]).process(input, { from: undefined });
    // Only one margin-left should exist
    expect(result.css.match(/margin-left: 10px/g).length).toBe(1);
});

test('warns on unmapped logical property', async () => {
    const postcss = require('postcss');
    const logicalToPhysical = require('../../scripts/css-logical-to-physical');
    const input = `.foo { logical-unknown: 1px; }`;
    let warning = null;
    await postcss([logicalToPhysical()]).process(input, {
        from: undefined,
        // Capture warnings
        result: {
            warn: (msg, opts) => {
                warning = msg;
            }
        }
    });
    expect(warning).toMatch(/Unmapped logical property/);
});

test('supports custom mapping extension', async () => {
    const postcss = require('postcss');
    const logicalToPhysical = require('../../scripts/css-logical-to-physical');
    const input = `.foo { custom-logical: 123px; }`;
    const result = await postcss([logicalToPhysical({ customMap: { 'custom-logical': 'custom-physical' } })]).process(input, { from: undefined });
    expect(result.css).toMatch(/custom-physical: 123px/);
});
test('transforms logical properties to physical properties (RTL)', async () => {
    const postcss = require('postcss');
    const logicalToPhysical = require('../../scripts/css-logical-to-physical');
    const input = `
        .foo {
            margin-inline-start: 10px;
            margin-inline-end: 11px;
            padding-inline-start: 12px;
            padding-inline-end: 13px;
            border-inline-start: 1px solid red;
            border-inline-end: 2px solid blue;
            border-start-start-radius: 9px;
            border-end-end-radius: 12px;
            float: inline-start;
            clear: inline-end;
            text-align: end;
        }
    `;
    const result = await postcss([logicalToPhysical({ direction: 'rtl' })]).process(input, { from: undefined });
    expect(result.css).toMatch(/margin-right: 10px/);
    expect(result.css).toMatch(/margin-left: 11px/);
    expect(result.css).toMatch(/padding-right: 12px/);
    expect(result.css).toMatch(/padding-left: 13px/);
    expect(result.css).toMatch(/border-right: 1px solid red/);
    expect(result.css).toMatch(/border-left: 2px solid blue/);
    expect(result.css).toMatch(/border-top-right-radius: 9px/);
    expect(result.css).toMatch(/border-bottom-left-radius: 12px/);
    expect(result.css).toMatch(/float: right/);
    expect(result.css).toMatch(/clear: left/);
    expect(result.css).toMatch(/text-align: left/);
});
// Test for css-logical-to-physical PostCSS plugin
const postcss = require('postcss');
const logicalToPhysical = require('../../scripts/css-logical-to-physical');

test('transforms logical properties to physical properties', async () => {
    const input = `
        .foo {
            margin-inline-start: 10px;
            margin-inline-end: 11px;
            margin-block-start: 12px;
            margin-block-end: 13px;
            padding-inline-start: 14px;
            padding-inline-end: 15px;
            padding-block-start: 16px;
            padding-block-end: 17px;
            border-inline-start: 1px solid red;
            border-inline-end: 2px solid blue;
            border-block-start: 3px solid green;
            border-block-end: 4px solid yellow;
            border-inline-start-width: 5px;
            border-inline-end-width: 6px;
            border-block-start-width: 7px;
            border-block-end-width: 8px;
            border-inline-start-style: dashed;
            border-inline-end-style: dotted;
            border-block-start-style: solid;
            border-block-end-style: double;
            border-inline-start-color: orange;
            border-inline-end-color: purple;
            border-block-start-color: pink;
            border-block-end-color: brown;
            border-start-start-radius: 9px;
            border-start-end-radius: 10px;
            border-end-start-radius: 11px;
            border-end-end-radius: 12px;
            outline-inline-start: 1px solid black;
            outline-inline-end: 2px solid gray;
            inset-inline-start: 13px;
            inset-inline-end: 14px;
            inset-block-start: 15px;
            inset-block-end: 16px;
        }
    `;
    const result = await postcss([logicalToPhysical()]).process(input, { from: undefined });
    expect(result.css).toMatch(/margin-left: 10px/);
    expect(result.css).toMatch(/margin-right: 11px/);
    expect(result.css).toMatch(/margin-top: 12px/);
    expect(result.css).toMatch(/margin-bottom: 13px/);
    expect(result.css).toMatch(/padding-left: 14px/);
    expect(result.css).toMatch(/padding-right: 15px/);
    expect(result.css).toMatch(/padding-top: 16px/);
    expect(result.css).toMatch(/padding-bottom: 17px/);
    expect(result.css).toMatch(/border-left: 1px solid red/);
    expect(result.css).toMatch(/border-right: 2px solid blue/);
    expect(result.css).toMatch(/border-top: 3px solid green/);
    expect(result.css).toMatch(/border-bottom: 4px solid yellow/);
    expect(result.css).toMatch(/border-left-width: 5px/);
    expect(result.css).toMatch(/border-right-width: 6px/);
    expect(result.css).toMatch(/border-top-width: 7px/);
    expect(result.css).toMatch(/border-bottom-width: 8px/);
    expect(result.css).toMatch(/border-left-style: dashed/);
    expect(result.css).toMatch(/border-right-style: dotted/);
    expect(result.css).toMatch(/border-top-style: solid/);
    expect(result.css).toMatch(/border-bottom-style: double/);
    expect(result.css).toMatch(/border-left-color: orange/);
    expect(result.css).toMatch(/border-right-color: purple/);
    expect(result.css).toMatch(/border-top-color: pink/);
    expect(result.css).toMatch(/border-bottom-color: brown/);
    expect(result.css).toMatch(/border-top-left-radius: 9px/);
    expect(result.css).toMatch(/border-top-right-radius: 10px/);
    expect(result.css).toMatch(/border-bottom-left-radius: 11px/);
    expect(result.css).toMatch(/border-bottom-right-radius: 12px/);
    expect(result.css).toMatch(/outline-left: 1px solid black/);
    expect(result.css).toMatch(/outline-right: 2px solid gray/);
    expect(result.css).toMatch(/left: 13px/);
    expect(result.css).toMatch(/right: 14px/);
    expect(result.css).toMatch(/top: 15px/);
    expect(result.css).toMatch(/bottom: 16px/);
});
