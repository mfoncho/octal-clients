import { fork } from "redux-saga/effects";
import { IReducerMap, Action, IHandler, Positioned } from "./types";

const INIT = "";

const watch = ({ effect, type, handle }: IHandler) =>
    function* watcher() {
        yield effect(type, handle);
    };

export function positionSort(a: Positioned, b: Positioned) {
    if (a.position < b.position) {
        return -1;
    } else if (a.position > b.position) {
        return 1;
    }

    return 0;
}

export function forkhandles(handles: IHandler[]) {
    const watchers = handles.map(watch);
    return [...watchers].map(fork);
}

export function createReducer<T>(
    handlers: IReducerMap<T>,
    defaultState: T
): (state: T, action: Action) => T {
    type ActionType = keyof typeof handlers;

    const actions: ActionType[] = Object.keys(handlers);

    if (actions.includes(INIT)) {
        return (state: T = defaultState, action: Action): T => {
            if (actions.includes(action.type)) {
                return handlers[action.type](state, action);
            } else {
                return state;
            }
        };
    } else {
        return (state: T = defaultState, action: Action): T => {
            const { type } = action;

            if (type === INIT) {
                return defaultState;
            } else if (actions.includes(type)) {
                return handlers[type](state, action);
            } else {
                return state;
            }
        };
    }
}
