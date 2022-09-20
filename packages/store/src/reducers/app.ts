import { SetConfigAction } from "../actions/app";
import { SET_CONFIG } from "../actions/types";
import { AppRecord } from "../records";

export const state = new AppRecord({});

export const reducers = {
    [SET_CONFIG]: (config: AppRecord, action: SetConfigAction) => {
        return config.merge(action.payload);
    },
};

export default { state, reducers };
