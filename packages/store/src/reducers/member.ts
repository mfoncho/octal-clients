import { Map, OrderedMap } from "immutable";
import * as Actions from "../actions/types";
import { MemberRecord } from "../records";
import * as MemberActions from "../actions/member";
import * as SpaceActions from "../actions/space";

export type State = Map<string, OrderedMap<string, MemberRecord>>;

export const state = Map() as State;

function put(state: State, { payload }: MemberActions.PutMemberAction) {
    const path = [payload.space_id, payload.id];
    return state.withMutations((state) => {
        return state.setIn(path, new MemberRecord(payload));
    });
}

function puts(state: State, { payload }: MemberActions.MembersLoadedAction) {
    return state.withMutations((state) => {
        return payload.reduce((state, member) => {
            const path = [member.space_id, member.id];
            return state.setIn(path, new MemberRecord(member));
        }, state);
    });
}

function remove(state: State, { payload }: MemberActions.MemberDeletedAction) {
    return state.deleteIn([payload.space_id, payload.id]);
}

function clear(state: State, { payload }: SpaceActions.SpacePurgedAction) {
    return state.delete(payload.space_id);
}

export const reducers = {
    [Actions.LOGGED_OUT](_store: any, _action: any) {
        return state;
    },
    [Actions.MEMBER_LOADED]: put,

    [Actions.MEMBERS_LOADED]: puts,

    [Actions.MEMBER_DELETED]: remove,
    [Actions.MEMBER_LEFT]: remove,

    [Actions.SPACE_PURGED]: clear,
};

export default { state, reducers };
