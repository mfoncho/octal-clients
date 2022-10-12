import { useState, useEffect, useMemo } from "react";
import { Map, Record } from "immutable";
import client, { LiveState } from "@colab/client";

interface IHandle<T> {
    version: number;
    apply: (method: string, args?: any) => Promise<void>;
    call: <S>(method: string, args?: any) => Promise<S>;
    state: T;
}

export function useLiveState<T = any>(
    path: string,
    defaultVal: T
): [T, IHandle<T>] {
    const [livestate, setLiveState] =
        useState<LiveState | null | undefined>(null);
    const [[vsn, state], setState] = useState([-1, defaultVal]);
    function updateState(aug: any) {
        if (aug.state) {
            return setState([aug.vsn, aug.state]);
        } else if (Array.isArray(aug.diff)) {
            return setState(([_vsn, state]: any) => {
                let isImmutable = Record.isRecord(state) || Map.isMap(state);
                let newState = aug.diff.reduce(
                    (acc: any, diff: any) => {
                        const [op, path, val] = diff;
                        if (op == 1) {
                            return acc.setIn(path, val);
                        } else if (op == 0) {
                            return acc.deleteIn(path);
                        }
                        return acc;
                    },
                    isImmutable ? state : Map(state as any)
                );

                if (isImmutable) {
                    return [aug.vsn, newState];
                } else {
                    return [aug.vsn, newState.toJS()];
                }
            });
        }
    }
    const handle = useMemo(
        () => ({
            version: vsn,
            async apply(method: string, args?: any) {
                if (livestate) {
                    let aug = (await livestate.apply(method, args)) as any;
                    return updateState(aug);
                }
                return Promise.reject<void>();
            },

            async call<S>(method: string, args?: any) {
                if (livestate) {
                    return (await livestate.call(method, args)) as S;
                }
                Promise.reject<S>();
            },
            get state() {
                if (livestate) return livestate.state<T>();
                return Promise.reject<T>();
            },
        }),
        [livestate]
    );
    useEffect(() => {
        const livestate = client.livestate(path);
        livestate.channel.subscribe().receive("ok", (state: any) => {
            setState([1, state]);
        });
        livestate.channel.on("ok", updateState);
        livestate.channel.on("error", console.log);
        setLiveState(livestate);
        return () => {
            livestate.channel.unsubscribe();
        };
    }, [path]);
    //@ts-ignore
    return [state, handle];
}
