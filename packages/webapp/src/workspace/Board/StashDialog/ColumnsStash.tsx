import React from "react";
import { Dialog, Tooltip, Button, Text } from "@colab/ui";
import { ColumnRecord, CardRecord } from "@colab/store";
import Card from "@workspace/Board/Card";
import * as Icons from "@colab/icons";
import { useColumns } from "@workspace/Board";
import { useColumnActions } from "@workspace/Board";
import PerfectScrollbar from "react-perfect-scrollbar";
import DestroyColumnWarningDialog from "./DestroyColumnWaringDialog";
import { useColumnCards } from "@colab/store";

interface IColumnsStash {
    board: { id: string };
}

interface IColumn {
    column: ColumnRecord;
}

function Column({ column }: IColumn) {
    const dialog = Dialog.useDialog("");
    const cards = useColumnCards(column.id);
    const isFull = cards.size >= column.capacity;
    const actions = useColumnActions(column);

    function renderCard(card: CardRecord) {
        return (
            <div key={card.id} className="pb-4">
                <Card card={card} />
            </div>
        );
    }

    return (
        <div
            className={"flex flex-col flex-none overflow-hidden mx-4"}
            style={{ width: "315px" }}>
            <div className="flex bg-slate-100 rounded-lg shadow pl-2 pr-1 py-1.5 flex-row items-center justify-between">
                <div className="flex flex-row items-center">
                    <span className="px-2 text-gray-800 font-semibold">
                        <Text>{column.name}</Text>
                    </span>
                </div>
                <div className="flex flex-row items-center justify-end space-x-1">
                    {isFull && (
                        <Tooltip
                            placement="top"
                            title={<span className="font-semibold">Full</span>}>
                            <Icons.Full className="text-gray-500 w-6 h-6" />
                        </Tooltip>
                    )}
                    <Button
                        onClick={actions.unstash}
                        color="clear"
                        variant="icon">
                        <Icons.Unarchive />
                    </Button>
                    <Button
                        onClick={dialog.opener("destroy")}
                        color="clear"
                        variant="icon">
                        <Icons.Delete className="w-4 h-4" />
                    </Button>
                </div>
            </div>
            <PerfectScrollbar className="flex flex-col px-3">
                <div className="flex flex-col py-5 flex-grow">
                    {cards.toList().map(renderCard)}
                </div>
            </PerfectScrollbar>
            <DestroyColumnWarningDialog
                open={dialog.destroy}
                onClose={dialog.close}
                column={column}
            />
        </div>
    );
}

export default function ColumnsArchive(props: IColumnsStash) {
    const columns = useColumns().filter((column) =>
        Boolean(column.archived_at)
    );
    return (
        <Dialog.Content className="flex flex-1 flex-row overflow-x-auto overflow-y-hidden">
            {columns
                .map((column) => <Column key={column.id} column={column} />)
                .toList()}
        </Dialog.Content>
    );
}
