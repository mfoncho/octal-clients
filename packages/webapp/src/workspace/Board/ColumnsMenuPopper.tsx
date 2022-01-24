import React from "react";
import { Popper } from "@octal/ui";
import { sort } from "@octal/common";
import { ColumnRecord, useColumnCardsIndex } from "@octal/store";
import * as Icons from "@octal/icons";
import { useColumns } from "./hooks";

export interface IMenu {
    onSelect: (e: React.MouseEvent, id: string) => any;
    selected?: string | string[];
    action?: string;
}

const positionSort = sort("position", "asc");

const unarchived = (column: ColumnRecord) => !Boolean(column.archived_at);

interface IColumn {
    column: ColumnRecord;
    onSelect: (e: React.MouseEvent, id: string) => void;
}

function Column({ column, ...props }: IColumn) {
    const indexed = useColumnCardsIndex(column.id);

    let full = indexed.size >= column.capacity;

    const Icon = column.type == "stack" ? Icons.Stack : Icons.Queue;
    if (full) {
        return (
            <li
                key={column.id}
                role="button"
                className="flex rounded-md group flex-row py-1 items-center px-2 hover:bg-gray-100">
                <Icon className="text-gray-400" />
                <span className="px-2 text-gray-600 font-semibold">
                    {column.name}
                </span>
            </li>
        );
    } else {
        return (
            <li
                key={column.id}
                role="button"
                className="flex group cursor-pointer rounded-md flex-row py-1 items-center px-2 hover:bg-primary-500 "
                onClick={(e) => props.onSelect(e, column.id)}>
                <Icon className="group-hover:text-white text-gray-500" />
                <span className="px-2 group-hover:text-white text-gray-800 font-semibold">
                    {column.name}
                </span>
            </li>
        );
    }
}

export default Popper.create<HTMLUListElement, IMenu>((props) => {
    const columns = useColumns();

    function renderColumnOption(column: ColumnRecord) {
        return (
            <Column key={column.id} column={column} onSelect={props.onSelect} />
        );
    }

    function renderAction(action: string) {
        switch (action.toLowerCase()) {
            case "archive":
                return (
                    <li
                        role="button"
                        className="flex flex-row mt-1 font-semibold bg-gray-100 rounded-md justify-center text-gray-600 py-2"
                        onClick={(e) => props.onSelect(e, action)}>
                        {action}
                    </li>
                );

            case "delete":
                return (
                    <li
                        role="button"
                        className="flex flex-row mt-1 font-semibold bg-red-50 rounded-md justify-center text-red-700 py-2"
                        onClick={(e) => props.onSelect(e, action)}>
                        {action}
                    </li>
                );
        }
        return null;
    }

    return (
        <Popper
            as={"ul"}
            placement="bottom-start"
            distance={10}
            tabIndex={-1}
            anchorEl={props.anchorEl}
            onClickAway={props.onClickAway}
            className="z-10 flex w-48 flex-col rounded-md ring-1 ring-gray-800 ring-opacity-5 max-h-56 p-2 bg-white shadow-lg overflow-x-hidden overflow-y-auto">
            {columns
                .filter(unarchived)
                .sort(positionSort)
                .map(renderColumnOption)}
            {props.action && renderAction(props.action)}
        </Popper>
    );
});
