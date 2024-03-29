import type { io } from "@colab/client";
import type { Action, IOAction } from "../../types";
import { createAction, createIOAction } from "../../action";
import { NormalizedMember } from "../../schemas";
import {
    CREATE_MEMBER,
    MEMBER_LEFT,
    FETCH_MEMBERS,
    DELETE_MEMBER,
    MEMBER_JOINED,
    LOAD_MEMBERS,
    MEMBER_LOADED,
    MEMBERS_LOADED,
    MEMBER_DELETED,
} from "./types";

export * from "./types";

export interface CreateMemberPayload {
    space_id: string;
    user_id: string;
    role_id?: string;
}

export interface MemberDeletedPayload {
    id: string;
    space_id: string;
}

export interface DeleteMemberPayload {
    space_id: string;
    member_id: string;
}

export interface FetchMembersPayload {
    space_id: string;
}

export type CreateMemberAction = IOAction<
    CREATE_MEMBER,
    CreateMemberPayload,
    io.Member
>;

export type DeleteMemberAction = IOAction<
    DELETE_MEMBER,
    DeleteMemberPayload,
    any
>;

export type FetchMembersAction = IOAction<
    FETCH_MEMBERS,
    FetchMembersPayload,
    io.Member[]
>;

export type LoadMembersAction = IOAction<
    LOAD_MEMBERS,
    FetchMembersPayload,
    io.Member[]
>;

export type MemberJoinedAction = Action<MEMBER_JOINED, NormalizedMember>;

export type MemberLeftAction = Action<MEMBER_LEFT, NormalizedMember>;

export type MemberDeletedAction = Action<MEMBER_DELETED, MemberDeletedPayload>;

export type PutMemberAction = Action<MEMBER_LOADED, NormalizedMember>;

export type MembersLoadedAction = Action<MEMBERS_LOADED, NormalizedMember[]>;

export function fetchMembers(payload: FetchMembersPayload): FetchMembersAction {
    return createIOAction<FETCH_MEMBERS>(FETCH_MEMBERS, payload);
}

export function loadMembers(payload: FetchMembersPayload): LoadMembersAction {
    return createIOAction<LOAD_MEMBERS>(LOAD_MEMBERS, payload);
}

export function createMember(payload: CreateMemberPayload): CreateMemberAction {
    return createIOAction<CREATE_MEMBER>(CREATE_MEMBER, payload);
}

export function deleteMember(payload: DeleteMemberPayload): DeleteMemberAction {
    return createIOAction<DELETE_MEMBER>(DELETE_MEMBER, payload);
}

export function memberJoined(member: NormalizedMember): MemberJoinedAction {
    return createAction(MEMBER_JOINED, member);
}

export function memberLeft(member: NormalizedMember): MemberLeftAction {
    return createAction(MEMBER_LEFT, member);
}

export function putMember(member: NormalizedMember): PutMemberAction {
    return createAction(MEMBER_LOADED, member);
}

export function membersLoaded(
    members: NormalizedMember[]
): MembersLoadedAction {
    return createAction(MEMBERS_LOADED, members);
}

export function memberDeleted(
    payload: MemberDeletedPayload
): MemberDeletedAction {
    return createAction(MEMBER_DELETED, payload);
}
