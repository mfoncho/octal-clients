import React, { useState, useEffect } from "react";
import { FaTrello as BoardIcon } from "react-icons/fa";
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
    board: io.Board;
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

function Row({ board, onDelete, onArchive, onUnarchive }: ITopic) {
    const [loading, setLoading] = useState(false);

    const dialog = Dialog.useDialog("");

    function handleDelete() {
        setLoading(true);
        onDelete(board.id).catch(() => setLoading(false));
    }

    function handleArchiveBoard() {
        setLoading(true);
        onArchive(board.id).finally(() => setLoading(false));
    }

    function handleUnarchiveBoard() {
        setLoading(true);
        onUnarchive(board.id).finally(() => setLoading(false));
    }

    function renderActions() {
        if (board.is_archived) {
            return (
                <div className="flex flex-row space-x-2 items-center">
                    <button
                        onClick={dialog.opener("destroy")}
                        className="text-gray-500 rounded-md border border-slate-200 p-1 hover:bg-slate-300 flex items-center justify-center">
                        <Icons.Delete className="h-5 w-5" />
                    </button>
                    <button
                        onClick={handleUnarchiveBoard}
                        className="text-gray-500 rounded-md border border-slate-200 p-1 hover:bg-slate-300 flex items-center justify-center">
                        <Icons.Unarchive className="h-5 w-5" />
                    </button>
                </div>
            );
        }
        return (
            <button
                onClick={handleArchiveBoard}
                className="text-gray-500 rounded-md border border-slate-200 p-1 hover:bg-slate-300 flex items-center justify-center">
                <Icons.Archive className="h-5 w-5" />
            </button>
        );
    }
    return (
        <div className="flex group px-4 py-3 hover:bg-slate-100 flex-row p-2 items-center justify-between">
            <div className="flex flex-row items-center">
                <div className="mx-2">
                    <BoardIcon className="w-6 h-6 text-gray-500" />
                </div>
                <span className="flex text-base font-semibold text-gray-700 flex-row items-center">
                    <Text>{board.name}</Text>
                </span>
            </div>
            <div className="invisible group-hover:visible flex flex-row items-center justify-end">
                {renderActions()}
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

    const [boards, setBoards] = useState<io.Board[]>([]);

    useEffect(() => {
        client.fetchBoards(space.id).then(setBoards);
    }, []);

    function handleDeleteBoard(id: string) {
        const action = Actions.Board.deleteBoard({
            board_id: id,
            space_id: space.id,
        });
        return dispatch(action).then(() => {
            setBoards((boards) => boards.filter((board) => board.id !== id));
        });
    }

    function handleArchiveBoard(id: string) {
        const action = Actions.Board.archiveBoard({
            board_id: id,
            space_id: space.id,
        });
        return dispatch(action).then((board) => {
            setBoards((boards) =>
                boards.map((sboard) => (sboard.id == board.id ? board : sboard))
            );
        });
    }

    function handleUnarchiveBoard(id: string) {
        const action = Actions.Board.unarchiveBoard({
            board_id: id,
            space_id: space.id,
        });
        return dispatch(action).then((board) => {
            setBoards((boards) =>
                boards.map((sboard) => (sboard.id == board.id ? board : sboard))
            );
        });
    }

    function renderBoard(board: io.Board) {
        return (
            <Row
                key={board.id}
                board={board}
                onDelete={handleDeleteBoard}
                onArchive={handleArchiveBoard}
                onUnarchive={handleUnarchiveBoard}
            />
        );
    }

    return (
        <Layout title="Boards" className="flex flex-col">
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
                    ? boards
                          .filter((board) => board.name.includes(search.value))
                          .map(renderBoard)
                    : boards.map(renderBoard)}
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
