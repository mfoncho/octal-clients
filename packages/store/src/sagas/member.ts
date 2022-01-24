import { put, takeEvery } from "redux-saga/effects";
import Client from "@octal/client";
import { State } from "..";
import * as Actions from "../actions/types";
import * as SpaceActions from "../actions/space";
import * as MemberActions from "../actions/member";
import { MemberSchema } from "../schemas";
import { relatedLoaded } from "../actions/app";

function* fetch(action: MemberActions.FetchMembersAction): Iterable<any> {
    try {
        const { payload } = action;
        const data = (yield Client.fetchSpaceMembers(payload.space_id)) as any;
        action.resolve.success(data);
    } catch (e) {
        action.resolve.error(e);
    }
}

function* create({
    payload,
    resolve: meta,
}: MemberActions.CreateMemberAction): Iterable<any> {
    try {
        const data = (yield Client.createSpaceMember(payload)) as any;
        yield put(MemberActions.memberJoined(data));
        meta.success(data);
    } catch (e) {
        meta.error(e);
    }
}

function* destroy({
    payload,
    resolve: meta,
}: MemberActions.DeleteMemberAction): Iterable<any> {
    try {
        const data = (yield Client.deleteSpaceMember(payload)) as any;
        yield put(
            MemberActions.memberDeleted({
                id: payload.member_id,
                space_id: payload.space_id,
            })
        );
        meta.success(data);
    } catch (e) {
        meta.error(e);
    }
}

function* load(action: MemberActions.LoadMembersAction): Iterable<any> {
    try {
        const { payload } = action;
        const members = (yield yield put(
            MemberActions.fetchMembers(payload)
        )) as any;
        const [normalized, related] = MemberSchema.normalizeMany(members);
        yield put(relatedLoaded(related));
        yield put(MemberActions.membersLoaded(normalized));
        action.resolve.success(members);
    } catch (e) {
        action.resolve.error(e);
    }
}

function* clear({ payload }: SpaceActions.SpaceShutdownAction): Iterable<any> {
    yield put(MemberActions.clearSpaceMembers(payload as any));
}

export const tasks = [
    { effect: takeEvery, type: Actions.LOAD_MEMBERS, handler: load },
    { effect: takeEvery, type: Actions.FETCH_MEMBERS, handler: fetch },
    { effect: takeEvery, type: Actions.CREATE_MEMBER, handler: create },
    { effect: takeEvery, type: Actions.DELETE_MEMBER, handler: destroy },
    { effect: takeEvery, type: Actions.SPACE_SHUTDOWN, handler: clear },
];
