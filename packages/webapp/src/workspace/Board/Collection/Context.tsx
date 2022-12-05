import React from "react";
import { OrderedMap } from "immutable";
import { useCollectionActions } from "../hooks";
import { useCollectionCards } from "../hooks";
import { CollectionRecord, CardRecord } from "@colab/store";

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

export const Cards = React.createContext(OrderedMap<string, CardRecord>());

interface IContext {
    collection: CollectionRecord;
    children?: any;
}

export default React.memo<IContext>(({ collection, children }) => {
    const actions = useCollectionActions(collection);
    const cards = useCollectionCards(collection.id);
    return (
        <Collection.Provider value={collection}>
            <Cards.Provider value={cards}>
                <Actions.Provider value={actions}>{children}</Actions.Provider>
            </Cards.Provider>
        </Collection.Provider>
    );
});
