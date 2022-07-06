export function repad(value: string, surround: string, padding = " ") {
    let padLeft = 0;
    let padRight = 0;
    if (value.trimStart().length !== value.length) {
        padLeft = value.length - value.trimStart().length;
    }
    if (value.trimEnd().length !== value.length) {
        padRight = value.length - value.trimEnd().length;
    }
    value = `${surround}${value.trim()}${surround}`;
    if (padLeft > 0) {
        value = value.padStart(value.length + padLeft, padding);
    }
    if (padRight > 0) {
        value = value.padEnd(value.length + padRight, padding);
    }
    return value;
}
