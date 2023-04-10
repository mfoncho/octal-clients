import React, { useState, useEffect } from "react";
import * as Icons from "@colab/icons";
import { useDispatch } from "react-redux";
import { Dialog, Text } from "@colab/ui";
import { Promiseable } from "src/types";
import { useInput } from "src/utils";
import Layout from "./Layout";
import { SpaceManagerFilterParams } from ".";
import client, { io } from "@colab/client";
import { Actions } from "@colab/store";

interface ITopic {
    catalog: io.Catalog;
    onDelete: (id: string) => Promiseable;
    onArchive: (id: string) => Promiseable;
    onUnarchive: (id: string) => Promiseable;
}

interface IWarning {
    onConfirm: (e: React.MouseEvent) => void;
    title: string;
    confirm: string;
    loading: boolean;
    children: React.ReactNode;
}

function deleteWarningText(catalog: any) {
    return `If you delete __${catalog.name}__, all mesages, and related data in the topic will be lost permantly. 

###### Are you sure you wish to do this?`;
}

const WarningDialog = Dialog.create<IWarning>((props) => {
    return (
        <Dialog.Warning
            open={props.open}
            title={props.title}
            confirm={props.confirm}
            onClose={props.onClose}
            disabled={props.loading}
            onConfirm={props.onConfirm}>
            {props.children}
        </Dialog.Warning>
    );
});

function Row({ catalog, onDelete, onArchive, onUnarchive }: ITopic) {
    const [loading, setLoading] = useState(false);

    const dialog = Dialog.useDialog("");

    function handleDelete() {
        setLoading(true);
        onDelete(catalog.id).catch(() => setLoading(false));
    }

    function handleArchiveCatalog() {
        setLoading(true);
        onArchive(catalog.id).finally(() => setLoading(false));
    }

    function handleUnarchiveCatalog() {
        setLoading(true);
        onUnarchive(catalog.id).finally(() => setLoading(false));
    }

    function renderActions() {
        if (catalog.is_archived) {
            return (
                <div className="flex flex-row space-x-2 items-center">
                    <button
                        onClick={dialog.opener("destroy")}
                        className="text-gray-500 rounded-md border border-slate-200 p-1 hover:bg-slate-300 flex items-center justify-center">
                        <Icons.Delete className="h-5 w-5" />
                    </button>
                    <button
                        onClick={handleUnarchiveCatalog}
                        className="text-gray-500 rounded-md border border-slate-200 p-1 hover:bg-slate-300 flex items-center justify-center">
                        <Icons.Unarchive className="h-5 w-5" />
                    </button>
                </div>
            );
        }
        return (
            <button
                onClick={handleArchiveCatalog}
                className="text-gray-500 rounded-md border border-slate-200 p-1 hover:bg-slate-300 flex items-center justify-center">
                <Icons.Archive className="h-5 w-5" />
            </button>
        );
    }
    return (
        <div className="flex group px-4 py-3 hover:bg-slate-100 flex-row p-2 items-center justify-between">
            <div className="flex flex-row items-center">
                <div className="mx-2">
                    <Icons.Board className="w-6 h-6 text-gray-500" />
                </div>
                <span className="flex text-base font-semibold text-gray-700 flex-row items-center">
                    <Text>{catalog.name}</Text>
                </span>
            </div>
            <div className="invisible group-hover:visible flex flex-row items-center justify-end">
                {renderActions()}
            </div>
            <WarningDialog
                loading={loading}
                title="Delete Catalog"
                confirm="Delete"
                onConfirm={handleDelete}
                open={dialog.destroy}
                onClose={dialog.close}>
                {deleteWarningText(catalog)}
            </WarningDialog>
        </div>
    );
}

const Manager = React.memo(({ space }: SpaceManagerFilterParams) => {
    const dispatch = useDispatch();

    const search = useInput("");

    const [catalogs, setCatalogs] = useState<io.Catalog[]>([]);

    useEffect(() => {
        client.fetchCatalogs(space.id).then(setCatalogs);
    }, []);

    function handleDeleteCatalog(id: string) {
        const action = Actions.Catalog.deleteCatalog({
            catalog_id: id,
            space_id: space.id,
        });
        return dispatch(action).then(() => {
            setCatalogs((catalogs) =>
                catalogs.filter((catalog) => catalog.id !== id)
            );
        });
    }

    function handleArchiveCatalog(id: string) {
        const action = Actions.Catalog.archiveCatalog({
            catalog_id: id,
            space_id: space.id,
        });
        return dispatch(action).then((catalog) => {
            setCatalogs((catalogs) =>
                catalogs.map((scatalog) =>
                    scatalog.id == catalog.id ? catalog : scatalog
                )
            );
        });
    }

    function handleUnarchiveCatalog(id: string) {
        const action = Actions.Catalog.unarchiveCatalog({
            catalog_id: id,
            space_id: space.id,
        });
        return dispatch(action).then((catalog) => {
            setCatalogs((catalogs) =>
                catalogs.map((scatalog) =>
                    scatalog.id == catalog.id ? catalog : scatalog
                )
            );
        });
    }

    function renderCatalog(catalog: io.Catalog) {
        return (
            <Row
                key={catalog.id}
                catalog={catalog}
                onDelete={handleDeleteCatalog}
                onArchive={handleArchiveCatalog}
                onUnarchive={handleUnarchiveCatalog}
            />
        );
    }

    return (
        <Layout title="Catalogs" className="flex flex-col">
            <div className="flex flex-row pb-4 justify-end">
                <div className="relative flex flex-row item-center">
                    <input
                        className="form-input font-semibold rounded-md text-sm text-gray-800 pl-10 pr-4 border shadow-sm border-gray-300"
                        {...search.props}
                    />
                    <div className="absolute px-2 h-full flex flex-col justify-center">
                        <Icons.Filter className="text-gray-500 w-5 h-5" />
                    </div>
                </div>
            </div>
            <div className="flex flex-col rounded-md border-gray-200 border divide-y divide-solid">
                {search.valid
                    ? catalogs
                          .filter((catalog) =>
                              catalog.name.includes(search.value)
                          )
                          .map(renderCatalog)
                    : catalogs.map(renderCatalog)}
            </div>
        </Layout>
    );
});

function filter() {
    return true;
}

const name = "Catalogs";

export default {
    name: name,
    icon: Icons.Topic,
    filter: filter,
    manager: Manager,
};
