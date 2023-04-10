import { Record, Map, List } from "immutable";
import { sort } from "@colab/common";
import * as Actions from "../actions/types";
import { RecordRecord } from "../records";

const positionSort = sort("index", "asc");

type Index = "users" | "catalogs" | "collections" | "dates";

export class RecordsStore extends Record({
    fields: Map<string, string>(),
    loaded: Map<string, List<string>>(),
    dates: Map<string, List<string>>(),
    users: Map<string, List<string>>(),
    catalogs: Map<string, List<string>>(),
    collections: Map<string, List<string>>(),
    entities: Map<string, RecordRecord>(),
}) {
    static makeRecord(payload: any) {
        return Record.isRecord(payload)
            ? (payload as any as RecordRecord)
            : RecordRecord.make(payload);
    }

    getRecord(id: string) {
        return this.entities.get(id);
    }

    contains(id: string) {
        return this.entities.has(id);
    }

    static reindex(
        store: RecordsStore,
        index: Index,
        eid: string,
        curr: List<string>,
        prevv?: List<string>
    ) {
        let prev = prevv ?? List<string>();
        // Filter out old index users no longer
        // associated with this record
        prev.forEach((id) => {
            let cids = store.get(index).get(id);
            if (cids && cids.includes(eid)) {
                cids = cids.filter((uid) => uid !== eid);
                store = store.setIn([index, id], cids);
            }
        });

        // Reindex users associated with this
        // record
        curr.forEach((id) => {
            let cids = store.get(index).get(id, List<string>());
            if (!cids.includes(eid)) {
                store = store.setIn([index, id], cids.push(eid));
            }
        });
        return store;
    }

    static indexRecordUsers(store: RecordsStore, record: RecordRecord) {
        const outusers = (store.getRecord(record.id) ?? RecordRecord.make({})).users
            .filter((id) => !record.users.includes(id))
            .filter(Boolean);
        return RecordsStore.reindex(
            store,
            "users",
            record.id,
            record.users,
            outusers
        );
    }

    static indexRecordDates(store: RecordsStore, record: RecordRecord) {
        const outdates = (store.getRecord(record.id) ?? RecordRecord.make({})).dates
            .filter((id) => !record.dates.includes(id))
            .filter(Boolean);
        return RecordsStore.reindex(
            store,
            "dates",
            record.id,
            record.dates,
            outdates
        );
    }

    static indexRecordCatalog(store: RecordsStore, record: RecordRecord) {
        let catalogs = store.catalogs.get(record.catalog_id, List<string>());
        if (!catalogs.includes(record.id))
            return store.setIn(["catalogs", record.catalog_id], catalogs.push(record.id));
        return store;
    }

    getFieldRecord(id: string) {
        let record_id = this.fields.get(id, "xxxx");
        return this.getRecord(record_id);
    }

    putRecord(payload: any) {
        if (this.contains(payload.id)) {
            return this.patchRecord(payload);
        } else {
            const record = RecordRecord.make(payload).withIndices();
            return this.withMutations((store) => {
                // index users associated with record
                RecordsStore.indexRecordUsers(store, record);
                RecordsStore.indexRecordDates(store, record);
                RecordsStore.indexRecordCatalog(store, record);

                // index fields
                record.fields.forEach((field) => {
                    store.setIn(["fields", field.id], field.record_id);
                });

                // index collection_id
                let collections = store.collections.get(record.collection_id, List<string>());
                if (!collections.includes(record.id)) {
                    let indexed = collections
                        .map((id) => store.getRecord(id)!)
                        .filter(Boolean)
                        .sort(positionSort)
                        .insert(record.index, record)
                        .map((record, index) => {
                            record = record.merge({ index: index });
                            store.setIn(["entities", record.id], record);
                            return record.id;
                        });
                    store.setIn(["collections", record.collection_id], indexed);
                } else {
                    // this should never happen but edges are always sharp
                    // and like a knife handle with care
                    store.setIn(["entities", payload.id], record);
                }
            });
        }
    }

    patchRecord(payload: any) {
        if (!this.contains(payload.id)) {
            return this;
        } else {
            const record = this.entities.get(payload.id)!;
            const updated = record.patch(payload).withIndices();

            return this.withMutations((store) => {
                const filter = (id: string) => id !== record.id;

                RecordsStore.indexRecordUsers(store, updated);
                RecordsStore.indexRecordDates(store, updated);

                if (updated.collection_id !== record.collection_id) {
                    // remove old index collection_id
                    let collections = store.collections.get(
                        record.collection_id,
                        List<string>()
                    );
                    if (collections.includes(record.id)) {
                        // reindex destination collection records
                        let indexed = collections
                            // filter out current record id from index
                            .filter(filter)
                            .map((id) => store.getRecord(id)!)
                            .filter(Boolean)
                            // sort the in collections index
                            .sort(positionSort)
                            // reposition records and collect id for new index
                            .map((record, index) => {
                                const updates = { index: index };
                                record = record.merge(updates);
                                store.setIn(["entities", record.id], record);
                                return record.id;
                            });
                        store.setIn(["collections", record.collection_id], indexed);
                    }
                }

                if (
                    record.index !== updated.index ||
                    record.collection_id !== updated.collection_id
                ) {
                    // add new index collection_id
                    let indexed = store.collections
                        .get(updated.collection_id, List<string>())
                        .filter(filter)
                        .map((id) => store.getRecord(id)!)
                        .filter(Boolean)
                        .sort(positionSort)
                        .insert(updated.index, updated)
                        .map((record, index) => {
                            const updates = { index: index };
                            record = record.merge(updates);
                            store.setIn(["entities", record.id], record);
                            return record.id;
                        });

                    store.setIn(["collections", updated.collection_id], indexed);
                } else {
                    // update entry
                    store.setIn(["entities", record.id], updated);
                }
            });
        }
    }

    removeRecord(payload: any) {
        if (!this.contains(payload.id)) {
            return this;
        } else {
            const record = this.entities.get(payload.id)!;
            return this.withMutations((store) => {
                const filter = (id: string) => id !== record.id;

                // indexed user_id
                record.users.forEach((id) => {
                    let cids = store.users.get(id);
                    if (cids && cids.includes(record.id)) {
                        cids = cids.filter(filter);
                        store.setIn(["users", id], cids);
                    }
                });

                // indexed fields
                record.fields.forEach((field) => {
                    store.deleteIn(["fields", field.id]);
                });

                // indexed catalog_id
                let catalogs = store.catalogs.get(record.catalog_id, List<string>());
                if (catalogs.includes(record.id))
                    store.setIn(
                        ["catalogs", record.catalog_id],
                        catalogs.filter(filter)
                    );

                // indexed collection_id
                let collections = store.collections
                    .get(record.collection_id, List<string>())
                    .filter(filter)
                    .map((id) => store.getRecord(id)!)
                    .filter(Boolean)
                    .map((record, index) => {
                        record = record.merge({ index: index });
                        store.setIn(["entities", record.id], record);
                        return record.id;
                    });
                store.setIn(["collections", record.collection_id], collections);

                // delete entry
                store.deleteIn(["entities", payload.id]);
            });
        }
    }
}

export const state = new RecordsStore();

export const reducers = {
    [Actions.LOGGED_OUT](_store: any, _action: any) {
        return state;
    },
    [Actions.RECORD_CREATED]: (store: RecordsStore, { payload }: any) => {
        return store.putRecord(payload);
    },
    [Actions.RECORD_LOADED]: (store: RecordsStore, { payload }: any) => {
        return store.putRecord(payload);
    },
    [Actions.RECORDS_LOADED]: (store: RecordsStore, { payload }: any) => {
        return payload.reduce(
            (store: RecordsStore, record: any) => store.putRecord(record),
            store
        );
    },
    [Actions.CATALOG_DELETED]: (store: RecordsStore, { payload }: any) => {
        let cids = store.catalogs.get(payload.id);
        if (cids && !cids.isEmpty()) {
            return cids.reduce((id) => {
                return store.removeRecord({ id });
            }, store);
        }
        return store;
    },
    [Actions.COLLECTION_DELETED]: (store: RecordsStore, { payload }: any) => {
        let cids = store.collections.get(payload.id);
        if (cids && !cids.isEmpty()) {
            return cids.reduce((id) => {
                return store.removeRecord({ id });
            }, store);
        }
        return store;
    },
    [Actions.RECORD_DELETED]: (store: RecordsStore, { payload }: any) => {
        return store.removeRecord(payload);
    },
    [Actions.RECORD_UPDATED]: (store: RecordsStore, { payload }: any) => {
        return store.patchRecord(payload);
    },
    [Actions.RECORD_ARCHIVED]: (store: RecordsStore, { payload }: any) => {
        return store.patchRecord(payload);
    },
    [Actions.RECORD_UNARCHIVED]: (store: RecordsStore, { payload }: any) => {
        return store.putRecord(payload);
    },
    [Actions.RECORDS_UPDATED]: (store: RecordsStore, { payload }: any) => {
        return payload.reduce(
            (store: RecordsStore, record: any) => store.patchRecord(record),
            store
        );
    },
    [Actions.RECORDS_REORDERED]: (store: RecordsStore, { payload }: any) => {
        return payload.reduce(
            (store: RecordsStore, record: any) => store.patchRecord(record),
            store
        );
    },
    [Actions.CHECKLIST_ASSIGNED]: (store: RecordsStore, { payload }: any) => {
        let record = store.getRecord(payload.record_id);
        if (record) {
            record = record.assignField(payload.field_id, payload.user_id);
            return store.putRecord(record);
        }
        return store;
    },
    [Actions.CHECKLIST_UNASSIGNED]: (store: RecordsStore, { payload }: any) => {
        let record = store.getRecord(payload.record_id);
        if (record) {
            record = record.unassingField(payload.field_id, payload.user_id);
            return store.putRecord(record);
        }
        return store;
    },
    [Actions.RECORD_FIELD_CREATED]: (store: RecordsStore, { payload }: any) => {
        let record = store.getRecord(payload.record_id);
        if (record) {
            record = record.addField(payload);
            return store
                .putRecord(record)
                .setIn(["fields", payload.id], payload.record_id);
        }
        return store;
    },
    [Actions.RECORD_FIELD_MOVED]: (store: RecordsStore, { payload }: any) => {
        let record = store.getRecord(payload.record_id);
        if (record) {
            record = record.updateField(payload);
            return store.putRecord(record);
        }
        return store;
    },
    [Actions.RECORD_FIELD_UPDATED]: (store: RecordsStore, { payload }: any) => {
        let record = store.getRecord(payload.record_id);
        if (record) {
            record = record.updateField(payload);
            return store.putRecord(record);
        }
        return store;
    },
    [Actions.RECORD_FIELD_DELETED]: (store: RecordsStore, { payload }: any) => {
        let record = store.getRecord(payload.record_id);
        if (record) {
            record = record.removeField(payload.id);
            return store.putRecord(record).deleteIn(["fields", payload.id]);
        }
        return store;
    },
    [Actions.RECORD_FIELD_VALUE_CREATED]: (
        store: RecordsStore,
        { payload }: any
    ) => {
        let record = store.getFieldRecord(payload.field_id);
        if (record) {
            record = record.addFieldValue(payload);
            return store.putRecord(record);
        }
        return store;
    },
    [Actions.RECORD_FIELD_VALUE_UPDATED]: (
        store: RecordsStore,
        { payload }: any
    ) => {
        let record = store.getFieldRecord(payload.field_id);
        if (record) {
            record = record.updateFieldValue(payload);
            return store.putRecord(record);
        }
        return store;
    },
    [Actions.RECORD_FIELD_VALUE_DELETED]: (
        store: RecordsStore,
        { payload }: any
    ) => {
        let record = store.getFieldRecord(payload.field_id);
        if (record) {
            record = record.removeFieldValue(payload.field_id, payload.id);
            return store.putRecord(record);
        }
        return store;
    },
    [Actions.RECORD_MOVED]: (store: RecordsStore, { payload }: any) => {
        return store.patchRecord(payload);
    },
};

export default { state, reducers };
