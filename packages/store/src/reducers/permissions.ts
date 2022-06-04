import { Map } from "immutable";
import { Permissions } from "../records";

const state = Map<string, Permissions>();

export type State = typeof state;

export const reducers = {
    SET_AUTH(_state: State, { payload }: any) {
        return state.withMutations((state) => {
            for (let role of payload.roles) {
                let permissions = role.permissions.reduce(
                    (record: any, perm: any) => {
                        return record.mergeIn([perm.name], perm);
                    },
                    new Permissions()
                );

                state.set(role.id, permissions);
            }
        });
    },

    LOGOUT(_old: State, _action: any) {
        return state;
    },
};

export default { state, reducers };
