import { Record, Map } from "immutable";
import { SpaceRecord } from "../records";
import * as AppActions from "../actions/app";
import * as Actions from "../actions";

const collections = ["topics", "boards", "members"];

export class SpacesStore extends Record({
    entities: Map<string, SpaceRecord>(),
}) {
    contains(id: string) {
        return this.entities.has(id);
    }

    getSpace(id: string) {
        return this.entities.get(id);
    }

    putSpace(payload: any) {
        let space: any = payload;
        if (!(payload instanceof SpaceRecord)) {
            space = SpaceRecord.make(payload);
        }
        return this.setIn(["entities", space.id], space);
    }

    patchSpace(payload: any) {
        const space = this.getSpace(payload.id);
        if (space) {
            return this.setIn(["entities", space.id], space.patch(payload));
        }
        return this;
    }

    putRole(payload: any) {
        let space = this.getSpace(payload.space_id);
        if (space) {
            space = space.putRole(payload);
            return this.setIn(["entities", space.id], space);
        }
        return this;
    }

    setPermission(payload: any) {
        let space = this.getSpace(payload.space_id);
        if (space) {
            space = space.setPermission(
                payload.role_id,
                payload.permission.name,
                payload.permission.value
            );
            return this.setIn(["entities", space.id], space);
        }
        return this;
    }

    unsetPermission(payload: any) {
        let space = this.getSpace(payload.space_id);
        if (space) {
            space = space.unsetPermission(
                payload.role_id,
                payload.permission.name
            );
            return this.setIn(["entities", space.id], space);
        }
        return this;
    }

    removeRole(payload: any) {
        let space = this.getSpace(payload.space_id);
        if (space) {
            space = space.deleteRole(payload.role_id);
            return this.setIn(["entities", space.id], space);
        }
        return this;
    }

    removeSpace(id: string) {
        return this.deleteIn(["entities", id]);
    }

    patchLabel(payload: any) {
        const space = this.getSpace(payload.space_id);
        if (space) {
            return this.putSpace(space.patchLabel(payload));
        }
        return this;
    }

    putLabel(payload: any) {
        const space = this.getSpace(payload.space_id);
        if (space) {
            return this.putSpace(space.putLabel(payload));
        }
        return this;
    }

    removeLabel(payload: any) {
        const space = this.getSpace(payload.space_id);
        if (space) {
            return this.putSpace(space.removeLabel(payload.id));
        }
        return this;
    }
}

export const state = new SpacesStore({});

export const reducers = {
    [Actions.LOGGED_OUT](_store: any, _action: any) {
        return state;
    },
    [Actions.SPACE_CREATED]: (store: SpacesStore, { payload }: any) => {
        return store.putSpace(payload);
    },
    [Actions.SPACE_LOADED]: (
        store: SpacesStore,
        { payload }: Actions.SpaceLoadedAction
    ) => {
        return store.putSpace(payload);
    },

    [Actions.SPACE_PURGED]: (
        store: SpacesStore,
        { payload }: Actions.SpacePurgedAction
    ) => {
        return store.removeSpace(payload.space_id);
    },

    [Actions.COLLECTION_LOADED]: (
        store: SpacesStore,
        { payload }: AppActions.DataLoadedAction
    ) => {
        const space = store.getSpace(payload.collection);
        if (space && collections.includes(payload.type)) {
            return store.setIn(
                ["entities", payload.collection],
                space.addLoaded(payload.type)
            );
        }
        return store;
    },

    [Actions.SPACES_LOADED]: (
        store: SpacesStore,
        { payload }: Actions.SpacesLoadedAction
    ) => {
        return payload.reduce(
            (store: SpacesStore, payload: any) => store.putSpace(payload),
            store
        );
    },

    [Actions.SPACE_UPDATED]: (
        store: SpacesStore,
        { payload }: Actions.SpaceUpdatedAction
    ) => {
        return store.patchSpace(payload);
    },

    [Actions.SPACE_ROLE_LOADED]: (
        store: SpacesStore,
        { payload }: Actions.SpaceRoleLoadedAction
    ) => {
        return store.putRole(payload);
    },

    [Actions.SPACE_ROLE_CREATED]: (
        store: SpacesStore,
        { payload }: Actions.SpaceRoleCreatedAction
    ) => {
        return store.putRole(payload);
    },

    [Actions.SPACE_PERMISSION_SET]: (
        store: SpacesStore,
        { payload }: Actions.SpacePermissionSetAction
    ) => {
        return store.setPermission(payload);
    },

    [Actions.SPACE_PERMISSION_UNSET]: (
        store: SpacesStore,
        { payload }: Actions.SpacePermissionUnsetAction
    ) => {
        return store.unsetPermission(payload);
    },

    [Actions.SPACE_ROLE_DELETED]: (
        store: SpacesStore,
        { payload }: Actions.SpaceRoleDeletedAction
    ) => {
        return store.removeRole(payload);
    },
    [Actions.SPACE_CONNECTED]: (
        store: SpacesStore,
        { payload }: Actions.SpaceConnectedAction
    ) => {
        let space = store.getSpace(payload.space_id);
        if (space) {
            space = space.setChannel(payload.channel);
            return store.putSpace(space);
        }
        return store;
    },
    [Actions.LABEL_LOADED]: (
        store: SpacesStore,
        { payload }: Actions.LabelLoadedAction
    ) => {
        return store.putLabel(payload);
    },

    [Actions.LABEL_CREATED]: (
        store: SpacesStore,
        { payload }: Actions.LabelCreatedAction
    ) => {
        return store.putLabel(payload);
    },

    [Actions.LABEL_UPDATED]: (
        store: SpacesStore,
        { payload }: Actions.BoardLabelUpdated
    ) => {
        return store.patchLabel(payload);
    },

    [Actions.LABEL_DELETED]: (
        store: SpacesStore,
        { payload }: Actions.LabelDeletedAction
    ) => {
        return store.removeLabel(payload);
    },
};

export default { state, reducers };
