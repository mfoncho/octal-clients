import { AuthRecord } from "../records";

const state = new AuthRecord();

export const reducers = {
    SET_AUTH(state: AuthRecord, { payload }: any) {
        return state.merge(payload);
    },

    LOGOUT() {
        return new AuthRecord();
    },
};

export default { state, reducers };
