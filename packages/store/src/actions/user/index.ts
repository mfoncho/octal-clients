import type { io } from "@octal/client";
import type { Channel } from "@octal/endpoint";
import type { Action, IOAction } from "../../types";
import { createAction, createIOAction } from "../../action";
import {
    USER_CONNECTED,
    USER_LOADED,
    USERS_LOADED,
    PRESENCE_LOST,
    SET_USER_STATUS,
    USER_UPDATED,
    USER_STATUS_UPDATED,
    SET_USER_PRESENCE,
    PRESENCE_LOADED,
    PRESENCE_UPDATED,
    UPDATE_USER_PROFILE,
    PREFERENCES_UPDATED,
    UPDATE_USER_PASSWORD,
    UPDATE_PREFERENCES,
} from "./types";

export * from "./types";

export type PreferencesUpdatedPayload = Partial<io.Preferences>;

export type UpdatePreferencesPayload = Partial<io.Preferences>;

export interface UserConnectedPayload {
    topic: string;
    user_id: string;
    channel: Channel;
}

export interface UpdateUserPasswordPayload {
    password: string;
    new_password: string;
}

export interface UpdateUserProfilePayload {
    name?: string;
    about?: string;
    phone?: string;
    avatar?: string;
    username?: string;
}

export interface IUserState {
    icon?: string;
    status: string;
    timeout?: number;
}

export interface SetUserStatusPayload {
    user_id: string;
    params: IUserState;
}

export interface StatusUpdatedPayload {
    id: string;
    state: IUserState;
}

export interface PresenceLoadedPayload {
    user_id: string;
    state: io.PresenceState;
    timestamp: string;
}

export interface PresenceUpdatedPayload {
    user_id: string;
    state?: io.PresenceState;
    timestamp?: string;
}

export interface PresenceLostPayload {
    user_id: string;
}

export interface SetUserPresencePayload {
    presence: io.PresenceState;
}

export type UserStatusUpdatedAction = IOAction<
    USER_STATUS_UPDATED,
    StatusUpdatedPayload,
    io.User
>;

export type SetUserStatusAction = IOAction<
    SET_USER_STATUS,
    SetUserStatusPayload,
    any
>;

export type UpdatePreferencesAction = IOAction<
    UPDATE_PREFERENCES,
    UpdatePreferencesPayload,
    io.Preferences
>;

export type SetUserPresenceAction = IOAction<
    SET_USER_PRESENCE,
    SetUserPresencePayload,
    any
>;

export type UpdateUserPasswordAction = IOAction<
    UPDATE_USER_PASSWORD,
    UpdateUserPasswordPayload,
    any
>;

export type UpdateUserProfileAction = IOAction<
    UPDATE_USER_PROFILE,
    UpdateUserProfilePayload,
    io.User
>;

export type PresenceLoadedAction = Action<
    PRESENCE_LOADED,
    PresenceLoadedPayload
>;

export type PresenceUpdatedAction = Action<
    PRESENCE_UPDATED,
    PresenceUpdatedPayload
>;

export type PreferencesUpdatedAction = Action<
    PREFERENCES_UPDATED,
    PreferencesUpdatedPayload
>;

export type UserConnectedAction = Action<USER_CONNECTED, UserConnectedPayload>;

export type PresenceLostAction = Action<PRESENCE_LOST, PresenceLostPayload>;

export type UserUpdatedAction = Action<USER_UPDATED, io.User>;

export type UserLoadedAction = Action<USER_LOADED, io.User>;

export type UsersLoadedAction = Action<USERS_LOADED, io.User[]>;

export function statusUpdated(
    payload: StatusUpdatedPayload
): UserStatusUpdatedAction {
    return createIOAction<USER_STATUS_UPDATED>(USER_STATUS_UPDATED, payload);
}

export function setPresence(
    payload: SetUserPresencePayload
): SetUserPresenceAction {
    return createIOAction<SET_USER_PRESENCE>(SET_USER_PRESENCE, payload);
}

export function updateProfile(
    payload: UpdateUserProfilePayload
): UpdateUserProfileAction {
    return createIOAction<UPDATE_USER_PROFILE>(UPDATE_USER_PROFILE, payload);
}

export function userLoaded(user: io.User): UserLoadedAction {
    return createAction(USER_LOADED, user);
}

export function usersLoaded(users: io.User[]): UsersLoadedAction {
    return createAction(USERS_LOADED, users);
}

export function presenceLoaded(
    payload: PresenceLoadedPayload
): PresenceLoadedAction {
    return createAction(PRESENCE_LOADED, payload);
}

export function presenceUpdated(
    payload: PresenceUpdatedPayload
): PresenceUpdatedAction {
    return createAction(PRESENCE_UPDATED, payload);
}

export function preferencesUpdated(
    payload: PreferencesUpdatedPayload
): PreferencesUpdatedAction {
    return createAction(PREFERENCES_UPDATED, payload);
}

export function updatePreferences(
    payload: UpdatePreferencesPayload
): UpdatePreferencesAction {
    return createIOAction<UPDATE_PREFERENCES>(UPDATE_PREFERENCES, payload);
}

export function removePresence(
    payload: PresenceLostPayload
): PresenceLostAction {
    return createAction(PRESENCE_LOST, payload);
}

export function updatePassword(
    payload: UpdateUserPasswordPayload
): UpdateUserPasswordAction {
    return createIOAction<UPDATE_USER_PASSWORD>(UPDATE_USER_PASSWORD, payload);
}

export function userUpdated(payload: io.User): UserUpdatedAction {
    return createAction(USER_UPDATED, payload);
}

export function setUserStatus(
    id: string,
    params: IUserState
): SetUserStatusAction {
    return createIOAction<SET_USER_STATUS>(SET_USER_STATUS, {
        user_id: id,
        params,
    });
}

export function userConnected(
    payload: UserConnectedPayload
): UserConnectedAction {
    return createAction(USER_CONNECTED, payload);
}
