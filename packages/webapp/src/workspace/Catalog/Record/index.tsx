import React, { useCallback } from "react";
import CatalogRecord from "./Record";
import { Draggable } from "react-beautiful-dnd";
import { RecordRecord, useCatalog } from "@colab/store";
import { useNavigator } from "src/hooks";
export { default as Context } from "./Context";
export * from "./hooks";

export interface IDraggableRecord {
    index: number;
    record: RecordRecord;
    draggable: boolean;
}

interface IRecord {
    record: RecordRecord;
    dragHandle?: any;
}

export const Record = React.memo<IRecord>(({ record, dragHandle }) => {
    const navigator = useNavigator();

    const handleOpenRecordDialog = useCallback(() => {
        navigator.openRecord(record);
    }, [record.id]);

    const blabel = useCatalog(record.catalog_id)
        .labels.toMap()
        .mapKeys((_index, val) => val.id);

    const labels = record.labels
        .map((val) => blabel.get(val)!)
        .filter(Boolean)
        .toList();

    const checklists = record.fields
        .filter((field) => field.type == "checklist")
        .map((field) => field.name);

    return (
        <CatalogRecord
            name={record.name}
            users={record.users}
            labels={labels}
            checked={record.checked}
            checklists={checklists}
            dragHandle={dragHandle}
            onClick={handleOpenRecordDialog}
        />
    );
});

export const DraggableRecord = React.memo<IDraggableRecord>(
    ({ record, index, draggable }) => {
        return (
            <Draggable
                index={index}
                draggableId={`record:${record.id}`}
                isDragDisabled={!draggable}>
                {(provided) => (
                    <div
                        {...provided.draggableProps}
                        ref={provided.innerRef}
                        className="mb-4 cursor-pointer">
                        <Record
                            record={record}
                            dragHandle={provided.dragHandleProps}
                        />
                    </div>
                )}
            </Draggable>
        );
    }
);

export default Record;
