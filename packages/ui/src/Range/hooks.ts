import * as React from "react";
import * as ReactDOM from "react-dom";
import { setRef } from "./utils";

const useEnhancedEffect =
    typeof window !== "undefined" ? React.useLayoutEffect : React.useEffect;

/**
 * https://github.com/facebook/react/issues/14099#issuecomment-440013892
 *
 * @param {function} fn
 */
export function useEventCallback(fn: any) {
    const ref = React.useRef(fn);
    useEnhancedEffect(() => {
        ref.current = fn;
    });
    return React.useCallback((...args) => (0 as any, ref.current)(...args), []);
}

export function useForkRef(refA: any, refB: any) {
    /**
     * This will create a new function if the ref props change and are defined.
     * This means react will call the old forkRef with `null` and the new forkRef
     * with the ref. Cleanup naturally emerges from this behavior
     */
    return React.useMemo(() => {
        if (refA == null && refB == null) {
            return null;
        }
        return (refValue: any) => {
            setRef(refA, refValue);
            setRef(refB, refValue);
        };
    }, [refA, refB]);
}

export function useControlled({
    controlled,
    default: defaultProp,
    name,
    state = "value",
}: any) {
    const { current: isControlled } = React.useRef(controlled !== undefined);
    const [valueState, setValue] = React.useState(defaultProp);
    const value = isControlled ? controlled : valueState;

    if (process.env.NODE_ENV !== "production") {
        React.useEffect(() => {
            if (isControlled !== (controlled !== undefined)) {
                console.error(
                    [
                        `Material-UI: A component is changing the ${
                            isControlled ? "" : "un"
                        }controlled ${state} state of ${name} to be ${
                            isControlled ? "un" : ""
                        }controlled.`,
                        "Elements should not switch from uncontrolled to controlled (or vice versa).",
                        `Decide between using a controlled or uncontrolled ${name} ` +
                            "element for the lifetime of the component.",
                        "The nature of the state is determined during the first render, it's considered controlled if the value is not `undefined`.",
                        "More info: https://fb.me/react-controlled-components",
                    ].join("\n")
                );
            }
        }, [controlled]);

        const { current: defaultValue } = React.useRef(defaultProp);

        React.useEffect(() => {
            if (!isControlled && defaultValue !== defaultProp) {
                console.error(
                    [
                        `Material-UI: A component is changing the default ${state} state of an uncontrolled ${name} after being initialized. ` +
                            `To suppress this warning opt to use a controlled ${name}.`,
                    ].join("\n")
                );
            }
        }, [JSON.stringify(defaultProp)]);
    }

    const setValueIfUncontrolled = React.useCallback((newValue) => {
        if (!isControlled) {
            setValue(newValue);
        }
    }, []);

    return [value, setValueIfUncontrolled];
}

let hadKeyboardEvent = true;
let hadFocusVisibleRecently = false;
let hadFocusVisibleRecentlyTimeout: any = null;

const inputTypesWhitelist = {
    text: true,
    search: true,
    url: true,
    tel: true,
    email: true,
    password: true,
    number: true,
    date: true,
    month: true,
    week: true,
    time: true,
    datetime: true,
    "datetime-local": true,
};

/**
 * Computes whether the given element should automatically trigger the
 * `focus-visible` class being added, i.e. whether it should always match
 * `:focus-visible` when focused.
 * @param {Element} node
 * @return {boolean}
 */
function focusTriggersKeyboardModality(node: any) {
    const { type, tagName } = node;

    if (
        tagName === "INPUT" &&
        inputTypesWhitelist[type as keyof typeof inputTypesWhitelist] &&
        !node.readOnly
    ) {
        return true;
    }

    if (tagName === "TEXTAREA" && !node.readOnly) {
        return true;
    }

    if (node.isContentEditable) {
        return true;
    }

    return false;
}

/**
 * Keep track of our keyboard modality state with `hadKeyboardEvent`.
 * If the most recent user interaction was via the keyboard;
 * and the key press did not include a meta, alt/option, or control key;
 * then the modality is keyboard. Otherwise, the modality is not keyboard.
 * @param {KeyboardEvent} event
 */
function handleKeyDown(event: any) {
    if (event.metaKey || event.altKey || event.ctrlKey) {
        return;
    }
    hadKeyboardEvent = true;
}

/**
 * If at any point a user clicks with a pointing device, ensure that we change
 * the modality away from keyboard.
 * This avoids the situation where a user presses a key on an already focused
 * element, and then clicks on a different element, focusing it with a
 * pointing device, while we still think we're in keyboard modality.
 */
function handlePointerDown() {
    hadKeyboardEvent = false;
}

function prepare(doc: any) {
    doc.addEventListener("keydown", handleKeyDown, true);
    doc.addEventListener("mousedown", handlePointerDown, true);
    doc.addEventListener("pointerdown", handlePointerDown, true);
    doc.addEventListener("touchstart", handlePointerDown, true);
}

export function teardown(doc: any) {
    doc.removeEventListener("keydown", handleKeyDown, true);
    doc.removeEventListener("mousedown", handlePointerDown, true);
    doc.removeEventListener("pointerdown", handlePointerDown, true);
    doc.removeEventListener("touchstart", handlePointerDown, true);
}

function isFocusVisible(event: any) {
    const { target } = event;
    try {
        return target.matches(":focus-visible");
    } catch (error) {
        // browsers not implementing :focus-visible will throw a SyntaxError
        // we use our own heuristic for those browsers
        // rethrow might be better if it's not the expected error but do we really
        // want to crash if focus-visible malfunctioned?
    }

    // no need for validFocusTarget check. the user does that by attaching it to
    // focusable events only
    return hadKeyboardEvent || focusTriggersKeyboardModality(target);
}

/**
 * Should be called if a blur event is fired on a focus-visible element
 */
function handleBlurVisible() {
    // To detect a tab/window switch, we look for a blur event followed
    // rapidly by a visibility change.
    // If we don't see a visibility change within 100ms, it's probably a
    // regular focus change.
    hadFocusVisibleRecently = true;
    window.clearTimeout(hadFocusVisibleRecentlyTimeout as any);
    hadFocusVisibleRecentlyTimeout = window.setTimeout(() => {
        hadFocusVisibleRecently = false;
    }, 100);
}

export function useIsFocusVisible() {
    const ref = React.useCallback((instance) => {
        const node = ReactDOM.findDOMNode(instance);
        if (node != null) {
            prepare(node.ownerDocument);
        }
    }, []);

    return { isFocusVisible, onBlurVisible: handleBlurVisible, ref };
}
