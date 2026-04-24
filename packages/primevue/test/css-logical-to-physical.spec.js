const postcss = require('postcss');
const logicalToPhysical = require('../../../scripts/css-logical-to-physical');

// --- Shorthand property tests ---
test('transforms margin-inline and margin-block shorthands', async () => {
    const input = `.foo { margin-inline: 1px 2px; margin-block: 3px 4px; }`;
    const result = await postcss([logicalToPhysical()]).process(input, { from: undefined });

    expect(result.css).toMatch(/margin-left: 1px/);
    expect(result.css).toMatch(/margin-right: 2px/);
    expect(result.css).toMatch(/margin-top: 3px/);
    expect(result.css).toMatch(/margin-bottom: 4px/);
});

test('margin-inline shorthand: single value duplicates', async () => {
    const input = `.foo { margin-inline: 1rem; }`;
    const result = await postcss([logicalToPhysical()]).process(input, { from: undefined });

    expect(result.css).toMatch(/margin-left: 1rem/);
    expect(result.css).toMatch(/margin-right: 1rem/);
});

test('margin-inline: calc() and value', async () => {
    const input = `.foo { margin-inline: calc(100% - 1rem) 2rem; }`;
    const result = await postcss([logicalToPhysical()]).process(input, { from: undefined });

    expect(result.css).toMatch(/margin-left: calc\(100% - 1rem\)/);
    expect(result.css).toMatch(/margin-right: 2rem/);
});

test('transforms padding-inline and padding-block shorthands', async () => {
    const input = `.foo { padding-inline: 5px 6px; padding-block: 7px 8px; }`;
    const result = await postcss([logicalToPhysical()]).process(input, { from: undefined });

    expect(result.css).toMatch(/padding-left: 5px/);
    expect(result.css).toMatch(/padding-right: 6px/);
    expect(result.css).toMatch(/padding-top: 7px/);
    expect(result.css).toMatch(/padding-bottom: 8px/);
});

test('padding-block: var() values', async () => {
    const input = `.foo { padding-block: var(--space-md) var(--space-lg); }`;
    const result = await postcss([logicalToPhysical()]).process(input, { from: undefined });

    expect(result.css).toMatch(/padding-top: var\(--space-md\)/);
    expect(result.css).toMatch(/padding-bottom: var\(--space-lg\)/);
});

test('transforms inset shorthand', async () => {
    const input = `.foo { inset: 1px 2px 3px 4px; }`;
    const result = await postcss([logicalToPhysical()]).process(input, { from: undefined });

    expect(result.css).toMatch(/top: 1px/);
    expect(result.css).toMatch(/right: 2px/);
    expect(result.css).toMatch(/bottom: 3px/);
    expect(result.css).toMatch(/left: 4px/);
});

test('inset: single value duplicates all sides', async () => {
    const input = `.foo { inset: 5px; }`;
    const result = await postcss([logicalToPhysical()]).process(input, { from: undefined });

    expect(result.css).toMatch(/top: 5px/);
    expect(result.css).toMatch(/right: 5px/);
    expect(result.css).toMatch(/bottom: 5px/);
    expect(result.css).toMatch(/left: 5px/);
});

test('transforms border-radius logical shorthands', async () => {
    const input = `.foo { border-start-start-radius: 10px; border-end-end-radius: 20px; }`;
    const result = await postcss([logicalToPhysical()]).process(input, { from: undefined });

    expect(result.css).toMatch(/border-top-left-radius: 10px/);
    expect(result.css).toMatch(/border-bottom-right-radius: 20px/);
});

// --- Warning guard and mapping tests ---
test('does not warn for normal/physical CSS properties', async () => {
    const input = `.foo { margin-left: 10px; color: red; }`;
    const result = await postcss([logicalToPhysical()]).process(input, { from: undefined });

    expect(result.warnings().length).toBe(0);
});

test('warns for unknown logical property', async () => {
    const input = `.foo { totally-unknown-logical: 42px; }`;
    const result = await postcss([logicalToPhysical()]).process(input, { from: undefined });
    const warnings = result.warnings();

    expect(warnings.length).toBeGreaterThan(0);
    expect(warnings[0].text).toMatch(/Unmapped logical property/);
});

test('transforms logical properties to physical properties (RTL)', async () => {
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

test('does not transform already-physical properties', async () => {
    const input = `
        .foo {
            margin-left: 10px;
            padding-top: 5px;
        }
    `;
    const result = await postcss([logicalToPhysical()]).process(input, { from: undefined });

    expect(result.css).toMatch(/margin-left: 10px/);
    expect(result.css).toMatch(/padding-top: 5px/);
    // Should not duplicate or alter physical properties
    expect(result.css.match(/margin-left: 10px/g).length).toBe(1);
    expect(result.css.match(/padding-top: 5px/g).length).toBe(1);
});

test('handles multiple selectors in one rule', async () => {
    const input = `
        .foo, .bar {
            margin-inline-start: 8px;
        }
    `;
    const result = await postcss([logicalToPhysical()]).process(input, { from: undefined });

    expect(result.css).toMatch(/margin-left: 8px/);
});

test('unknown logical property only warns, does not transform', async () => {
    const input = `.foo { logical-unknown: 2px; }`;
    const result = await postcss([logicalToPhysical()]).process(input, { from: undefined });

    expect(result.css).toMatch(/logical-unknown: 2px/);

    const warnings = result.warnings();

    expect(warnings.length).toBeGreaterThan(0);
    expect(warnings[0].text).toMatch(/Unmapped logical property/);
});

test('empty input does not throw or warn', async () => {
    const input = '';
    const result = await postcss([logicalToPhysical()]).process(input, { from: undefined });

    expect(result.css).toBe('');
    expect(result.warnings().length).toBe(0);
});

test('transforms logical properties with !important', async () => {
    const input = `.foo { margin-inline-start: 5px !important; }`;
    const result = await postcss([logicalToPhysical()]).process(input, { from: undefined });

    expect(result.css).toMatch(/margin-left: 5px !important/);
});

test('transforms logical properties inside media queries', async () => {
    const input = `@media (max-width: 600px) {
        .foo {
            padding-inline-end: 3px;
        }
    }`;
    const result = await postcss([logicalToPhysical()]).process(input, { from: undefined });

    expect(result.css).toMatch(/padding-right: 3px/);
});
