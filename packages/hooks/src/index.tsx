import { useEffect, useState, useRef, useCallback } from "react";

export function useCurPrev<T, P>(value: T) {
    const [[curr, prev], update] = useState<[T, T | P]>([value, value]);

    useEffect(() => {
        update([value, curr]);
    }, [value]);

    return [curr, prev];
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

export function useDebouncedEffect<
    T extends (...args: any[]) => any,
    S extends readonly unknown[]
>(callback: T, wait: number, watch: S = [] as any) {
    const cb = useDebouncedCallback(callback, wait, watch);

    useEffect(cb, watch);
}
