
function lerp (start, end, step){
    if (Math.abs(end - start) < 0.0001) return end
    return start + (end - start) * step
}
export { lerp }

function wave (time, amplitude, offset, frequency = 1) {
    return Math.sin(time / 1000 * frequency) * amplitude + offset + amplitude
}
export { wave }

function getTranslateValues(element) {
    const style = window.getComputedStyle(element);
    const matrix = new WebKitCSSMatrix(style.transform);

    return {
        translateX: matrix.m41,
        translateY: matrix.m42
    };
}
export { getTranslateValues }

function map(value, inMin, inMax, outMin, outMax) {
    return (value - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
}
export { map }