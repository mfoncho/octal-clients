import { Map, OrderedMap } from "immutable";
import { RoleRecord } from "../records";
import * as RoleActions from "../actions/role";
import * as Actions from "../actions/types";
import { SET_AUTH } from "../actions/types";
import { SetAuthAction } from "../actions/app";

type Roles = OrderedMap<string, RoleRecord>;

export type State = Roles;

export const state = Map() as State;

function put(state: State, { payload }: RoleActions.RoleLoadedAction) {
    return state.set(payload.id, new RoleRecord(payload));
}

function putAuthRoles(state: State, { payload }: SetAuthAction) {
    return payload.roles.reduce(
        (state, payload) => put(state, { payload } as any),
        state
    );
}

function puts(state: State, { payload }: RoleActions.RolesLoadedAction) {
    return payload.reduce((state, role) => {
        return state.set(role.id, new RoleRecord(role));
    }, state);
}

function patch(state: State, { payload }: RoleActions.RoleUpdatedAction) {
    return state.mergeIn([payload.id], payload);
}

function remove(state: State, { payload }: RoleActions.RoleDeletedAction) {
    return state.delete(payload.id);
}

export const reducers = {
    [SET_AUTH]: putAuthRoles,
    [Actions.ROLE_LOADED]: put,
    [Actions.ROLES_LOADED]: puts,
    [Actions.ROLE_UPDATED]: patch,
    [Actions.ROLE_DELETED]: remove,
};

export default { state, reducers };
