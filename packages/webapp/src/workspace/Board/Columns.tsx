import React, { useState, useCallback, useRef } from "react";
import { Button } from "@octal/ui";
import { Droppable } from "react-beautiful-dnd";
import { sort } from "@octal/common";
import { ColumnRecord } from "@octal/store/lib/records";
import { useDispatch } from "react-redux";
import { createColumn } from "@octal/store/lib/actions/board";
import Column from "./Column";
import { useColumns, useBoard } from "./hooks";
import { usePermissions } from "../Space/hooks";
import ColumnNameInput, { IColumnNameInputRef } from "./Column/NameInput";

const positionSort = sort("position", "asc");

function CreateColumn() {
    const board = useBoard();

    const dispatch = useDispatch();

    const creatorRef = useRef<IColumnNameInputRef>(null);

    const [open, setOpen] = useState<boolean>(false);

    const [creating, setCreating] = useState<boolean>(false);

    const toggleOpen = useCallback(() => {
        setOpen((open) => !open);
    }, []);

    const handleClose = useCallback(() => {
        setOpen(false);
    }, []);

    const handleCreateColumn = useCallback(
        (name: string) => {
            setCreating(true);
            const action = createColumn({
                name: name,
                type: "stack",
                origin: true,
                capacity: 10,
                board_id: board.id,
            });
            return dispatch(action)
                .then(() => {
                    setCreating(false);
                    creatorRef.current?.reset();
                })
                .catch(() => {
                    setCreating(false);
                    creatorRef.current?.focus();
                });
        },
        [board.id]
    );

    return (
        <div
            className="flex-zeros-auto pt-2.5 pl-4 mt-1 mx-4 flex-col"
            style={{ width: "330px" }}>
            {open ? (
                <ColumnNameInput
                    ref={creatorRef}
                    disabled={creating}
                    onSubmit={handleCreateColumn}
                    onClose={handleClose}
                />
            ) : (
                <Button onClick={toggleOpen}>Add Column</Button>
            )}
        </div>
    );
}

function renderColumn(column: ColumnRecord, index: number) {
    return <Column key={column.id} index={index} column={column} />;
}

interface IColumns {}

const unarchived = (column: ColumnRecord) => !Boolean(column.archived_at);

export default React.memo<IColumns>(() => {
    const columns = useColumns();
    const permissions = usePermissions();

    function renderProvided(provided: any) {
        return (
            <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="flex flex-row first-child:pl-8 last-child:pr-12">
                {columns
                    .filter(unarchived)
                    .sort(positionSort)
                    .map(renderColumn)}
                {provided.placeholder}
                {permissions.get("board.manage") && <CreateColumn />}
            </div>
        );
    }

    return (
        <Droppable droppableId="columns" direction="horizontal" type="column">
            {renderProvided}
        </Droppable>
    );
});
