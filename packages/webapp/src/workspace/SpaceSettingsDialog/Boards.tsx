import React, { useState } from "react";
import { FaTrello as BoardIcon } from "react-icons/fa";
import Layout from "./Layout";
import * as Icons from "@octal/icons";
import { useDispatch } from "react-redux";
import { Dialog, Text } from "@octal/ui";
import { Promiseable } from "src/types";
import { useInput } from "src/utils";
import { SpaceManagerFilterParams } from ".";
import { BoardRecord } from "@octal/store/lib/records";
import * as BoardActions from "@octal/store/lib/actions/board";
import { useSpaceBoards } from "@octal/store";

interface ITopic {
    board: BoardRecord;
    onDelete?: (topic: BoardRecord) => Promiseable;
}

interface IWarning {
    onConfirm: (e: React.MouseEvent) => void;
    title: string;
    confirm: string;
    loading: boolean;
    children: React.ReactNode;
}

function deleteWarningText(board: any) {
    return `If you delete __${board.name}__, all mesages, and related data in the topic will be lost permantly. 

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

function Row({ board, onDelete }: ITopic) {
    const [loading, setLoading] = useState(false);

    const dialog = Dialog.useDialog("");

    function handleDelete() {
        setLoading(true);
        if (onDelete) {
            onDelete(board).catch(() => setLoading(false));
        }
    }

    return (
        <div className="flex group px-4 py-2 hover:bg-cool-gray-50 flex-row p-2 items-center justify-between">
            <div className="flex flex-row items-center">
                <div className="mx-2">
                    <BoardIcon className="w-6 h-6 text-gray-500" />
                </div>
                <span className="flex text-base font-semibold text-gray-700 flex-row items-center">
                    <Text>{board.name}</Text>
                </span>
            </div>
            <div className="invisible group-hover:visible flex flex-row items-center justify-end">
                <button
                    onClick={dialog.opener("destroy")}
                    className="invisible group-hover:visible text-gray-500 rounded-full mx-2 border border-gray-500 p-1 hover:bg-gray-200 flex items-center justify-center">
                    <Icons.Delete fontSize="small" />
                </button>
            </div>
            <WarningDialog
                loading={loading}
                title="Delete Board"
                confirm="Delete"
                onConfirm={handleDelete}
                open={dialog.destroy}
                onClose={dialog.close}>
                {deleteWarningText(board)}
            </WarningDialog>
        </div>
    );
}

const Manager = React.memo(({ space }: SpaceManagerFilterParams) => {
    const dispatch = useDispatch();

    const search = useInput("");

    const boards = useSpaceBoards(space.id);

    function handleDeleteTopic(board: BoardRecord) {
        const action = BoardActions.deleteBoard({
            board_id: board.id,
            space_id: board.space_id,
        });
        return dispatch(action);
    }

    return (
        <Layout title="Space Topics" className="flex flex-col">
            <div className="flex flex-row pb-4 justify-end">
                <div className="relative flex flex-row item-center">
                    <input
                        className="form-input font-semibold rounded-md text-sm text-gray-800 pl-10 pr-4 border shadow-sm border-gray-300"
                        {...search.props}
                    />
                    <div className="absolute px-2 h-full flex flex-col justify-center">
                        <Icons.Search className="text-gray-500 w-5 h-5" />
                    </div>
                </div>
            </div>
            <div className="flex flex-col py-4 rounded-md bg-cool-gray-100">
                {boards.map((board) => (
                    <Row
                        key={board.id}
                        board={board}
                        onDelete={handleDeleteTopic}
                    />
                ))}
            </div>
        </Layout>
    );
});

function filter() {
    return true;
}

const name = "Boards";

export default {
    name: name,
    icon: Icons.Topic,
    filter: filter,
    manager: Manager,
};
