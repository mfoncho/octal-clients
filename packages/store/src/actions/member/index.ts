import type { io } from "@colab/client";
import type { Action, IOAction } from "../../types";
import { createAction, createIOAction } from "../../action";
import { NormalizedMember } from "../../schemas";
import {
    JOIN_SPACE,
    LEAVE_SPACE,
    SPACE_JOINED,
    SPACE_LEFT,
    CREATE_MEMBER,
    CLEAR_SPACE_MEMBERS,
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

export interface JoinSpacePayload {
    space_id: string;
}

export interface LeaveSpacePayload {
    space_id: string;
}

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

export type JoinSpaceAction = IOAction<JOIN_SPACE, JoinSpacePayload, io.Member>;

export type LeaveSpaceAction = IOAction<LEAVE_SPACE, LeaveSpacePayload, any>;

export type SpaceJoinedAction = Action<SPACE_JOINED, NormalizedMember>;

export type SpaceLeftAction = Action<SPACE_LEFT, NormalizedMember>;

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

export type ClearSpaceMembersAction = Action<
    CLEAR_SPACE_MEMBERS,
    { id: string }
>;

export type MemberJoinedAction = Action<MEMBER_JOINED, NormalizedMember>;

export type MemberLeftAction = Action<MEMBER_LEFT, NormalizedMember>;

export type MemberDeletedAction = Action<MEMBER_DELETED, MemberDeletedPayload>;

export type PutMemberAction = Action<MEMBER_LOADED, NormalizedMember>;

export type MembersLoadedAction = Action<MEMBERS_LOADED, NormalizedMember[]>;

export function clearSpaceMembers(payload: {
    id: string;
}): ClearSpaceMembersAction {
    return createAction(CLEAR_SPACE_MEMBERS, payload);
}

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

export function joinSpace(payload: JoinSpacePayload): JoinSpaceAction {
    return createIOAction<JOIN_SPACE>(JOIN_SPACE, payload);
}

export function leaveSpace(payload: LeaveSpacePayload): LeaveSpaceAction {
    return createIOAction<LEAVE_SPACE>(LEAVE_SPACE, payload);
}

export function spaceJoined(payload: NormalizedMember): SpaceJoinedAction {
    return createIOAction<SPACE_JOINED>(SPACE_JOINED, payload);
}

export function spaceLeft(payload: NormalizedMember): SpaceLeftAction {
    return createIOAction<SPACE_LEFT>(SPACE_LEFT, payload);
}
