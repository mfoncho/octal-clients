import type { io } from "@octal/client";
import type { Action, IOAction } from "../../types";
import { createAction, createIOAction } from "../../action";
import { NormalizedRelated } from "../../schemas";
import {
    ROUTE,
    LOGIN,
    COLLECTION_LOADED,
    AUTH,
    RELATED_LOADED,
    SET_SITE,
    LOGOUT,
    SET_CONFIG,
    SET_AUTH,
    LOAD_SITE,
    LOAD_CONFIG,
    STORE_INIT,
    LOAD_AUTH,
    LOAD_WORKSPACE,
    WORKSPACE_UPDATED,
    WORKSPACE_LOADED,
} from "./types";

export * from "./types";

export interface IAuth {
    id: string;
    token: string;
    timestamp: string;
}

export interface ILoginPayload {
    email: string;
    password: string;
    remember_me?: boolean;
}

export interface CollectionLoadedPayload {
    type: string;
    data?: any;
    collection: string;
}

export type CollectionLoadedAction = Action<
    COLLECTION_LOADED,
    CollectionLoadedPayload
>;

export type AuthAction = Action<AUTH, io.Auth | {}>;

export type StoreIntAction = Action<STORE_INIT, {}>;

export type RouteAction = Action<ROUTE, any>;

export type SetAuthAction = Action<SET_AUTH, io.Auth>;

export type RelatedLoadedAction = Action<RELATED_LOADED, NormalizedRelated>;

export type SetSiteAction = Action<SET_SITE, Partial<io.Site>>;

export type SetConfigAction = Action<SET_CONFIG, Partial<io.Config>>;

export type LoadAuthAction = IOAction<LOAD_AUTH, any, io.Auth>;

export type LogoutAction = IOAction<LOGOUT, any, any>;

export type LoginAction = IOAction<LOGIN, ILoginPayload, any>;

export type LoadSiteAction = IOAction<LOAD_SITE, any, io.Site>;

export type LoadConfigAction = IOAction<LOAD_CONFIG, any, io.Config>;

export type WorkspaceUpdatedAction = Action<WORKSPACE_UPDATED, io.Workspace>;

export type PutWorkspaceAction = Action<WORKSPACE_LOADED, io.Workspace>;

export type LoadWorkspaceAction = IOAction<LOAD_WORKSPACE, {}, io.Workspace>;

export function setSite(payload: Partial<io.Site>): SetSiteAction {
    return createAction(SET_SITE, payload);
}

export function authenticate(payload: io.Auth): AuthAction {
    return createAction(AUTH, payload);
}

export function loadAuth(): LoadAuthAction {
    return createIOAction<LOAD_AUTH>(LOAD_AUTH, {});
}

export function loadSite(): LoadSiteAction {
    return createIOAction<LOAD_SITE>(LOAD_SITE, {});
}

export function loadConfig(): LoadConfigAction {
    return createIOAction<LOAD_CONFIG>(LOAD_CONFIG, {});
}

export function setAuth(payload: io.Auth): SetAuthAction {
    return createAction(SET_AUTH, payload);
}

export function login(param: ILoginPayload): LoginAction {
    return createIOAction<LOGIN>(LOGIN, param);
}

export function logout(): LogoutAction {
    return createIOAction<LOGOUT>(LOGOUT, {});
}

export function setConfig(payload: Partial<io.Config>): SetConfigAction {
    return createAction(SET_CONFIG, payload);
}

export function route(route: any): RouteAction {
    return createAction(ROUTE, route);
}

export function relatedLoaded(related: NormalizedRelated): RelatedLoadedAction {
    return createAction(RELATED_LOADED, related);
}

export function collectionLoaded(
    collection: string,
    type: string,
    data?: any
): CollectionLoadedAction {
    return createAction(COLLECTION_LOADED, { collection, type, data });
}

export function workspaceLoaded(workspace: io.Workspace): PutWorkspaceAction {
    return createAction(WORKSPACE_LOADED, workspace);
}

export function workspaceUpdated(
    payload: io.Workspace
): WorkspaceUpdatedAction {
    return createAction(WORKSPACE_UPDATED, payload);
}

export function loadWorkspace(): LoadWorkspaceAction {
    return createIOAction<LOAD_WORKSPACE>(LOAD_WORKSPACE, {});
}
