# CSS Logical Properties Transformer

PrimeVue now includes a build-time transformer that adds physical fallbacks for CSS logical properties (e.g., `margin-inline-start`, `padding-block-end`) by inserting the physical equivalents (e.g., `margin-left`, `padding-bottom`) before the logical properties for legacy browser support.

## How it works

- The transformer is implemented as a custom PostCSS plugin (`scripts/css-logical-to-physical.js`).
- It is integrated into the build pipeline and runs automatically on all component and theme CSS.
- No runtime overhead is added to your application.

## Why?

Logical properties provide better support for internationalization (LTR/RTL), but are not supported in some legacy browsers. This transformer ensures your styles work everywhere.

## Configuration

- By default, the transformer outputs LTR physical properties.
- To customize or disable, edit the PostCSS plugin configuration in your package's `rollup.config.mjs`.

## Examples

### LTR (default)

Input CSS:

```css
.foo {
    margin-inline-start: 10px;
    padding-block-end: 5px;
    float: inline-end;
}
```

Output CSS:

```css
.foo {
    margin-left: 10px;
    padding-bottom: 5px;
    float: right;
    margin-inline-start: 10px;
    padding-block-end: 5px;
    float: inline-end;
}
```

### RTL

Input CSS:

```css
.foo {
    margin-inline-start: 10px;
    float: inline-start;
}
```

Output CSS:

```css
.foo {
    margin-right: 10px;
    float: right;
    margin-inline-start: 10px;
    float: inline-start;
}
```

### Deduplication

Input CSS:

```css
.foo {
    margin-inline-start: 10px;
    margin-left: 10px;
}
```

Output CSS:

```css
.foo {
    margin-inline-start: 10px;
    margin-left: 10px;
}
```

### Custom Mapping

```js
const logicalToPhysical = require('./scripts/css-logical-to-physical');
postcss([logicalToPhysical({ customMap: { 'custom-logical': 'custom-physical' } })]);
```

## Features

- LTR and RTL support (set `direction: 'rtl'` for RTL output)
- Deduplication: avoids duplicate physical properties
- Warns on unmapped logical properties
- Custom mapping extension via plugin options
