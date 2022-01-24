import transform from "lodash/transform";
import isObject from "lodash/isObject";
import isEqual from "lodash/isEqual";

export type Diff<T, U> = T extends U ? never : T;

export type Require<T, K extends keyof T> = T &
    Required<{ [P in K]: Diff<T[P], undefined> }>;

export type Optional<T, K extends keyof T> = {
    [P in K]?: Diff<T[P], undefined>;
} & Omit<T, K>;

export interface Thenable<T = any> {
    then<S, E>(
        onFullfill: (data: T) => S,
        onReject?: (reason: any) => E
    ): Promise<S | E>;
}

export type PartialTurtle<T> = {
    [P in keyof T]?: T[P] extends (infer U)[]
        ? PartialTurtle<U>[]
        : T[P] extends object
        ? PartialTurtle<T[P]>
        : T[P];
};

export interface Finalizable<T = any> {
    finally<F = never>(onFullfill: () => F): Promise<T | F>;
}

export interface Catchable<T = any> {
    catch<F = never>(onError: () => F): Promise<T | F>;
}

export interface Promiseable<T = any, E = any>
    extends Thenable<T>,
        Finalizable<T>,
        Catchable<E> {}

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
