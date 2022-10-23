import { put, takeEvery } from "redux-saga/effects";
import client, { io } from "@colab/client";
import { dispatch } from "..";
import * as Actions from "../actions/types";
import * as AppActions from "../actions/app";
import * as RoleActions from "../actions/role";
import * as SpaceActions from "../actions/space";

function* fetchSpaceRole({
    payload,
    resolve: meta,
}: RoleActions.FetchSpaceRolesAction): Iterable<any> {
    try {
        const data = (yield client.fetchSpaceRoles(payload)) as any;
        meta.success(data);
    } catch (e) {
        meta.error(e);
    }
}

function* loadRoles(_action: AppActions.AuthAction): Iterable<any> {
    try {
        const roles = (yield client.fetchRoles()) as any;
        yield put(RoleActions.rolesLoaded(roles));
    } catch (e) {}
}

function* loadSpaceRole({
    payload,
    resolve: meta,
}: RoleActions.LoadSpaceRolesAction): Iterable<any> {
    try {
        const roles = (yield yield put(
            RoleActions.fetchSpaceRoles(payload)
        )) as any;
        yield put(RoleActions.spaceRolesLoaded(roles));
        meta.success(roles);
    } catch (e) {
        meta.error(e);
    }
}

function* createSpaceRole({
    payload,
    resolve: meta,
}: RoleActions.CreateSpaceRoleAction): Iterable<any> {
    try {
        const data = (yield client.createSpaceRole(payload)) as any;
        yield put(RoleActions.spaceRoleCreated(data));
        meta.success(data);
    } catch (e) {
        meta.error(e);
    }
}

function* setSpacePermission({
    payload,
    resolve,
}: RoleActions.SetSpacePermissionAction): Iterable<any> {
    try {
        const permission = (yield client.setSpaceRolePermission(
            payload
        )) as any;
        yield put(RoleActions.spacePermissionSet({ ...payload, permission }));
        resolve.success(permission);
    } catch (e) {
        resolve.error(e);
    }
}

function* deleteSpaceRole({
    payload,
    resolve,
}: RoleActions.DeleteSpaceRoleAction): Iterable<any> {
    try {
        const data = (yield client.deleteSpaceRole(payload)) as any;
        yield put(
            RoleActions.spaceRoleDeleted({
                id: payload.role_id,
                space_id: payload.space_id,
            } as any)
        );
        resolve.success(data);
    } catch (e) {
        resolve.error(e);
    }
}

function* unsetSpacePermission({
    payload,
    resolve,
}: RoleActions.UnsetSpacePermissionAction): Iterable<any> {
    try {
        const data = (yield client.deleteSpaceRolePermission(payload)) as any;
        yield put(
            RoleActions.spacePermissionUnset({
                ...payload,
                permission: payload.params,
            })
        );
        resolve.success(data);
    } catch (e) {
        resolve.error(e);
    }
}

function* workspaceConnected({
    payload,
}: AppActions.WorkspaceConnectedAction): Iterable<any> {
    const { channel } = payload;
    channel.on("role.created", (payload: io.Role) => {
        dispatch(RoleActions.roleLoaded(payload));
    });

    channel.on("role.updated", (payload: io.Role) => {
        dispatch(RoleActions.roleUpated(payload));
    });

    channel.on("role.deleted", (payload: io.Role) => {
        dispatch(RoleActions.roleDeleted(payload));
    });

    channel.on("role.assigned", (payload: any) => {
        dispatch(RoleActions.roleAssigned(payload));
    });

    channel.on("role.unassigned", (payload: any) => {
        dispatch(RoleActions.roleUnassigned(payload));
    });

    channel.on(
        "role.permission.set",
        (payload: RoleActions.RolePermissionSetPayload) => {
            dispatch(RoleActions.rolePermissionSet(payload));
        }
    );
}

function* spaceSubscribe({
    payload,
}: SpaceActions.SpaceConnectedAction): Iterable<any> {
    const { channel } = payload;

    channel.on("space.role.created", (payload: io.SpaceRole) => {
        dispatch(RoleActions.spaceRoleCreated(payload));
    });

    channel.on("space.role.deleted", (payload: io.SpaceRole) => {
        dispatch(RoleActions.spaceRoleDeleted(payload));
    });

    channel.on("space.role.permission.set", (payload: any) => {
        dispatch(RoleActions.spacePermissionSet(payload));
    });

    channel.on("space.role.permission.unset", (payload: any) => {
        dispatch(RoleActions.spacePermissionUnset(payload));
    });
}

export const tasks = [
    {
        effect: takeEvery,
        type: Actions.WORKSPACE_CONNECTED,
        handler: workspaceConnected,
    },
    {
        effect: takeEvery,
        type: Actions.AUTH_LOADED,
        handler: loadRoles,
    },
    {
        effect: takeEvery,
        type: Actions.SPACE_CONNECTED,
        handler: spaceSubscribe,
    },
    {
        effect: takeEvery,
        type: Actions.LOAD_SPACE_ROLES,
        handler: loadSpaceRole,
    },
    {
        effect: takeEvery,
        type: Actions.FETCH_SPACE_ROLES,
        handler: fetchSpaceRole,
    },
    {
        effect: takeEvery,
        type: Actions.CREATE_SPACE_ROLE,
        handler: createSpaceRole,
    },
    {
        effect: takeEvery,
        type: Actions.SET_SPACE_PERMISSION,
        handler: setSpacePermission,
    },
    {
        effect: takeEvery,
        type: Actions.UNSET_SPACE_PERMISSION,
        handler: unsetSpacePermission,
    },
    {
        effect: takeEvery,
        type: Actions.DELETE_SPACE_ROLE,
        handler: deleteSpaceRole,
    },
];
