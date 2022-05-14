import { put, takeEvery } from "redux-saga/effects";
import Client, { io } from "@octal/client";
import { dispatch } from "..";
import * as Actions from "../actions/types";
import * as SpaceActions from "../actions/space";
import * as RoleActions from "../actions/role";

function* fetch({
    payload,
    resolve: meta,
}: RoleActions.FetchSpaceRolesAction): Iterable<any> {
    try {
        const data = (yield Client.fetchSpaceRoles(payload)) as any;
        meta.success(data);
    } catch (e) {
        meta.error(e);
    }
}

function* load({
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

function* create({
    payload,
    resolve: meta,
}: RoleActions.CreateSpaceRoleAction): Iterable<any> {
    try {
        const data = (yield Client.createSpaceRole(payload)) as any;
        yield put(RoleActions.spaceRoleCreated(data));
        meta.success(data);
    } catch (e) {
        meta.error(e);
    }
}

function* update({
    payload,
    resolve,
}: RoleActions.SetSpacePermissionsAction): Iterable<any> {
    try {
        const data = (yield Client.updateSpaceRolePermissions(payload)) as any;
        yield put(RoleActions.spaceRoleUpdated(data));
        resolve.success(data);
    } catch (e) {
        resolve.error(e);
    }
}

function* destroy({
    payload,
    resolve,
}: RoleActions.DeleteSpaceRoleAction): Iterable<any> {
    try {
        const data = (yield Client.deleteSpaceRole(payload)) as any;
        yield put(RoleActions.spaceRoleDeleted(data));
        resolve.success(data);
    } catch (e) {
        resolve.error(e);
    }
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

    channel.on("space.role.permissions.updated", (payload: io.SpaceRole) => {
        dispatch(RoleActions.spaceRoleUpdated(payload));
    });
}

export const tasks = [
    {
        effect: takeEvery,
        type: Actions.SPACE_CONNECTED,
        handler: spaceSubscribe,
    },
    { effect: takeEvery, type: Actions.LOAD_SPACE_ROLES, handler: load },
    { effect: takeEvery, type: Actions.FETCH_SPACE_ROLES, handler: fetch },
    { effect: takeEvery, type: Actions.CREATE_SPACE_ROLE, handler: create },
    {
        effect: takeEvery,
        type: Actions.SET_SPACE_PERMISSIONS,
        handler: update,
    },
    { effect: takeEvery, type: Actions.DELETE_SPACE_ROLE, handler: destroy },
];
