import breakpoints from "src/breakpoints";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useEffect, useRef, useState, useCallback } from "react";

export function useScreen() {
    const desktop = useMediaQuery(breakpoints.up("lg"));
    const mobile = useMediaQuery(breakpoints.down("sm"));
    const tablet = useMediaQuery(breakpoints.only("md"));
    return { mobile, tablet, desktop };
}

export function useCurPrev<T, P>(value: T) {
    const [[curr, prev], update] = useState<[T, T | P]>([value, value]);

    useEffect(() => {
        update([value, curr]);
    }, [value]);

    return [curr, prev];
}

export interface ValidationRule {
    max?: number;
    min?: number;
    required?: boolean;
}

export interface Validation<T> {
    name: string;
    rules: ValidationRule[];
    validate: (v: T) => boolean;
}

export interface InputEvent {
    target: {
        value: any;
    };
}

export interface Input<T> {
    value: T;
    valid: boolean;
    setValue: React.Dispatch<React.SetStateAction<T>>;
    onChange: (e: InputEvent) => void;
    props: { value: T; onChange: (e: InputEvent) => void };
}

export function useInput<T>(
    original: T,
    validate?: (v: T) => boolean
): Input<T> {
    const [value, setValue] = useState<T>(original);

    const [tval, setTValue] = useState<T>(original);

    const [valid, setValid] = useState<boolean>(false);

    useEffect(() => {
        if (value && typeof value == "string") {
            setTValue(value.trim() as any);
        } else {
            setTValue(value);
        }
    }, [value]);

    useEffect(() => {
        switch (typeof value) {
            case "string":
                let val = value.trim();
                let orig =
                    typeof original == "string" ? original.trim() : original;

                if (validate) {
                    setValid(validate(value as any));
                } else if (orig === val) {
                    setValid(false);
                } else {
                    setValid(Boolean(val));
                }

                break;

            default:
                setValid(Boolean(value));
        }
    }, [value, original]);

    function onChange(e: InputEvent) {
        if (typeof original == "number") {
            setValue(Number(e.target.value) as any);
        } else {
            setValue(e.target.value);
        }
    }

    return {
        value: tval,
        valid,
        setValue,
        onChange,
        props: { value, onChange },
    };
}

export function useUnmount<T extends readonly unknown[], S>(
    cb: (props: T) => S,
    val: T
) {
    const ref = useRef<{ val: T; fn: (props: T) => S }>();
    const fn = useCallback(cb, val);
    useEffect(() => {
        ref.current = { val, fn };
    }, [fn]);

    useEffect(() => {
        return () => {
            ref!.current!.fn(ref.current!.val);
        };
    }, []);
}

export function useDebounce<T>(value: T, delay: number) {
    // State and setters for debounced value

    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        // Update debounced value after delay
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
}

export function useDebouncedCallback<
    T extends (...args: any[]) => any,
    S extends readonly unknown[]
>(callback: T, wait: number, watch: S = [] as any) {
    // track args & timeout handle between calls
    const argsRef = useRef<any[]>();
    const timeout = useRef<ReturnType<typeof setTimeout>>();

    function cleanup() {
        if (timeout.current) {
            clearTimeout(timeout.current);
        }
    }

    // make sure our timeout gets cleared if
    // our consuming component gets unmounted
    useEffect(() => cleanup, []);

    return useCallback((...args: any[]) => {
        // capture latest args
        argsRef.current = args;

        // clear debounce timer
        cleanup();

        // start waiting again
        timeout.current = setTimeout(() => {
            if (argsRef.current) {
                callback(...argsRef.current);
            }
        }, wait);
    }, watch) as T;
}
