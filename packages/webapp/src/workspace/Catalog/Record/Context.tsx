import React from "react";
import { useRecordActions } from "../hooks";
import { RecordRecord } from "@colab/store";

const actions = new Proxy(
    {},
    {
        get: () => {
            return () => Promise.reject("@proxy.action");
        },
    }
);

export const Actions = React.createContext(
    actions as ReturnType<typeof useRecordActions>
);
export const Permissions = React.createContext({});

export const Record = React.createContext<RecordRecord>(new RecordRecord({}));

interface IContext {
    record: RecordRecord;
    children?: any;
}

export default React.memo<IContext>(({ record, children }) => {
    const actions = useRecordActions(record);
    return (
        <Record.Provider value={record}>
            <Actions.Provider value={actions}>{children}</Actions.Provider>
        </Record.Provider>
    );
});
