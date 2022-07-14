import { AuthRecord } from "../records";
import * as Actions from "../actions/types";
import * as UserActions from "../actions/user";

const state = AuthRecord.make({});

export const reducers = {
    [Actions.ACCOUNT_CLAIMED](state: AuthRecord, { payload }: any) {
        return state.merge(payload).set("claimed", true);
    },
    [Actions.AUTH_LOADED](_state: AuthRecord, { payload }: any) {
        return AuthRecord.make(payload);
    },

    [Actions.LOGGED_OUT]() {
        return AuthRecord.make({});
    },
    [Actions.USER_ASSIGNED](
        store: AuthRecord,
        { payload }: UserActions.UserAssignedAction
    ) {
        let roles = store.roles.includes(payload.role_id)
            ? store.roles
            : store.roles.push(payload.role_id);
        return store.set("roles", roles);
    },
    [Actions.USER_UNASSIGNED](
        store: AuthRecord,
        { payload }: UserActions.UserUnassignedAction
    ) {
        let roles = store.roles.filter((id) => payload.role_id !== id);
        return store.set("roles", roles);
    },
};

export default { state, reducers };
