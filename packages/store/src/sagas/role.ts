import { put, takeEvery } from "redux-saga/effects";
import * as Actions from "../actions/types";
import * as RoleActions from "../actions/role";

import Client from "@octal/client";

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

function* destroy({ payload, resolve }: RoleActions.DeleteSpaceRoleAction): Iterable<any> {
    try {
        const data = (yield Client.deleteSpaceRole(payload)) as any;
        yield put(RoleActions.spaceRoleDeleted(data));
        resolve.success(data);
    } catch (e) {
        resolve.error(e);
    }
}

export const tasks = [
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
