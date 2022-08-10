import React from "react";
import { Popper, Text } from "@octal/ui";
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
                className="flex group flex-row items-center p-2 bg-gray-100 justify-between">
                <span className="text-gray-600 font-semibold">
                    <Text>{column.name}</Text>
                </span>
                <div className="flex flex-row">
                    <Icons.Full className="text-gray-400" />
                </div>
            </li>
        );
    } else {
        return (
            <li
                key={column.id}
                role="button"
                className="flex group cursor-pointer flex-row  items-center p-2 hover:bg-primary-500 justify-between"
                onClick={(e) => props.onSelect(e, column.id)}>
                <span className="group-hover:text-white text-gray-800 font-semibold">
                    <Text>{column.name}</Text>
                </span>
                <Icon className="group-hover:text-white text-gray-500" />
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
                        className="flex group cursor-pointer flex-row  items-center p-2 hover:bg-primary-500 justify-between bg-orange-50"
                        onClick={(e) => props.onSelect(e, action)}>
                        <span className="group-hover:text-white text-gray-800 font-semibold">
                            <Text>{action}</Text>
                        </span>
                        <Icons.Archive className="group-hover:text-white text-gray-500" />
                    </li>
                );

            case "delete":
                return (
                    <li
                        role="button"
                        className="flex group cursor-pointer flex-row  items-center p-2 hover:bg-primary-500 justify-between bg-red-50"
                        onClick={(e) => props.onSelect(e, action)}>
                        <span className="group-hover:text-white text-gray-800 font-semibold">
                            <Text>{action}</Text>
                        </span>
                        <Icons.Archive className="group-hover:text-white text-gray-500" />
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
            className="z-10 flex w-60 flex-col rounded-md ring-1 ring-gray-800 ring-opacity-5 max-h-64 bg-white shadow-lg overflow-x-hidden overflow-y-auto divide-y">
            {columns
                .filter(unarchived)
                .sort(positionSort)
                .map(renderColumnOption)}
            {props.action && renderAction(props.action)}
        </Popper>
    );
});
