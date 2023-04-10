import type { io, PreferenceValue } from "@colab/client";
import type { Channel } from "@colab/endpoint";
import type { Action, IOAction } from "../../types";
import { createAction, createIOAction } from "../../action";
import {
    LOAD_USER,
    USER_ASSIGNED,
    CLAIM_ACCOUNT,
    ACCOUNT_CLAIMED,
    USER_UNASSIGNED,
    USER_CONNECTED,
    USER_BROADCAST,
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
    PREFERENCE_SET,
    PREFERENCES_LOADED,
    UPDATE_USER_PASSWORD,
    SET_PREFERENCE,
} from "./types";

export * from "./types";

export interface ClaimAccountPayload {
    email: string;
    password: string;
}

export interface SetPreferencePayload {
    preference: string;
    value: PreferenceValue;
}

export interface AssignedPayload {
    user_id: string;
    role_id: string;
}

export interface UserConnectedPayload {
    topic: string;
    user_id: string;
    channel: Channel;
}

export interface UserCatalogcastPayload {
    type: string;
    payload: any;
    metadata?: any;
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
    text: string;
    timeout: number;
}

export interface SetUserStatusPayload {
    user_id: string;
    params: IUserState;
}

export interface StatusUpdatedPayload extends IUserState {
    user_id: string;
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

export type ClaimAccountAction = IOAction<
    CLAIM_ACCOUNT,
    ClaimAccountPayload,
    ClaimAccountPayload
>;

export type LoadUserAction = IOAction<LOAD_USER, { user_id: string }, io.User>;
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

export type SetPreferenceAction = IOAction<
    SET_PREFERENCE,
    SetPreferencePayload,
    io.Preference
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

export type AccountClaimedAction = Action<ACCOUNT_CLAIMED, ClaimAccountPayload>;

export type UserAssignedAction = Action<USER_ASSIGNED, AssignedPayload>;

export type UserUnassignedAction = Action<USER_UNASSIGNED, AssignedPayload>;

export type UserBroadcastAction = Action<USER_BROADCAST, UserCatalogcastPayload>;

export type PreferencesLoadedAction = Action<
    PREFERENCES_LOADED,
    io.Preference[]
>;

export type PresenceLoadedAction = Action<
    PRESENCE_LOADED,
    PresenceLoadedPayload
>;

export type PresenceUpdatedAction = Action<
    PRESENCE_UPDATED,
    PresenceUpdatedPayload
>;

export type PreferenceSetAction = Action<PREFERENCE_SET, io.Preference>;

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

export function loadUser(id: string): LoadUserAction {
    return createIOAction<LOAD_USER>(LOAD_USER, { user_id: id });
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

export function preferencesLoaded(
    payload: io.Preference[]
): PreferencesLoadedAction {
    return createAction(PREFERENCES_LOADED, payload);
}

export function preferenceSet(payload: io.Preference): PreferenceSetAction {
    return createAction(PREFERENCE_SET, payload);
}

export function setPreference(
    preference: string,
    value: PreferenceValue
): SetPreferenceAction {
    return createIOAction<SET_PREFERENCE>(SET_PREFERENCE, {
        preference,
        value,
    });
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

export function userCatalogcast(
    payload: UserCatalogcastPayload
): UserBroadcastAction {
    return createAction(USER_BROADCAST, payload);
}

export function userConnected(
    payload: UserConnectedPayload
): UserConnectedAction {
    return createAction(USER_CONNECTED, payload);
}

export function userAssigned(payload: AssignedPayload): UserAssignedAction {
    return createAction(USER_ASSIGNED, payload);
}

export function userUnassigned(payload: AssignedPayload): UserUnassignedAction {
    return createAction(USER_UNASSIGNED, payload);
}

export function claimAccount(payload: ClaimAccountPayload): ClaimAccountAction {
    return createIOAction<CLAIM_ACCOUNT>(CLAIM_ACCOUNT, payload);
}

export function accountClaimed(
    payload: ClaimAccountPayload
): AccountClaimedAction {
    return createIOAction<ACCOUNT_CLAIMED>(ACCOUNT_CLAIMED, payload);
}
