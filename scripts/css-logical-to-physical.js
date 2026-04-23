// PostCSS plugin to transform CSS logical properties to physical properties for legacy browser support

// Logical-to-physical property mapping for LTR and RTL
const logicalToPhysicalMap = {
    ltr: {
        'margin-inline-start': 'margin-left',
        'margin-inline-end': 'margin-right',
        'margin-block-start': 'margin-top',
        'margin-block-end': 'margin-bottom',
        'padding-inline-start': 'padding-left',
        'padding-inline-end': 'padding-right',
        'padding-block-start': 'padding-top',
        'padding-block-end': 'padding-bottom',
        'border-inline-start': 'border-left',
        'border-inline-end': 'border-right',
        'border-block-start': 'border-top',
        'border-block-end': 'border-bottom',
        'border-inline-start-width': 'border-left-width',
        'border-inline-end-width': 'border-right-width',
        'border-block-start-width': 'border-top-width',
        'border-block-end-width': 'border-bottom-width',
        'border-inline-start-style': 'border-left-style',
        'border-inline-end-style': 'border-right-style',
        'border-block-start-style': 'border-top-style',
        'border-block-end-style': 'border-bottom-style',
        'border-inline-start-color': 'border-left-color',
        'border-inline-end-color': 'border-right-color',
        'border-block-start-color': 'border-top-color',
        'border-block-end-color': 'border-bottom-color',
        'border-start-start-radius': 'border-top-left-radius',
        'border-start-end-radius': 'border-top-right-radius',
        'border-end-start-radius': 'border-bottom-left-radius',
        'border-end-end-radius': 'border-bottom-right-radius',
        'outline-inline-start': 'outline-left',
        'outline-inline-end': 'outline-right',
        'inset-inline-start': 'left',
        'inset-inline-end': 'right',
        'inset-block-start': 'top',
        'inset-block-end': 'bottom'
    },
    rtl: {
        'margin-inline-start': 'margin-right',
        'margin-inline-end': 'margin-left',
        'margin-block-start': 'margin-top',
        'margin-block-end': 'margin-bottom',
        'padding-inline-start': 'padding-right',
        'padding-inline-end': 'padding-left',
        'padding-block-start': 'padding-top',
        'padding-block-end': 'padding-bottom',
        'border-inline-start': 'border-right',
        'border-inline-end': 'border-left',
        'border-block-start': 'border-top',
        'border-block-end': 'border-bottom',
        'border-inline-start-width': 'border-right-width',
        'border-inline-end-width': 'border-left-width',
        'border-block-start-width': 'border-top-width',
        'border-block-end-width': 'border-bottom-width',
        'border-inline-start-style': 'border-right-style',
        'border-inline-end-style': 'border-left-style',
        'border-block-start-style': 'border-top-style',
        'border-block-end-style': 'border-bottom-style',
        'border-inline-start-color': 'border-right-color',
        'border-inline-end-color': 'border-left-color',
        'border-block-start-color': 'border-top-color',
        'border-block-end-color': 'border-bottom-color',
        'border-start-start-radius': 'border-top-right-radius',
        'border-start-end-radius': 'border-top-left-radius',
        'border-end-start-radius': 'border-bottom-right-radius',
        'border-end-end-radius': 'border-bottom-left-radius',
        'outline-inline-start': 'outline-right',
        'outline-inline-end': 'outline-left',
        'inset-inline-start': 'right',
        'inset-inline-end': 'left',
        'inset-block-start': 'top',
        'inset-block-end': 'bottom'
    }
};

// Properties that are logical but require value transformation (e.g., float, clear, text-align)
const logicalValueProps = ['float', 'clear', 'text-align'];
const logicalValueMap = {
    ltr: {
        float: { 'inline-start': 'left', 'inline-end': 'right' },
        clear: { 'inline-start': 'left', 'inline-end': 'right' },
        'text-align': { start: 'left', end: 'right' }
    },
    rtl: {
        float: { 'inline-start': 'right', 'inline-end': 'left' },
        clear: { 'inline-start': 'right', 'inline-end': 'left' },
        'text-align': { start: 'right', end: 'left' }
    }
};

module.exports = (opts = {}) => {
    const direction = opts.direction === 'rtl' ? 'rtl' : 'ltr';
    const customMap = opts.customMap || {};
    const warnUnmapped = opts.warnUnmapped !== false;
    return {
        postcssPlugin: 'css-logical-to-physical',
        Declaration(decl, { result }) {
            // Merge custom mappings
            const map = { ...logicalToPhysicalMap[direction], ...customMap };
            // Property mapping with deduplication
            const physicalProp = map[decl.prop];
            if (physicalProp) {
                // Only add if not already present
                const rule = decl.parent;
                const alreadyExists = rule.some && rule.some((d) => d.prop === physicalProp && d.value === decl.value);
                if (!alreadyExists) {
                    decl.cloneBefore({ prop: physicalProp });
                }
            } else if (warnUnmapped && !logicalValueProps.includes(decl.prop)) {
                result.warn(`Unmapped logical property: ${decl.prop}`, { node: decl });
            }
            // Value mapping
            if (logicalValueProps.includes(decl.prop)) {
                const valueMap = logicalValueMap[direction][decl.prop];
                if (valueMap && valueMap[decl.value]) {
                    // Only add if not already present
                    const rule = decl.parent;
                    const alreadyExists = rule.some && rule.some((d) => d.prop === decl.prop && d.value === valueMap[decl.value]);
                    if (!alreadyExists) {
                        decl.cloneBefore({ value: valueMap[decl.value] });
                    }
                }
            }
        }
    };
};

module.exports.postcss = true;

module.exports = () => {
    return {
        postcssPlugin: 'css-logical-to-physical',
        Declaration(decl) {
            const physicalProp = logicalToPhysicalMap[decl.prop];
            if (physicalProp) {
                decl.cloneBefore({ prop: physicalProp });
            }
        }
    };
};

module.exports.postcss = true;
