import type { io, SpaceType, Unique } from "@octal/client";
import type { Action, IOAction } from "../../types";
import { createAction, createIOAction } from "../../action";
import { NormalizedSpace } from "../../schemas";
import {
    SEND_INVITATIONS,
    CLEAR_SPACE,
    CREATE_SPACE,
    SPACE_JOINED,
    JOIN_SPACE,
    LOAD_SPACE,
    LOAD_SPACES,
    SPACE_CREATED,
    SPACE_SHUTDOWN,
    SPACE_RESTORED,
    SHUTDOWN_SPACE,
    UPDATE_SPACE,
    SPACE_LOADED,
    SPACES_LOADED,
    SPACE_UPDATED,
    SPACE_DELETED,
} from "./types";

export * from "./types";

export interface BelongsToSpace {
    space_id: string;
}

export interface SendInvitationsPayload {
    space_id: string;
    emails: string[];
}

export interface CreateSpacePayload {
    icon?: File;
    name: string;
    board?: {
        name: string;
        columns: {
            name: string;
            origin: boolean;
            type: "column" | "stack";
            capacity: number;
        }[];
    };
    type: SpaceType;
    access: "public" | "private";
    topics: { name: string }[];
}

export interface LoadSpacePayload {
    space_id: string;
}

export interface ShutdownSpacePayload {
    space_id: string;
}

export interface RestoreSpacePayload {
    space_id: string;
}

export interface JoinSpacePayload {
    space_id: string;
}

export interface LoadSpacesPayload { }

export interface UpdateSpaceParams {
    name?: string;
    access?: string;
}

export interface UpdateSpacePayload extends Unique {
    space_id: string;
    params: UpdateSpaceParams;
}

export type SpaceUpdatedAction = Action<SPACE_UPDATED, NormalizedSpace>;

export type SpaceDeletedAction = Action<SPACE_DELETED, { id: string }>;

export type SpaceLoadedAction = Action<SPACE_LOADED, NormalizedSpace>;

export type SpacesLoadedAction = Action<SPACES_LOADED, NormalizedSpace[]>;

export type ClearSpaceAction = Action<CLEAR_SPACE, io.Space>;

export type SendInvitationsAction = IOAction<
    SEND_INVITATIONS,
    SendInvitationsPayload,
    any
>;

export type LoadSpacesAction = IOAction<
    LOAD_SPACES,
    LoadSpacesPayload,
    io.Space[]
>;

export type CreateSpaceAction = IOAction<
    CREATE_SPACE,
    CreateSpacePayload,
    io.Space
>;

export type ShutdownSpaceAction = IOAction<
    SHUTDOWN_SPACE,
    ShutdownSpacePayload,
    io.Space
>;

export type UpdateSpaceAction = IOAction<
    UPDATE_SPACE,
    UpdateSpacePayload,
    io.Space
>;

export type LoadSpaceAction = IOAction<LOAD_SPACE, LoadSpacePayload, io.Space>;

export type JoinSpaceAction = IOAction<JOIN_SPACE, JoinSpacePayload, io.Space>;

export type SpaceCreatedAction = Action<SPACE_CREATED, NormalizedSpace>;

export type SpaceJoinedAction = Action<SPACE_JOINED, NormalizedSpace>;

export type SpaceShutdownAction = Action<SPACE_SHUTDOWN, NormalizedSpace>;

export type SpaceRestoredAction = Action<SPACE_RESTORED, NormalizedSpace>;

export function shutdownSpace(
    payload: ShutdownSpacePayload
): ShutdownSpaceAction {
    return createIOAction<SHUTDOWN_SPACE>(SHUTDOWN_SPACE, payload);
}

export function spaceCreated(payload: io.Space): SpaceCreatedAction {
    return createAction(SPACE_CREATED, payload);
}

export function spaceUpdated(payload: NormalizedSpace): SpaceUpdatedAction {
    return createAction(SPACE_UPDATED, payload);
}

export function spaceShutdown(payload: io.Space): SpaceShutdownAction {
    return createAction(SPACE_SHUTDOWN, payload);
}

export function spaceRestored(payload: io.Space): SpaceRestoredAction {
    return createAction(SPACE_RESTORED, payload);
}

export function spaceJoined(payload: io.Space): SpaceJoinedAction {
    return createAction(SPACE_JOINED, payload);
}

export function spaceDeleted(payload: io.Space): SpaceDeletedAction {
    return createAction(SPACE_DELETED, payload);
}

export function loadSpace(payload: LoadSpacePayload): LoadSpaceAction {
    return createIOAction<LOAD_SPACE>(LOAD_SPACE, payload);
}

export function spaceLoaded(space: NormalizedSpace): SpaceLoadedAction {
    return createAction(SPACE_LOADED, space);
}

export function spacesLoaded(spaces: NormalizedSpace[]): SpacesLoadedAction {
    return createAction(SPACES_LOADED, spaces);
}

export function updateSpace(
    id: string,
    params: UpdateSpaceParams
): UpdateSpaceAction {
    return createIOAction<UPDATE_SPACE>(UPDATE_SPACE, { space_id: id, params });
}

export function createSpace(payload: CreateSpacePayload): CreateSpaceAction {
    return createIOAction<CREATE_SPACE>(CREATE_SPACE, payload);
}

export function sendInvitations(
    payload: SendInvitationsPayload
): SendInvitationsAction {
    return createIOAction<SEND_INVITATIONS>(SEND_INVITATIONS, payload);
}

export function joinSpace(payload: JoinSpacePayload): JoinSpaceAction {
    return createIOAction<JOIN_SPACE>(JOIN_SPACE, payload);
}

export function loadSpaces(payload: LoadSpacesPayload): LoadSpacesAction {
    return createIOAction<LOAD_SPACES>(LOAD_SPACES, payload);
}

export function clearSpace(payload: io.Space): ClearSpaceAction {
    return createAction(CLEAR_SPACE, payload);
}
