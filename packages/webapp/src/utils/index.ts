import emoji from "@octal/emoji";
import transform from "lodash/transform";
import isObject from "lodash/isObject";
import isEqual from "lodash/isEqual";
export * from "./hooks";
export { default as calendar } from "./calendar";
export { default as markdown } from "./markdown";
export { default as colors, presence } from "./colors";

export function dateFromISOString(date: string) {
    var b = date.split(/\D+/) as any;
    return new Date(Date.UTC(b[0], --b[1], b[2], b[3], b[4], b[5], b[6]));
}

export function keyStingFromDate(date: Date) {
    return `${date.getDate() + 1}-${date.getMonth() + 1}-${date.getFullYear()}`;
}

export function difference(object: object, base: object) {
    function changes(object: object, base: object) {
        return transform(object, function (result: any, value, key) {
            if (!isEqual(value, base[key])) {
                result[key] =
                    isObject(value) && isObject(base[key])
                        ? changes(value, base[key])
                        : value;
            }
        });
    }
    return changes(object, base);
}

export function nameParts(text: string): [string, string] {
    const parts = text.split(" ");
    if (parts.length >= 1 && emoji.test(parts[0])) {
        const [icon, ...rest] = parts;
        return [icon, rest.join(" ")];
    } else {
        return ["", parts.join(" ")];
    }
}

export function sort<T = any>(field: string, order: "asc" | "dec" = "asc") {
    return (a: T, b: T) => {
        const avalue = (a as any)[field];
        const bvalue = (b as any)[field];
        if (order == "asc") {
            if (avalue < bvalue) {
                return -1;
            } else if (avalue > bvalue) {
                return 1;
            }
        } else {
            if (avalue > bvalue) {
                return -1;
            } else if (avalue < bvalue) {
                return 1;
            }
        }

        return 0;
    };
}

export function initial(str: string, value = "p") {
    if (str && str.length > 0) {
        value = str[0];
    }
    return value.toUpperCase();
}

export function initials(str: string, length = 2) {
    let parts = str.split(" ");

    if (parts.length >= length) {
        parts = parts.slice(0, length);
    } else {
        parts = str.split("").slice(0, length);
    }

    return parts.reduce((acc, val) => {
        if (val === " ") {
            return acc;
        } else {
            return acc + initial(val);
        }
    }, "");
}

// Copied from to snippet from ts site implemenation forgot where[link]
export function mixin(derived: any, constructors: any[]) {
    for (let base of constructors) {
        for (let prop of Object.getOwnPropertyNames(base.prototype)) {
            Object.defineProperty(
                derived.prototype,
                prop,
                Object.getOwnPropertyDescriptor(base.prototype, prop) ||
                Object.create(null)
            );
        }
    }
}

export function invariant(cond: any, message: string): asserts cond {
    if (!cond) throw new Error(message);
}
