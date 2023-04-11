import { Record } from "immutable";
import { useCallback, useMemo } from "react";
import { useDrawer as useWorkspaceDrawer } from "src/hooks";
import { RecordRecord } from "@colab/store";
import { useDispatch } from "react-redux";
import {
    useRecord as useCatalogRecord,
    useAuthId,
    useCatalog,
    useSpacePermissions,
} from "@colab/store";
import * as CatalogAction from "@colab/store/lib/actions/catalog";

export interface IDrawer {
    id: string;
    type: string;
    thread_id?: string;
}

let RecordCap = {
    ["catalog.manage"]: false,
    ["record.manage"]: false,
    ["record.delete"]: false,
    ["record.track"]: false,
};

export type Can = <T = boolean>(
    permission: keyof typeof RecordCap,
    value?: T
) => T;

export class Capability extends Record(RecordCap) {}

const defaultDrawerProps: IDrawer = {
    id: "",
    type: "",
    thread_id: "",
};

export function useDrawer(id: string) {
    return useWorkspaceDrawer(id, defaultDrawerProps);
}

export function useActions(record: RecordRecord) {
    const dispatch = useDispatch();

    const destroyRecord = useCallback(() => {
        const action = CatalogAction.delelteRecord({
            catalog_id: record.catalog_id,
            record_id: record.id,
        });
        return dispatch(action);
    }, [record.id]);

    const createField = useCallback(
        (params: {
            name: string;
            type: string;
            metadata?: { [key: string]: any };
        }) => {
            const action = CatalogAction.createRecordField({
                record_id: record.id,
                catalog_id: record.catalog_id,
                params,
            });
            return dispatch(action);
        },
        []
    );

    const moveField = useCallback((id: string, index: number) => {
        const action = CatalogAction.moveRecordField({
            field_id: id,
            record_id: record.id,
            params: {
                index: index,
            },
        });
        return dispatch(action);
    }, []);

    const updateField = useCallback(
        (field_id: string, params: { name?: string }) => {
            const action = CatalogAction.updateRecordField({
                field_id,
                record_id: record.id,
                catalog_id: record.catalog_id,
                params,
            });
            return dispatch(action);
        },
        []
    );

    const deleteRecordField = useCallback((id: string) => {
        const action = CatalogAction.deleteRecordField({
            field_id: id,
            record_id: record.id,
        });
        return dispatch(action);
    }, []);

    const archiveRecord = useCallback(() => {
        const params = {
            catalog_id: record.catalog_id,
            record_id: record.id,
        };
        const action = CatalogAction.archiveRecord(params);
        return dispatch(action);
    }, [record.id]);

    const moveRecord = useCallback(
        (id: string) => {
            if (id != record.collection_id) {
                const params = {
                    record_id: record.id,
                    collection_id: id,
                    catalog_id: record.catalog_id,
                };
                const action = CatalogAction.moveRecord(params);
                return dispatch(action);
            } else {
                return Promise.resolve(record);
            }
        },
        [record.id, record.collection_id]
    );

    const updateRecord = useCallback(
        (params: { name: string }) => {
            const payload = {
                params,
                catalog_id: record.catalog_id,
                record_id: record.id,
            };
            const action = CatalogAction.updateRecord(payload);
            return dispatch(action);
        },
        [record.id]
    );

    const checkRecord = useCallback(() => {
        const action = CatalogAction.checkRecord({
            catalog_id: record.catalog_id,
            record_id: record.id,
        });
        return dispatch(action);
    }, [record.id]);

    const uncheckRecord = useCallback(() => {
        const action = CatalogAction.uncheckRecord({
            catalog_id: record.catalog_id,
            record_id: record.id,
        });
        return dispatch(action);
    }, [record.id]);

    const actions = {
        createField,
        updateField,
        moveField,
        uncheckRecord,
        destroyRecord,
        updateRecord,
        checkRecord,
        archiveRecord,
        moveRecord,
        deleteRecordField,
    };

    return useMemo(() => {
        return actions;
    }, Object.values(actions));
}

export function useRecordCapability(id: string) {
    const aid = useAuthId();
    const record = useCatalogRecord(id)!;
    const catalog = useCatalog(record.catalog_id);
    const permissions = useSpacePermissions(catalog?.space_id);
    return useMemo<Can>(() => {
        const canManageCatalog = permissions.get(
            "catalog.manage",
            false
        ) as boolean;
        let cap = new Capability({
            ["record.track"]: !record.archived,
            ["catalog.manage"]: canManageCatalog && !record.archived,
            ["record.manage"]:
                (record.user_id === aid || canManageCatalog) &&
                !record.archived,
            ["record.delete"]: canManageCatalog && record.archived,
        });
        return ((permission: keyof typeof RecordCap, val?: any) => {
            let perm = cap.get(permission, false);
            if (val === undefined) {
                return perm;
            }
            if (perm) {
                return val;
            }
            return perm;
        }) as Can;
    }, [permissions, record.id, record.archived]);
}
