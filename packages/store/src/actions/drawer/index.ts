import type { Action } from "../../types";
import { createAction } from "../../action";
import { DRAWER_OPENED, DRAWER_CLOSED, DRAWER_TOGGLED } from "./types";

export * from "./types";

export interface IDrawerPayload<T> {
    id: string;
    params: T;
}

export type DrawerOpenedAction<T> = Action<DRAWER_OPENED, IDrawerPayload<T>>;

export type DrawerClosedAction<T> = Action<DRAWER_CLOSED, IDrawerPayload<T>>;

export type DrawerToggledAction<T> = Action<DRAWER_TOGGLED, IDrawerPayload<T>>;

export function openDrawer<T>(id: string, params: T): DrawerOpenedAction<T> {
    return createAction(DRAWER_OPENED, { id, params });
}

export function closeDrawer<T>(id: string, params: T): DrawerClosedAction<T> {
    return createAction(DRAWER_CLOSED, { id, params });
}

export function toggleDrawer<T>(id: string, params: T): DrawerToggledAction<T> {
    return createAction(DRAWER_TOGGLED, { id, params });
}
