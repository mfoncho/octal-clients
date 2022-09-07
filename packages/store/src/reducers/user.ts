import { Record, Map } from "immutable";
import { UserRecord } from "../records";
import * as Actions from "../actions/types";

export type UsersState = Map<string, UserRecord>;

export class UserStore extends Record({
    entities: Map<string, UserRecord>(),
}) {
    getUser(id: string) {
        return this.entities.get(id);
    }
    updateUser(payload: any) {
        let user = this.entities.get(payload.id);
        if (user) {
            return this.setIn(["entities", user.id], user.patch(payload));
        }
        return this;
    }

    updateStatus(payload: any) {
        let user = this.entities.get(payload.user_id);
        if (user) {
            return this.setIn(["entities", user.id], user.patch(payload));
        }
        return this;
    }
    putUser(payload: any) {
        if (this.entities.has(payload.id)) {
            return this.updateUser(payload);
        }
        let user = new UserRecord(payload);
        return this.setIn(["entities", user.id], user.patch(payload));
    }
    removeUser(id: string) {
        return this.deleteIn(["entities", id]);
    }

    assignRole(payload: any) {
        let user = this.entities.get(payload.user_id);
        if (user) {
            return this.setIn(
                ["entities", user.id],
                user.addRole(payload.role_id)
            );
        }
        return this;
    }
    unassignRole(payload: any) {
        let user = this.entities.get(payload.user_id);
        if (user) {
            return this.setIn(
                ["entities", user.id],
                user.removeRole(payload.role_id)
            );
        }
        return this;
    }
}

export const state = new UserStore({});

export const reducers = {
    [Actions.USER_STATUS_UPDATED]: (store: UserStore, { payload }: any) => {
        return store.updateStatus(payload);
    },
    [Actions.USER_LOADED]: (store: UserStore, { payload }: any) => {
        return store.putUser(payload);
    },
    [Actions.ROLE_ASSIGNED]: (store: UserStore, { payload }: any) => {
        return store.assignRole(payload);
    },
    [Actions.ROLE_UNASSIGNED]: (store: UserStore, { payload }: any) => {
        return store.unassignRole(payload);
    },
    [Actions.USERS_LOADED]: (store: UserStore, { payload }: any) => {
        return payload.reduce((store: UserStore, user: any) => {
            return store.putUser(user);
        }, store);
    },
    [Actions.USER_UPDATED]: (store: UserStore, { payload }: any) => {
        return store.updateUser(payload);
    },
};

export default { state, reducers };
