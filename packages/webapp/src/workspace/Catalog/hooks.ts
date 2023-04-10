import { RecordRecord, CollectionRecord, RecordFieldRecord } from "@colab/store";
import { OrderedMap } from "immutable";
import { useContext, useCallback, useMemo } from "react";
import * as CatalogAction from "@colab/store/lib/actions/catalog";
import Context, { Records, Dragged } from "./Context";
import { useDispatch } from "react-redux";
import { useDrawer as useWorkspaceDrawer } from "src/hooks";
import { useCatalogCollections, Actions } from "@colab/store";
export { useMembers, useMember } from "../Space/hooks";

const defaultRecords = OrderedMap<string, RecordRecord>();

export interface IDrawer {
    type: string;
    record_id?: string;
    user_id?: string;
    catalog_id?: string;
    space_id?: string;
    topic_id?: string;
    thread_id?: string;
    message_id?: string;
}

const drawer: IDrawer = {
    type: "",
    thread_id: "",
};

export function useCatalog() {
    return useContext(Context);
}

export function useDragged() {
    return useContext(Dragged);
}

export function useLabels() {
    return useCatalog().labels;
}

export function useRecords() {
    return useContext(Records);
}

export function useCollectionRecords(id: string) {
    return useRecords().get(id, defaultRecords);
}

export function useDrawer(id: string) {
    return useWorkspaceDrawer(id, drawer);
}

export function useCollections() {
    const catalog = useCatalog();
    return useCatalogCollections(catalog.id);
}

export function useCatalogActions() {
    const catalog = useCatalog();
    const dispatch = useDispatch();
    const updateCatalog = useCallback(
        (params: { name: string }) => {
            const action = CatalogAction.updateCatalog({
                catalog_id: catalog.id,
                space_id: catalog.space_id,
                params,
            });
            return dispatch(action);
        },
        [catalog.id]
    );

    const filter = useCallback(
        (filter: string, value: string | string[]) => {
            const action = CatalogAction.updateCatalogFilter({
                filter: filter,
                catalog_id: catalog.id,
                value: value,
            });
            return dispatch(action);
        },
        [catalog.id]
    );

    const createRecordTemplate = useCallback(
        (
            name: string,
            desc: string,
            fields: { name: string; type: string }[]
        ) => {
            const action = CatalogAction.createRecordTemplate({
                catalog_id: catalog.id,
                params: {
                    name,
                    fields,
                    description: desc,
                },
            });
            return dispatch(action);
        },
        [catalog.id]
    );

    const deleteRecordTemplate = useCallback(
        (id: string) => {
            const action = CatalogAction.deleteRecordTemplate({
                catalog_id: catalog.id,
                template_id: id,
            });
            return dispatch(action);
        },
        [catalog.id]
    );

    const createLabel = useCallback(
        (params: CatalogAction.CreateLabelParams) => {
            const action = CatalogAction.createLabel(catalog.id, params);
            return dispatch(action);
        },
        [catalog.id]
    );
    const updateLabel = useCallback(
        (id: string, params: Partial<CatalogAction.CreateLabelParams>) => {
            const action = CatalogAction.updateLabel({
                params,
                label_id: id,
                catalog_id: catalog.id,
            });
            return dispatch(action);
        },
        [catalog.id]
    );

    const deleteLabel = useCallback(
        (id: string) => {
            const action = CatalogAction.deleteLabel({
                catalog_id: catalog.id,
                label_id: id,
            });
            return dispatch(action);
        },
        [catalog.id]
    );
    return {
        updateCatalog,
        filter,
        createLabel,
        updateLabel,
        deleteLabel,
        createRecordTemplate,
        deleteRecordTemplate,
    };
}

export function useCollectionActions(collection: CollectionRecord) {
    const dispatch = useDispatch();

    const update = useCallback(
        (
            params: Omit<
                CatalogAction.UpdateCollectionPayload,
                "collection_id" | "catalog_id"
            >
        ) => {
            const action = CatalogAction.updateCollection({
                ...params,
                collection_id: collection.id,
                catalog_id: collection.catalog_id,
            });
            return dispatch(action);
        },
        [collection.id]
    );

    const destroy = useCallback(() => {
        const action = CatalogAction.deleteCollection({
            collection_id: collection.id,
            catalog_id: collection.catalog_id,
        });
        return dispatch(action);
    }, []);

    const stash = useCallback(() => {
        const action = CatalogAction.archiveCollection({
            collection_id: collection.id,
            catalog_id: collection.catalog_id,
        });
        return dispatch(action);
    }, []);

    const unstash = useCallback(() => {
        const action = CatalogAction.unarchiveCollection({
            collection_id: collection.id,
            catalog_id: collection.catalog_id,
        });
        return dispatch(action);
    }, []);

    const createRecord = useCallback((name: string, template?: string) => {
        const action = CatalogAction.createRecord({
            params: {
                name: name,
            },
            template_id: template,
            catalog_id: collection.catalog_id,
            collection_id: collection.id,
        });
        return dispatch(action);
    }, []);

    return {
        update,
        destroy,
        stash,
        unstash,
        createRecord,
    };
}

export function useFieldAction(field: RecordFieldRecord) {
    const dispatch = useDispatch();

    const assignUser = useCallback(
        (user_id: string) => {
            const action = CatalogAction.assignChecklist({
                field_id: field.id,
                record_id: field.record_id,
                user_id: user_id,
            });
            return dispatch(action);
        },
        [field.id]
    );
    const unassignUser = useCallback(
        (user_id: string) => {
            const action = CatalogAction.unassignChecklist({
                field_id: field.id,
                record_id: field.record_id,
                user_id: user_id,
            });
            return dispatch(action);
        },
        [field.id]
    );
    const setFieldValue = useCallback(
        (value: any) => {
            const action = CatalogAction.setRecordFieldValue({
                field_id: field.id,
                record_id: field.record_id,
                params: {
                    value: value,
                },
            });
            return dispatch(action);
        },
        [field.id]
    );

    const deleteFieldValue = useCallback(
        (id: string) => {
            const action = CatalogAction.deleteRecordFieldValue({
                value_id: id,
                field_id: field.id,
                record_id: field.record_id,
            });
            return dispatch(action);
        },
        [field.id]
    );

    const createFieldValue = useCallback(
        (params: { [key: string]: any }) => {
            const action = CatalogAction.createRecordFieldValue({
                field_id: field.id,
                record_id: field.record_id,
                params: params,
            });
            return dispatch(action);
        },
        [field.id]
    );

    const updateFieldValue = useCallback(
        (id: string, params: { [key: string]: any }) => {
            const action = CatalogAction.updateRecordFieldValue({
                field_id: field.id,
                value_id: id,
                record_id: field.record_id,
                params: params,
            });
            return dispatch(action);
        },
        [field.id]
    );

    const updateField = useCallback(
        (params: { name?: string }) => {
            const action = CatalogAction.updateRecordField({
                field_id: field.id,
                record_id: field.record_id,
                params,
            });
            return dispatch(action);
        },
        [field.id]
    );

    const deleteField = useCallback(() => {
        const action = CatalogAction.deleteRecordField({
            field_id: field.id,
            record_id: field.record_id,
        });
        return dispatch(action);
    }, [field.id]);

    return {
        updateField,
        deleteField,
        setFieldValue,
        assignUser,
        unassignUser,
        updateFieldValue,
        createFieldValue,
        deleteFieldValue,
    };
}

export function useRecordActions(record: RecordRecord) {
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

    const completeRecord = useCallback(() => {
        const action = CatalogAction.completeRecord({
            catalog_id: record.catalog_id,
            record_id: record.id,
        });
        return dispatch(action);
    }, [record.id]);

    const uncompleteRecord = useCallback(() => {
        const action = Actions.Catalog.uncompleteRecord({
            catalog_id: record.catalog_id,
            record_id: record.id,
        });
        return dispatch(action);
    }, [record.id]);

    const actions = {
        createField,
        updateField,
        moveField,
        uncompleteRecord,
        destroyRecord,
        updateRecord,
        completeRecord,
        archiveRecord,
        moveRecord,
        deleteRecordField,
    };

    return useMemo(() => {
        return actions;
    }, Object.values(actions));
}
