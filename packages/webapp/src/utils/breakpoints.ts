export const values = {
    xs: 0, // phone
    sm: 600, // tablet
    md: 900, // small laptop
    lg: 1200, // desktop
    xl: 1536, // large screen
};

export type Size = keyof typeof values;

export function up(size: Size) {
    return `@media (min-width:${values[size]}px)`;
}

export function down(size: Size) {
    let width = values[size];
    let ubound = Object.values(values).find((val) => val > width);
    if (ubound && ubound > 0) {
        return `@media (max-width:${ubound}px)`;
    } else {
        return `@media (max-width:${values.xl * 1.2}px)`;
    }
}

export function only(size: Size) {
    return `@media ${up(size).replace(/^@media( ?)/m, "")} and ${down(
        size
    ).replace(/^@media( ?)/m, "")}`;
}

export default { values, up, down, only };
