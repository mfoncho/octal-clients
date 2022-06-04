import { AuthRecord } from "../records";

const state = AuthRecord.make({});

export const reducers = {
    SET_AUTH(_state: AuthRecord, { payload }: any) {
        return AuthRecord.make(payload);
    },

    LOGOUT() {
        return AuthRecord.make({});
    },
};

export default { state, reducers };
