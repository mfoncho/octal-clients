import React, { useEffect, useState, useCallback } from "react";
import { List, Map } from "immutable";
import { useCard, CardRecord } from "@colab/store";

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

export const UseCard = React.memo<IUseRecord<CardRecord>>((props) => {
    const card = useCard(props.id);
    useEffect(() => {
        if (card && Boolean(card.id)) {
            props.set(card.id, card);
        } else if (props.unset) {
            props.unset(props.id);
        }
        return () => {
            if (card && props.unset) {
                props.unset(props.id);
            }
        };
    }, [card]);

    return <React.Fragment />;
});

export const UseCards = React.memo<IUseRecords<CardRecord>>((props) => {
    const [records, setRecords] = useState<Map<string, CardRecord>>(defaultMap);

    const setRecord = useCallback(
        (id: string, record: CardRecord) => {
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
                <UseCard
                    key={id}
                    id={id}
                    set={setRecord}
                    unset={deleteRecord}
                />
            ))}
        </React.Fragment>
    );
});
