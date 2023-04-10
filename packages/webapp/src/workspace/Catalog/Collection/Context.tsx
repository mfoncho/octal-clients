import React from "react";
import { OrderedMap } from "immutable";
import { useCollectionActions } from "../hooks";
import { useCollectionRecords } from "../hooks";
import { CollectionRecord, RecordRecord } from "@colab/store";

const actions = new Proxy(
    {},
    {
        get: () => {
            return () => Promise.reject("@proxy.action");
        },
    }
);

export const Actions = React.createContext(
    actions as ReturnType<typeof useCollectionActions>
);

export const Permissions = React.createContext({});

export const Collection = React.createContext(new CollectionRecord({}));

export const Records = React.createContext(OrderedMap<string, RecordRecord>());

interface IContext {
    collection: CollectionRecord;
    children?: any;
}

export default React.memo<IContext>(({ collection, children }) => {
    const actions = useCollectionActions(collection);
    const records = useCollectionRecords(collection.id);
    return (
        <Collection.Provider value={collection}>
            <Records.Provider value={records}>
                <Actions.Provider value={actions}>{children}</Actions.Provider>
            </Records.Provider>
        </Collection.Provider>
    );
});
