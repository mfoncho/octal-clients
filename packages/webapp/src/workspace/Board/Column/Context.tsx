import React from "react";
import { OrderedMap } from "immutable";
import { useColumnActions } from "../hooks";
import { useColumnCards } from "../hooks";
import { ColumnRecord, CardRecord } from "@colab/store";

const actions = new Proxy(
    {},
    {
        get: () => {
            return () => Promise.reject("@proxy.action");
        },
    }
);

export const Actions = React.createContext(
    actions as ReturnType<typeof useColumnActions>
);

export const Permissions = React.createContext({});

export const Column = React.createContext(new ColumnRecord({}));

export const Cards = React.createContext(OrderedMap<string, CardRecord>());

interface IContext {
    column: ColumnRecord;
    children?: any;
}

export default React.memo<IContext>(({ column, children }) => {
    const actions = useColumnActions(column);
    const cards = useColumnCards(column.id);
    return (
        <Column.Provider value={column}>
            <Cards.Provider value={cards}>
                <Actions.Provider value={actions}>{children}</Actions.Provider>
            </Cards.Provider>
        </Column.Provider>
    );
});
