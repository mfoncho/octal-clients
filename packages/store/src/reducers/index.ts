import { Record } from "immutable";
import { Action } from "redux";
import config from "./config";
import role from "./role";
import user from "./user";
import bookmark from "./bookmark";
import board from "./board";
import topics from "./topics";
import auth from "./auth";
import trackers from "./trackers";
import calendar from "./calendar";
import snack from "./snack";
import route from "./route";
import member from "./member";
import thread from "./thread";
import preferences from "./preferences";
import drawer from "./drawer";
import presence from "./presence";
import card from "./card";
import space from "./space";
import column from "./column";
import workspace from "./workspace";

interface IAction extends Action {
    meta?: any;
    payload: any;
}

interface IHandlers<T> {
    [type: string]: (state: T, action: IAction) => T;
}

const INIT = "@@INIT";

const RootStates = {
    config: config.state,
    trackers: trackers.state,
    calendars: calendar.state,
    topics: topics.state,
    roles: role.state,
    auth: auth.state,
    route: route.state,
    bookmarks: bookmark.state,
    users: user.state,
    cards: card.state,
    boards: board.state,
    members: member.state,
    preferences: preferences.state,
    snacks: snack.state,
    presence: presence.state,
    drawers: drawer.state,
    threads: thread.state,
    columns: column.state,
    spaces: space.state,
    workspace: workspace.state,
};

export class RootStateRecord extends Record(RootStates, "root") {}

export const RootState = new RootStateRecord({});

export type RootStateT = typeof RootState;

function createReducer<T>(
    handlers: IHandlers<T>,
    defaultState: T
): (state: T, action: IAction) => T {
    type ActionType = keyof typeof handlers;

    const actions: ActionType[] = Object.keys(handlers);

    if (actions.includes(INIT)) {
        return (state: T = defaultState, action: IAction): T => {
            if (actions.includes(action.type)) {
                return handlers[action.type](state, action);
            } else {
                return state;
            }
        };
    } else {
        return (state: T = defaultState, action: IAction): T => {
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

const reducers = {
    bookmarks: createReducer(bookmark.reducers, bookmark.state),
    config: createReducer(config.reducers, config.state),
    calendars: createReducer(calendar.reducers, calendar.state),
    roles: createReducer(role.reducers, role.state),
    auth: createReducer(auth.reducers, auth.state),
    preferences: createReducer(preferences.reducers, preferences.state),
    route: createReducer(route.reducers, route.state),
    users: createReducer(user.reducers, user.state),
    cards: createReducer(card.reducers, card.state),
    trackers: createReducer(trackers.reducers, trackers.state),
    members: createReducer(member.reducers, member.state),
    boards: createReducer(board.reducers, board.state),
    topics: createReducer(topics.reducers, topics.state),
    presence: createReducer(presence.reducers, presence.state),
    drawers: createReducer(drawer.reducers, drawer.state),
    snacks: createReducer(snack.reducers, snack.state),
    threads: createReducer(thread.reducers, thread.state),
    columns: createReducer(column.reducers, column.state),
    spaces: createReducer(space.reducers, space.state),
    workspace: createReducer(workspace.reducers, workspace.state),
};

export type Store = keyof typeof reducers;

const stores = Object.keys(reducers) as Store[];

function validatePartition(state: RootStateT, value: Store) {
    if (!state.has(value)) {
        throw Error("Unkown store partition " + value);
    }
    if (!(value in reducers)) {
        throw Error("No reducers defined for store partition " + value);
    }
}

export default function rootReducer(state = RootState, action: Action) {
    return state.withMutations((state) => {
        stores.forEach((partition: Store) => {
            validatePartition(state, partition);
            const current = state.get(partition)!;
            const reducer = reducers[partition];
            const next = reducer(current as any, action as IAction);
            state.set(partition, next);
        });
    });
}
