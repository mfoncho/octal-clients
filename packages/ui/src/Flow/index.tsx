import React from "react";

export interface IDefaultCase {
    children?: React.ReactChildren;
}

type FunctionalCase = (open: boolean) => any;

export interface ICase<T = any> {
    value: T;
    children:
        | React.ReactNode[]
        | React.ReactNode
        | string
        | number
        | FunctionalCase;
}

export interface ISwitch<T = any> {
    value: T;
    unMountTimeout?: number;
    match?: (sval: T, cval: T) => boolean;
    children: React.ReactNode[] | React.ReactNode;
}

function switcher<T = any>(a: T, b: T) {
    return a === b;
}

const SwitchContext = React.createContext({
    value: undefined,
    timeout: 0,
    match: switcher,
});

export function Switch<T = any>({
    value,
    children,
    unMountTimeout = 0,
    match = switcher,
}: ISwitch<T>) {
    return (
        <SwitchContext.Provider
            value={{ value, match, timeout: unMountTimeout } as any}>
            <React.Fragment>{children}</React.Fragment>
        </SwitchContext.Provider>
    );
}

export function Case({ value, children }: ICase) {
    const flow = React.useContext(SwitchContext);

    const active = flow.match(flow.value, value);

    const [mount, setMount] = React.useState(active);

    const timeoutRef = React.useRef<ReturnType<typeof setTimeout>>();

    const state = React.useRef<{ active: boolean; timeout: number }>();

    function cleanup() {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
    }
    // make sure our timeout gets cleared if
    // our consuming component gets unmounted
    React.useEffect(() => cleanup, []);

    React.useEffect(() => {
        if (active) {
            setMount(true);
        } else {
            if (mount == true) {
                if (flow.timeout > 0) {
                    timeoutRef.current = setTimeout(() => {
                        setMount(() => state.current!.active);
                    }, flow.timeout);
                } else {
                    setMount(false);
                }
            }
        }
    }, [active]);

    state.current = { active, timeout: flow.timeout };

    const trickOrTreat = flow.timeout === 0 ? active : mount;

    const node = typeof children === "function" ? children(active) : children;

    if (trickOrTreat) {
        return <React.Fragment>{node}</React.Fragment>;
    } else {
        return null;
    }
}

export default { Switch, Case };
