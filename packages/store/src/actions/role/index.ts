import type { io } from "@octal/client";
import type { Action, IOAction } from "../../types";
import { createAction, createIOAction } from "../../action";
import {
    ROLE_LOADED,
    ROLES_LOADED,
    ROLE_UPDATED,
    ROLE_DELETED,
    CREATE_SPACE_ROLE,
    SPACE_ROLE_DELETED,
    FETCH_SPACE_ROLES,
    SET_SPACE_PERMISSIONS,
    DELETE_SPACE_ROLE,
    SPACE_ROLE_CREATED,
    SPACE_ROLE_UPDATED,
    SPACE_ROLE_LOADED,
    SPACE_ROLES_LOADED,
    LOAD_SPACE_ROLES,
} from "./types";

export * from "./types";

export interface CreateSpaceRolePayload {
    space_id: string;
    role_id: string;
}

export interface SetPermissionsPayload {
    space_id: string;
    role_id: string;
    params: {
        [key: string]: string | number | boolean | string[] | number[];
    };
}

export interface DeleteSpaceRolePayload {
    space_id: string;
    role_id: string;
}

export interface RemoveSpaceRolePayload {
    id?: string;
    role_id: string;
    space_id: string;
}

export interface FetchSpaceRolesPayload {
    space_id: string;
}

export type CreateSpaceRoleAction = IOAction<
    CREATE_SPACE_ROLE,
    CreateSpaceRolePayload,
    io.SpaceRole
>;

export type SetSpacePermissionsAction = IOAction<
    SET_SPACE_PERMISSIONS,
    SetPermissionsPayload,
    io.SpaceRole
>;

export type DeleteSpaceRoleAction = IOAction<
    DELETE_SPACE_ROLE,
    DeleteSpaceRolePayload,
    any
>;

export type FetchSpaceRolesAction = IOAction<
    FETCH_SPACE_ROLES,
    FetchSpaceRolesPayload,
    io.SpaceRole[]
>;

export type LoadSpaceRolesAction = IOAction<
    LOAD_SPACE_ROLES,
    FetchSpaceRolesPayload,
    io.SpaceRole[]
>;

export type RoleUpdatedAction = Action<ROLE_UPDATED, io.Role>;
export type RoleDeletedAction = Action<ROLE_DELETED, { id: string }>;
export type RoleLoadedAction = Action<ROLE_LOADED, io.Role>;
export type RolesLoadedAction = Action<ROLES_LOADED, io.Role[]>;

export type SpaceRoleCreatedAction = Action<SPACE_ROLE_CREATED, io.SpaceRole>;

export type SpaceRoleUpdatedAction = Action<SPACE_ROLE_UPDATED, io.SpaceRole>;

export type SpaceRoleDeletedAction = Action<SPACE_ROLE_DELETED, io.SpaceRole>;

export type SpaceRoleLoadedAction = Action<SPACE_ROLE_LOADED, io.SpaceRole>;

export type SpaceRolesLoadedAction = Action<SPACE_ROLES_LOADED, io.SpaceRole[]>;

export function fetchSpaceRoles(
    payload: FetchSpaceRolesPayload
): FetchSpaceRolesAction {
    return createIOAction<FETCH_SPACE_ROLES>(FETCH_SPACE_ROLES, payload);
}

export function loadSpaceRoles(
    payload: FetchSpaceRolesPayload
): LoadSpaceRolesAction {
    return createIOAction<LOAD_SPACE_ROLES>(LOAD_SPACE_ROLES, payload);
}

export function createSpaceRole(
    payload: CreateSpaceRolePayload
): CreateSpaceRoleAction {
    return createIOAction<CREATE_SPACE_ROLE>(CREATE_SPACE_ROLE, payload);
}

export function setSpacePermissions(
    payload: SetPermissionsPayload
): SetSpacePermissionsAction {
    return createIOAction(SET_SPACE_PERMISSIONS, payload);
}

export function deleteSpaceRole(
    payload: DeleteSpaceRolePayload
): DeleteSpaceRoleAction {
    return createIOAction<DELETE_SPACE_ROLE>(DELETE_SPACE_ROLE, payload);
}

export function roleLoaded(payload: io.Role): RoleLoadedAction {
    return createAction(ROLE_LOADED, payload);
}

export function rolesLoaded(payload: io.Role[]): RolesLoadedAction {
    return createAction(ROLES_LOADED, payload);
}

export function roleUpated(payload: io.Role): RoleUpdatedAction {
    return createAction(ROLE_UPDATED, payload);
}

export function roleDeleted(payload: io.Role): RoleDeletedAction {
    return createAction(ROLE_DELETED, payload);
}

export function spaceRoleCreated(role: io.SpaceRole): SpaceRoleCreatedAction {
    return createAction(SPACE_ROLE_CREATED, role);
}

export function spaceRoleUpdated(role: io.SpaceRole): SpaceRoleUpdatedAction {
    return createAction(SPACE_ROLE_UPDATED, role);
}

export function spaceRoleDeleted(role: io.SpaceRole): SpaceRoleDeletedAction {
    return createAction(SPACE_ROLE_DELETED, role);
}

export function spaceRoleLoaded(role: io.SpaceRole): SpaceRoleLoadedAction {
    return createAction(SPACE_ROLE_LOADED, role);
}

export function spaceRolesLoaded(
    roles: io.SpaceRole[]
): SpaceRolesLoadedAction {
    return createAction(SPACE_ROLES_LOADED, roles);
}
