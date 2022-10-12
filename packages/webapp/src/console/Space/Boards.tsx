import React from "react";
import { io } from "@console/types";
import moment from "moment";
import client from "@console/client";
import { Text } from "@colab/ui";

export interface IBoards {
    space: io.Space;
}

export default function Boards({ space }: IBoards) {
    const [boards, setBoards] = React.useState<io.Board[]>([]);

    React.useEffect(() => {
        if (space) {
            loadBoards();
        }
    }, [space.id]);

    async function loadBoards() {
        return client
            .fetchSpaceBoards({ space_id: space.id })
            .then((data) => setBoards(data))
            .catch(() => {});
    }

    function renderTopic(board: io.Board) {
        return (
            <div
                key={board.id}
                className="flex justify-between text-gray-500 flex-row px-4 py-2 items-center hover:bg-primary-50">
                <div className="flex flex-row items-center">
                    <span className="text-gray-800 font-semibold text-base">
                        <Text>{board.name}</Text>
                    </span>
                </div>
                <div>
                    <span className="font-semibold text-sm">
                        {moment(board.created_at).format("ll")}
                    </span>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col shadow rounded-md bg-white overflow-hidden">
            <div className="py-4 bg-gray-100 flex flex-row justify-between">
                <span className="font-bold px-4 text-gray-800">Boards</span>
            </div>
            <div className="flex flex-col divide-y divide-slate-200">
                {boards.map(renderTopic)}
            </div>
        </div>
    );
}
