import React, { useState, useEffect } from "react";
import { List } from "immutable";
import * as Icons from "@colab/icons";
import RecordCard from "./Record/Record";
import { useRecord, CatalogRecord } from "@colab/store";
import client, { io, Page } from "@colab/client";
import Pagination from "@mui/material/Pagination";
import { useDebouncedEffect } from "@colab/hooks";
import { useNavigator, useInput } from "src/hooks";

interface IRecordsArchive {
    catalog: CatalogRecord;
}

interface IArchivedRecord {
    record: io.Record;
    onClick: () => void;
}

const Record = React.memo<IArchivedRecord>(({ record, onClick }) => {
    const srecord = useRecord(record.id);
    if (srecord && srecord.id === record.id && !srecord.archived) {
        return <div />;
    }
    const labels = record.fields
        .filter((field) => field.type === "label")
        .map((field) => field.values)
        .flat()
        .reduce((acc, value: any) => {
            acc[value.label.id] = value.label;
            return acc;
        }, {} as { [key: string]: any });

    const checklists = record.fields
        .filter((field) => field.type === "checklist")
        .map((field) => field.name);

    const users = record.fields
        .filter((field) => field.type === "user")
        .map((field) => field.values)
        .flat()
        .reduce((acc, value: any) => {
            acc[value.user.id] = value.user;
            return acc;
        }, {} as { [key: string]: any });

    return (
        <div key={record.id} onClick={onClick} role="button">
            <RecordCard
                name={record.name}
                labels={List(Object.values(labels))}
                users={List<string>(Object.values(users))}
                checklists={List(checklists)}
                complete={record.complete}
            />
        </div>
    );
});

const defaultPage: Page<io.Record> = {
    entries: [],
    page_size: 0,
    page_number: 0,
    total_pages: 0,
    total_entries: 0,
};

export default function RecordsArchive({ catalog }: IRecordsArchive) {
    const nav = useNavigator();
    const input = useInput("");
    const [name, setName] = useState(input.value);
    const [page, setPage] = useState<number>(1);
    const [results, setResults] = useState<Page<io.Record>>(defaultPage);
    function fetchPageRecords(page: number, name: string) {
        const params: any = { page };
        if (Boolean(name.trim())) params.name = name.trim();
        client
            .fetchArchivedRecords({ catalog_id: catalog.id }, { params })
            .then(setResults);
    }

    function handleOpenRecord(record: io.Record) {
        nav.openRecord(record);
    }

    useEffect(() => {
        if (catalog.channel) {
            let ref = catalog.channel.on("record.deleted", ({ id }: any) => {
                setResults((results) => ({
                    ...results,
                    entries: results.entries.filter(
                        (record) => record.id !== id
                    ),
                }));
            });
            return () => {
                if (catalog.channel) catalog.channel.off(ref);
            };
        }
    }, []);

    useDebouncedEffect(
        () => {
            setName(input.value);
        },
        700,
        [input.value]
    );

    useEffect(() => {
        if (page !== results.page_number) {
            fetchPageRecords(page, name);
        } else if (page !== 1) {
            setPage(1);
        } else {
            fetchPageRecords(page, name);
        }
    }, [page, name]);

    return (
        <div className="flex-1 flex flex-col overflow-hidden">
            <div className="flex flex-col border-b flex-none border-gray-200 flex-row h-14 sm:h-20 bg-primary-50 px-4 justify-center">
                <div className="relative hidden sm:flex items-center">
                    <input
                        {...input.props}
                        placeholder="Search archive"
                        className="pl-8 bg-white font-semibold outline-none placeholder:text-gray-400 text-gray-700 focus:ring-primary-500 border-gray-400 ring rounded py-1 px-2 focus:shadow"
                    />
                    <div className="px-2 absolute">
                        <Icons.Archive className="text-gray-500" />
                    </div>
                </div>
            </div>
            <div className="flex-1 flex flex-col overflow-x-hidden overflow-y-auto px-1 space-y-2 pb-16">
                {results.entries.map((record: io.Record) => (
                    <div key={record.id} className="flex flex-col p-1">
                        <Record
                            key={record.id}
                            record={record}
                            onClick={() => handleOpenRecord(record)}
                        />
                    </div>
                ))}
            </div>
            <div className="flex flex-row justify-center py-2">
                {results.total_entries > 0 && (
                    <Pagination
                        variant="outlined"
                        page={results.page_number}
                        count={results.total_pages}
                        siblingCount={1}
                        boundaryCount={2}
                        onChange={(_e, page) => setPage(page)}
                    />
                )}
            </div>
        </div>
    );
}
