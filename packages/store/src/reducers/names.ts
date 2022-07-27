import { Record, Map, List } from "immutable";
import { NameRecord } from "../records";
import * as AppActions from "../actions/app";
import * as Actions from "../actions/types";

export type NamesState = Map<string, NameRecord>;

export class NamesStore extends Record({
    types: Map<string, List<string>>([]),
    entities: Map<string, NameRecord>(),
}) {
    putName(name: any) {
        let ids = this.types.get(name.type, List<string>());
        if (!ids.includes(name.entity_id)) ids = ids.push(name.entity_id);
        let entities = this.entities.set(name.entity_id, new NameRecord(name));
        return this.setIn(["types", name.type], ids).set("entities", entities);
    }

    updateName(name: any) {
        let entity = this.entities.get(name.entity_id);
        if (entity) {
            return this.setIn(
                ["entities", entity.entity_id],
                entity.merge(name)
            );
        }
        return this;
    }

    removeName(name: any) {
        let entity = this.entities.get(name.entity_id);
        if (entity) {
            let ids = this.types
                .get(entity.type, List<string>())
                .filter((val) => val !== entity!.type);
            let entities = this.entities.delete(entity.entity_id);

            return this.setIn(["types", name.type], ids).set(
                "entities",
                entities
            );
        }
        return this;
    }
}

export const state = new NamesStore();

export const reducers = {
    [Actions.NAMES_LOADED]: (
        store: NamesStore,
        { payload }: AppActions.NamesLoadedAction
    ) => {
        return payload.reduce((acc, name) => {
            return acc.putName(name);
        }, store);
    },
    [Actions.NAME_LOADED]: (
        store: NamesStore,
        { payload }: AppActions.NameLoadedAction
    ) => {
        return store.putName(payload);
    },
    [Actions.NAME_UPDATED]: (
        store: NamesStore,
        { payload }: AppActions.NameUpdatedAction
    ) => {
        return store.updateName(payload);
    },
    [Actions.NAME_DELETED]: (
        store: NamesStore,
        { payload }: AppActions.NameDeletedAction
    ) => {
        return store.removeName(payload);
    },
};

export default { state, reducers };
