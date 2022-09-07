import { AuthRecord } from "../records";
import * as Actions from "../actions/types";
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
};

export default { state, reducers };
