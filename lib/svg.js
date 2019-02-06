import svgo from 'svgo';
import fs from 'fs-extra'
import cleanupIDs from 'svgo/plugins/cleanupIDs';
import removeAttrs from 'svgo/plugins/removeAttrs';
import removeDimensions from 'svgo/plugins/removeDimensions';
import removeViewBox from 'svgo/plugins/removeViewBox';

// Enable removeAttrs plugin
// Remove id attribute to prevent conflict with our id
removeAttrs.active = true;
removeAttrs.params.attrs = 'svg:id';

// Disable removeViewBox plugin and enable removeDimensions
// Keep viewBox and remove width & height attribute
removeViewBox.active= false;
removeDimensions.active = true;

const svgOptimizer = new svgo({
    pluging: [
        removeDimensions,
        cleanupIDs,
        removeAttrs,
        removeViewBox,
    ]
});

export async function writeSVG(path, content) {
    return await fs.writeFile(path, content, { flag: 'w' })
}

export async function readSVG(path) {
    return await fs.readFile(path);
}

export async function optimizeSVG(name, content) {
    cleanupIDs.params.prefix = `${name}-`;
    const $data = await svgOptimizer.optimize(content);
    return $data.data;
}

export function convertToSymbol(name, content) {
    const $data = content
        .replace('<svg', `<symbol id="i-${name}"`)
        .replace('</svg>', '</symbol>');
    
    return $data;
}

export function isSVGFile(file) {
    return file.match(/.*\.svg$/);
}

export function wrap(content) {
    return '<?xml version="1.0" encoding="UTF-8"?>\n'
        +'<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">\n'
        + content
        + '\n</svg>';
}