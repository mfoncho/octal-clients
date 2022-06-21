import type { io } from "@octal/client";
import type { Channel } from "@octal/endpoint";
import type { Action, IOAction } from "../../types";
import { createAction, createIOAction } from "../../action";
import { NormalizedRelated } from "../../schemas";
import {
    ROUTE,
    LOGIN,
    AUTH,
    LOGOUT,
    SET_AUTH,
    SET_SITE,
    LOAD_SITE,
    LOAD_AUTH,
    SET_CONFIG,
    STORE_INIT,
    LOAD_CONFIG,
    RELATED_LOADED,
    LOAD_WORKSPACE,
    CREATE_TRACKER,
    DELETE_TRACKER,
    TRACKER_LOADED,
    TRACKERS_LOADED,
    TRACKER_CREATED,
    TRACKER_DELETED,
    COLLECTION_LOADED,
    WORKSPACE_UPDATED,
    WORKSPACE_LOADED,
    WORKSPACE_CONNECTED,
} from "./types";

export * from "./types";

export interface DeleteTrackerPayload {
    id: string;
}

export interface CreateTrackerPayload {
    event: string;
    target: string;
    entity: string;
}

export interface IAuth {
    id: string;
    token: string;
    timestamp: string;
}

export interface WorkspaceConnectedPayload {
    topic: string;
    channel: Channel;
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

export type TrackerCreatedAction = Action<TRACKER_CREATED, io.Tracker>;

export type TrackerLoadedAction = Action<TRACKER_LOADED, io.Tracker>;

export type TrackersLoadedAction = Action<TRACKERS_LOADED, io.Tracker[]>;

export type TrackerDeletedAction = Action<TRACKER_DELETED, { id: string }>;

export type WorkspaceConnectedAction = Action<
    WORKSPACE_CONNECTED,
    WorkspaceConnectedPayload
>;

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

export type WorkspaceLoadedAction = Action<WORKSPACE_LOADED, io.Workspace>;

export type LoadWorkspaceAction = IOAction<LOAD_WORKSPACE, {}, io.Workspace>;

export type CreateTrackerAction = IOAction<
    CREATE_TRACKER,
    CreateTrackerPayload,
    io.Tracker
>;

export type DeleteTrackerAction = IOAction<
    DELETE_TRACKER,
    DeleteTrackerPayload,
    any
>;

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

export function workspaceLoaded(
    workspace: io.Workspace
): WorkspaceLoadedAction {
    return createAction(WORKSPACE_LOADED, workspace);
}

export function workspaceUpdated(
    payload: io.Workspace
): WorkspaceUpdatedAction {
    return createAction(WORKSPACE_UPDATED, payload);
}

export function workspaceConnected(
    channel: Channel,
    topic = "workspace"
): WorkspaceConnectedAction {
    return createAction(WORKSPACE_CONNECTED, { topic, channel });
}

export function loadWorkspace(): LoadWorkspaceAction {
    return createIOAction<LOAD_WORKSPACE>(LOAD_WORKSPACE, {});
}

export function createTracker(
    payload: CreateTrackerPayload
): CreateTrackerAction {
    return createIOAction<CREATE_TRACKER>(CREATE_TRACKER, payload);
}

export function deleteTracker(id: string): DeleteTrackerAction {
    return createIOAction<DELETE_TRACKER>(DELETE_TRACKER, { id });
}

export function trackerDeleted(id: string): TrackerDeletedAction {
    return createAction(TRACKER_DELETED, { id });
}

export function trackerCreated(payload: io.Tracker): TrackerCreatedAction {
    return createAction(TRACKER_CREATED, payload);
}

export function trackerLoaded(payload: io.Tracker): TrackerLoadedAction {
    return createAction(TRACKER_LOADED, payload);
}

export function trackersLoaded(payload: io.Tracker[]): TrackersLoadedAction {
    return createAction(TRACKERS_LOADED, payload);
}
