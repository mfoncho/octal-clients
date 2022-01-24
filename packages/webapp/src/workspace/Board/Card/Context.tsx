import React from "react";
import { useCardActions } from "../hooks";
import { CardRecord } from "@octal/store";

const actions = new Proxy(
    {},
    {
        get: () => {
            return () => Promise.reject("@proxy.action");
        },
    }
);

export const Actions = React.createContext(
    actions as ReturnType<typeof useCardActions>
);
export const Permissions = React.createContext({});

export const Card = React.createContext<CardRecord>(new CardRecord({}));

interface IContext {
    card: CardRecord;
    children?: any;
}

export default React.memo<IContext>(({ card, children }) => {
    const actions = useCardActions(card);
    return (
        <Card.Provider value={card}>
            <Actions.Provider value={actions}>{children}</Actions.Provider>
        </Card.Provider>
    );
});
