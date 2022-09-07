import type { io } from "@octal/client";
import type { Action, IOAction } from "../../types";
import { createAction, createIOAction } from "../../action";
import {
    ROLE_LOADED,
    ROLE_ASSIGNED,
    ROLE_UNASSIGNED,
    ROLES_LOADED,
    ROLE_UPDATED,
    ROLE_DELETED,
    CREATE_SPACE_ROLE,
    SPACE_ROLE_DELETED,
    FETCH_SPACE_ROLES,
    SET_SPACE_PERMISSION,
    SPACE_PERMISSION_SET,
    UNSET_SPACE_PERMISSION,
    SPACE_PERMISSION_UNSET,
    DELETE_SPACE_ROLE,
    SPACE_ROLE_CREATED,
    SPACE_ROLE_UPDATED,
    SPACE_ROLE_LOADED,
    SPACE_ROLES_LOADED,
    LOAD_SPACE_ROLES,
    ROLE_PERMISSION_SET,
} from "./types";

export * from "./types";

export interface RoleMemberPayload {
    user_id: string;
    role_id: string;
    left_at?: string;
    joined_at?: string;
}

export interface CreateSpaceRolePayload {
    space_id: string;
    role_id: string;
}

export interface RolePermissionSetPayload {
    role_id: string;
    permission: io.Permission;
}

export interface SpacePermissionSetPayload {
    space_id: string;
    role_id: string;
    permission: io.Permission;
}

export interface SetPermissionPayload {
    space_id: string;
    role_id: string;
    params: {
        permission: string;
        value: string | number | boolean;
    };
}

export interface UnsetSpacePermissionPayload {
    space_id: string;
    role_id: string;
    permission: string;
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

export type SetSpacePermissionAction = IOAction<
    SET_SPACE_PERMISSION,
    SetPermissionPayload,
    io.Permission
>;

export type DeleteSpaceRoleAction = IOAction<
    DELETE_SPACE_ROLE,
    DeleteSpaceRolePayload,
    any
>;

export type UnsetSpacePermissionAction = IOAction<
    UNSET_SPACE_PERMISSION,
    UnsetSpacePermissionPayload,
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

export type RolePermissionSetAction = Action<
    ROLE_PERMISSION_SET,
    RolePermissionSetPayload
>;

export type RoleAssignedAction = Action<ROLE_ASSIGNED, RoleMemberPayload>;

export type RoleUnassignedAction = Action<ROLE_UNASSIGNED, RoleMemberPayload>;

export type RoleUpdatedAction = Action<ROLE_UPDATED, io.Role>;
export type RoleDeletedAction = Action<ROLE_DELETED, { id: string }>;
export type RoleLoadedAction = Action<ROLE_LOADED, io.Role>;
export type RolesLoadedAction = Action<ROLES_LOADED, io.Role[]>;

export type SpacePermissionUnsetAction = Action<
    SPACE_PERMISSION_UNSET,
    UnsetSpacePermissionPayload
>;

export type SpacePermissionSetAction = Action<
    SPACE_PERMISSION_SET,
    SpacePermissionSetPayload
>;

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

export function setSpacePermission(
    payload: SetPermissionPayload
): SetSpacePermissionAction {
    return createIOAction(SET_SPACE_PERMISSION, payload);
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

export function unsetSpacePermission(
    payload: UnsetSpacePermissionPayload
): UnsetSpacePermissionAction {
    return createIOAction<UNSET_SPACE_PERMISSION>(
        UNSET_SPACE_PERMISSION,
        payload
    );
}

export function roleUnassigned(
    payload: RoleMemberPayload
): RoleUnassignedAction {
    return createAction(ROLE_UNASSIGNED, payload);
}

export function roleAssigned(payload: RoleMemberPayload): RoleAssignedAction {
    return createAction(ROLE_ASSIGNED, payload);
}

export function spacePermissionUnset(
    payload: UnsetSpacePermissionPayload
): SpacePermissionUnsetAction {
    return createAction(SPACE_PERMISSION_UNSET, payload);
}

export function spacePermissionSet(
    payload: SpacePermissionSetPayload
): SpacePermissionSetAction {
    return createAction(SPACE_PERMISSION_SET, payload);
}

export function rolePermissionSet(
    payload: RolePermissionSetPayload
): RolePermissionSetAction {
    return createAction(ROLE_PERMISSION_SET, payload);
}
