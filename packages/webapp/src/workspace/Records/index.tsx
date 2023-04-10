import React, { useEffect, useState, useCallback } from "react";
import { List, Map } from "immutable";
import { useRecord, RecordRecord } from "@colab/store";

const defaultMap = Map<string, any>();

export interface IUseRecord<T> {
    id: string;
    set(key: string, record: T): void;
    unset?(record: string): void;
}

export interface IUseRecords<T> {
    records: List<string>;
    setRecords(records: List<T>): void;
}

export const UseRecord = React.memo<IUseRecord<RecordRecord>>((props) => {
    const record = useRecord(props.id);
    useEffect(() => {
        if (record && Boolean(record.id)) {
            props.set(record.id, record);
        } else if (props.unset) {
            props.unset(props.id);
        }
        return () => {
            if (record && props.unset) {
                props.unset(props.id);
            }
        };
    }, [record]);

    return <React.Fragment />;
});

export const UseRecords = React.memo<IUseRecords<RecordRecord>>((props) => {
    const [records, setRecords] =
        useState<Map<string, RecordRecord>>(defaultMap);

    const setRecord = useCallback(
        (id: string, record: RecordRecord) => {
            setRecords((records) => records.set(id, record));
        },
        [records]
    );

    const deleteRecord = useCallback(
        (id: string) => {
            setRecords((records) => records.delete(id));
        },
        [records]
    );

    useEffect(() => {
        props.setRecords(
            props.records.map((id) => records.get(id)!).filter(Boolean)
        );
    }, [records, props.records]);

    return (
        <React.Fragment>
            {props.records.map((id) => (
                <UseRecord
                    key={id}
                    id={id}
                    set={setRecord}
                    unset={deleteRecord}
                />
            ))}
        </React.Fragment>
    );
});
