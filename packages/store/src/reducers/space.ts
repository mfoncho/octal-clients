import { Record, Map } from "immutable";
import { SpaceRecord } from "../records";
import * as AppActions from "../actions/app";
import * as Actions from "../actions/types";

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
        return this.setIn(["entities", payload.id], SpaceRecord.make(payload));
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

    updateRole(payload: any) {
        let space = this.getSpace(payload.space_id);
        if (space) {
            space = space.patchRole(payload);
            return this.setIn(["entities", space.id], space);
        }
        return this;
    }

    removeRole(payload: any) {
        let space = this.getSpace(payload.space_id);
        if (space) {
            space = space.removeRole(payload.id);
            return this.setIn(["entities", space.id], space);
        }
        return this;
    }

    removeSpace(id: string) {
        return this.deleteIn(["entities", id]);
    }
}

export const state = new SpacesStore({});

export const reducers = {
    [Actions.SPACE_CREATED]: (store: SpacesStore, { payload }: any) => {
        return store.putSpace(payload);
    },
    [Actions.SPACE_LOADED]: (store: SpacesStore, { payload }: any) => {
        return store.putSpace(payload);
    },

    [Actions.COLLECTION_LOADED]: (
        store: SpacesStore,
        { payload }: AppActions.CollectionLoadedAction
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

    [Actions.SPACES_LOADED]: (store: SpacesStore, { payload }: any) => {
        return payload.reduce(
            (store: SpacesStore, payload: any) => store.putSpace(payload),
            store
        );
    },

    [Actions.SPACE_UPDATED]: (store: SpacesStore, { payload }: any) => {
        return store.patchSpace(payload);
    },

    [Actions.SPACE_ROLE_LOADED]: (store: SpacesStore, { payload }: any) => {
        return store.putRole(payload);
    },

    [Actions.SPACE_ROLE_CREATED]: (store: SpacesStore, { payload }: any) => {
        return store.putRole(payload);
    },

    [Actions.SPACE_ROLE_UPDATED]: (store: SpacesStore, { payload }: any) => {
        return store.updateRole(payload);
    },

    [Actions.SPACE_ROLE_DELETED]: (store: SpacesStore, { payload }: any) => {
        return store.removeRole(payload);
    },

    [Actions.SPACE_SHUTDOWN]: (store: SpacesStore, { payload }: any) => {
        return store.removeSpace(payload.id);
    },
};

export default { state, reducers };
