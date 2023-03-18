import { Record, Map, List } from "immutable";
import { sort } from "@colab/common";
import * as Actions from "../actions/types";
import { CardRecord } from "../records";

const positionSort = sort("index", "asc");

type Index = "users" | "spaces" | "collections" | "dates";

export class CardsStore extends Record({
    fields: Map<string, string>(),
    loaded: Map<string, List<string>>(),
    dates: Map<string, List<string>>(),
    users: Map<string, List<string>>(),
    spaces: Map<string, List<string>>(),
    collections: Map<string, List<string>>(),
    entities: Map<string, CardRecord>(),
}) {
    static makeCard(payload: any) {
        return Record.isRecord(payload)
            ? (payload as any as CardRecord)
            : CardRecord.make(payload);
    }

    getCard(id: string) {
        return this.entities.get(id);
    }

    contains(id: string) {
        return this.entities.has(id);
    }

    static reindex(
        store: CardsStore,
        index: Index,
        eid: string,
        curr: List<string>,
        prevv?: List<string>
    ) {
        let prev = prevv ?? List<string>();
        // Filter out old index users no longer
        // associated with this card
        prev.forEach((id) => {
            let cids = store.get(index).get(id);
            if (cids && cids.includes(eid)) {
                cids = cids.filter((uid) => uid !== eid);
                store = store.setIn([index, id], cids);
            }
        });

        // Reindex users associated with this
        // card
        curr.forEach((id) => {
            let cids = store.get(index).get(id, List<string>());
            if (!cids.includes(eid)) {
                store = store.setIn([index, id], cids.push(eid));
            }
        });
        return store;
    }

    static indexCardUsers(store: CardsStore, card: CardRecord) {
        const outusers = (store.getCard(card.id) ?? CardRecord.make({})).users
            .filter((id) => !card.users.includes(id))
            .filter(Boolean);
        return CardsStore.reindex(
            store,
            "users",
            card.id,
            card.users,
            outusers
        );
    }

    static indexCardDates(store: CardsStore, card: CardRecord) {
        const outdates = (store.getCard(card.id) ?? CardRecord.make({})).dates
            .filter((id) => !card.dates.includes(id))
            .filter(Boolean);
        return CardsStore.reindex(
            store,
            "dates",
            card.id,
            card.dates,
            outdates
        );
    }

    static indexCardBoard(store: CardsStore, card: CardRecord) {
        let boards = store.spaces.get(card.space_id, List<string>());
        if (!boards.includes(card.id))
            return store.setIn(["boards", card.space_id], boards.push(card.id));
        return store;
    }

    getFieldCard(id: string) {
        let card_id = this.fields.get(id, "xxxx");
        return this.getCard(card_id);
    }

    putCard(payload: any) {
        if (this.contains(payload.id)) {
            return this.patchCard(payload);
        } else {
            const card = CardRecord.make(payload).withIndices();
            return this.withMutations((store) => {
                // index users associated with card
                CardsStore.indexCardUsers(store, card);
                CardsStore.indexCardDates(store, card);
                CardsStore.indexCardBoard(store, card);

                // index fields
                card.fields.forEach((field) => {
                    store.setIn(["fields", field.id], field.card_id);
                });

                // index collection_id
                let collections = store.collections.get(
                    card.collection_id,
                    List<string>()
                );
                if (!collections.includes(card.id)) {
                    let indexed = collections
                        .map((id) => store.getCard(id)!)
                        .filter(Boolean)
                        .sort(positionSort)
                        .insert(card.index, card)
                        .map((card, index) => {
                            card = card.merge({ index: index });
                            store.setIn(["entities", card.id], card);
                            return card.id;
                        });
                    store.setIn(["collections", card.collection_id], indexed);
                } else {
                    // this should never happen but edges are always sharp
                    // and like a knife handle with care
                    store.setIn(["entities", payload.id], card);
                }
            });
        }
    }

    patchCard(payload: any) {
        if (!this.contains(payload.id)) {
            return this;
        } else {
            const card = this.entities.get(payload.id)!;
            const updated = card.patch(payload).withIndices();

            return this.withMutations((store) => {
                const filter = (id: string) => id !== card.id;

                CardsStore.indexCardUsers(store, updated);
                CardsStore.indexCardDates(store, updated);

                if (updated.collection_id !== card.collection_id) {
                    // remove old index collection_id
                    let collections = store.collections.get(
                        card.collection_id,
                        List<string>()
                    );
                    if (collections.includes(card.id)) {
                        // reindex destination collection cards
                        let indexed = collections
                            // filter out current card id from index
                            .filter(filter)
                            .map((id) => store.getCard(id)!)
                            .filter(Boolean)
                            // sort the in collections index
                            .sort(positionSort)
                            // reposition cards and collect id for new index
                            .map((card, index) => {
                                const updates = { index: index };
                                card = card.merge(updates);
                                store.setIn(["entities", card.id], card);
                                return card.id;
                            });
                        store.setIn(
                            ["collections", card.collection_id],
                            indexed
                        );
                    }
                }

                if (
                    card.index !== updated.index ||
                    card.collection_id !== updated.collection_id
                ) {
                    // add new index collection_id
                    let indexed = store.collections
                        .get(updated.collection_id, List<string>())
                        .filter(filter)
                        .map((id) => store.getCard(id)!)
                        .filter(Boolean)
                        .sort(positionSort)
                        .insert(updated.index, updated)
                        .map((card, index) => {
                            const updates = { index: index };
                            card = card.merge(updates);
                            store.setIn(["entities", card.id], card);
                            return card.id;
                        });

                    store.setIn(
                        ["collections", updated.collection_id],
                        indexed
                    );
                } else {
                    // update entry
                    store.setIn(["entities", card.id], updated);
                }
            });
        }
    }

    removeCard(payload: any) {
        if (!this.contains(payload.id)) {
            return this;
        } else {
            const card = this.entities.get(payload.id)!;
            return this.withMutations((store) => {
                const filter = (id: string) => id !== card.id;

                // indexed user_id
                card.users.forEach((id) => {
                    let cids = store.users.get(id);
                    if (cids && cids.includes(card.id)) {
                        cids = cids.filter(filter);
                        store.setIn(["users", id], cids);
                    }
                });

                // indexed fields
                card.fields.forEach((field) => {
                    store.deleteIn(["fields", field.id]);
                });

                // indexed space_id
                let boards = store.spaces.get(card.space_id, List<string>());
                if (boards.includes(card.id))
                    store.setIn(
                        ["boards", card.space_id],
                        boards.filter(filter)
                    );

                // indexed collection_id
                let collections = store.collections
                    .get(card.collection_id, List<string>())
                    .filter(filter)
                    .map((id) => store.getCard(id)!)
                    .filter(Boolean)
                    .map((card, index) => {
                        card = card.merge({ index: index });
                        store.setIn(["entities", card.id], card);
                        return card.id;
                    });
                store.setIn(["collections", card.collection_id], collections);

                // delete entry
                store.deleteIn(["entities", payload.id]);
            });
        }
    }
}

export const state = new CardsStore();

export const reducers = {
    [Actions.LOGGED_OUT](_store: any, _action: any) {
        return state;
    },
    [Actions.CARD_CREATED]: (store: CardsStore, { payload }: any) => {
        return store.putCard(payload);
    },
    [Actions.CARD_LOADED]: (store: CardsStore, { payload }: any) => {
        return store.putCard(payload);
    },
    [Actions.CARDS_LOADED]: (store: CardsStore, { payload }: any) => {
        return payload.reduce(
            (store: CardsStore, card: any) => store.putCard(card),
            store
        );
    },
    [Actions.SPACE_PURGED]: (store: CardsStore, { payload }: any) => {
        let cids = store.spaces.get(payload.id);
        if (cids && !cids.isEmpty()) {
            return cids.reduce((id) => {
                return store.removeCard({ id });
            }, store);
        }
        return store;
    },
    [Actions.COLLECTION_DELETED]: (store: CardsStore, { payload }: any) => {
        let cids = store.collections.get(payload.id);
        if (cids && !cids.isEmpty()) {
            return cids.reduce((id) => {
                return store.removeCard({ id });
            }, store);
        }
        return store;
    },
    [Actions.CARD_DELETED]: (store: CardsStore, { payload }: any) => {
        return store.removeCard(payload);
    },
    [Actions.CARD_UPDATED]: (store: CardsStore, { payload }: any) => {
        return store.patchCard(payload);
    },
    [Actions.CARD_ARCHIVED]: (store: CardsStore, { payload }: any) => {
        return store.patchCard(payload);
    },
    [Actions.CARD_UNARCHIVED]: (store: CardsStore, { payload }: any) => {
        return store.putCard(payload);
    },
    [Actions.CARDS_UPDATED]: (store: CardsStore, { payload }: any) => {
        return payload.reduce(
            (store: CardsStore, card: any) => store.patchCard(card),
            store
        );
    },
    [Actions.CARDS_REORDERED]: (store: CardsStore, { payload }: any) => {
        return payload.reduce(
            (store: CardsStore, card: any) => store.patchCard(card),
            store
        );
    },
    [Actions.CHECKLIST_ASSIGNED]: (store: CardsStore, { payload }: any) => {
        let card = store.getCard(payload.card_id);
        if (card) {
            card = card.assignField(payload.field_id, payload.user_id);
            return store.putCard(card);
        }
        return store;
    },
    [Actions.CHECKLIST_UNASSIGNED]: (store: CardsStore, { payload }: any) => {
        let card = store.getCard(payload.card_id);
        if (card) {
            card = card.unassingField(payload.field_id, payload.user_id);
            return store.putCard(card);
        }
        return store;
    },
    [Actions.CARD_FIELD_CREATED]: (store: CardsStore, { payload }: any) => {
        let card = store.getCard(payload.card_id);
        if (card) {
            card = card.addField(payload);
            return store
                .putCard(card)
                .setIn(["fields", payload.id], payload.card_id);
        }
        return store;
    },
    [Actions.CARD_FIELD_MOVED]: (store: CardsStore, { payload }: any) => {
        let card = store.getCard(payload.card_id);
        if (card) {
            card = card.updateField(payload);
            return store.putCard(card);
        }
        return store;
    },
    [Actions.CARD_FIELD_UPDATED]: (store: CardsStore, { payload }: any) => {
        let card = store.getCard(payload.card_id);
        if (card) {
            card = card.updateField(payload);
            return store.putCard(card);
        }
        return store;
    },
    [Actions.CARD_FIELD_DELETED]: (store: CardsStore, { payload }: any) => {
        let card = store.getCard(payload.card_id);
        if (card) {
            card = card.removeField(payload.id);
            return store.putCard(card).deleteIn(["fields", payload.id]);
        }
        return store;
    },
    [Actions.CARD_FIELD_VALUE_CREATED]: (
        store: CardsStore,
        { payload }: any
    ) => {
        let card = store.getFieldCard(payload.field_id);
        if (card) {
            card = card.addFieldValue(payload);
            return store.putCard(card);
        }
        return store;
    },
    [Actions.CARD_FIELD_VALUE_UPDATED]: (
        store: CardsStore,
        { payload }: any
    ) => {
        let card = store.getFieldCard(payload.field_id);
        if (card) {
            card = card.updateFieldValue(payload);
            return store.putCard(card);
        }
        return store;
    },
    [Actions.CARD_FIELD_VALUE_DELETED]: (
        store: CardsStore,
        { payload }: any
    ) => {
        let card = store.getFieldCard(payload.field_id);
        if (card) {
            card = card.removeFieldValue(payload.field_id, payload.id);
            return store.putCard(card);
        }
        return store;
    },
    [Actions.CARD_MOVED]: (store: CardsStore, { payload }: any) => {
        return store.patchCard(payload);
    },
};

export default { state, reducers };
