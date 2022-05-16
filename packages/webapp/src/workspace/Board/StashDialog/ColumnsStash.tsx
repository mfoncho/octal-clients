import React from "react";
import FullIcon from "@material-ui/icons/HourglassFull";
import { Dialog, Tooltip, Button } from "@octal/ui";
import { ColumnRecord, CardRecord } from "@octal/store";
import Card from "@workspace/Board/Card";
import * as Icons from "@octal/icons";
import { useColumns } from "@workspace/Board";
import { useColumnActions } from "@workspace/Board";
import SimpleBar from "simplebar-react";
import DestroyColumnWarningDialog from "./DestroyColumnWaringDialog";
import { useColumnCards } from "@octal/store";

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
            className={
                "flex flex-col flex-none overflow-hidden shadow-md mx-4 rounded-md border border-gray-200"
            }
            style={{ width: "315px" }}>
            <div className="flex pl-2 pr-1 py-3 flex-row items-center justify-between">
                <button className="flex flex-row items-center">
                    {column.type == "stack" && (
                        <Icons.Stack className="text-gray-600" />
                    )}
                    {column.type == "queue" && (
                        <Icons.Queue className="text-gray-600" />
                    )}
                    <span className="px-2 text-gray-800 font-semibold">
                        {column.name}
                    </span>
                </button>
                <div className="flex flex-row items-center justify-end">
                    {isFull && (
                        <Tooltip
                            placement="top"
                            title={<span className="font-semibold">Full</span>}>
                            <FullIcon className="text-gray-500" />
                        </Tooltip>
                    )}
                    <Button
                        onClick={actions.unstash}
                        color="clear"
                        className="mx-2"
                        variant="icon">
                        <Icons.Unarchive />
                    </Button>
                    <Button
                        onClick={dialog.opener("destroy")}
                        color="clear"
                        className="mx-2"
                        variant="icon">
                        <Icons.Delete />
                    </Button>
                </div>
            </div>
            <SimpleBar className="flex flex-col px-3 ">
                <div className="flex pb-12 flex-col pt-0.5 flex-grow">
                    {cards.toList().map(renderCard)}
                </div>
            </SimpleBar>
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
