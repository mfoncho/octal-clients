import { SetConfigAction } from "../actions/app";
import { SET_CONFIG } from "../actions/types";
import { ConfigRecord } from "../records";

export const state = new ConfigRecord({});

export const reducers = {
    [SET_CONFIG]: (config: ConfigRecord, action: SetConfigAction) => {
        return config.merge(action.payload);
    },
};

export default { state, reducers };
