import React from "react";
import clx from "classnames";
import { Link, generatePath, useParams } from "react-router-dom";
import { Text } from "@octal/ui";
import paths from "src/paths/workspace";
import Counter from "./Counter";
import * as Icons from "@octal/icons";
import { useBoard } from "@octal/store";

interface IBoard {
    id: string;
}

export default React.memo<IBoard>(({ id }) => {
    const notification = 0;

    const board = useBoard(id);

    const params = useParams<{ board_id: string }>();

    const path = generatePath(paths.board, {
        space_id: board?.space_id,
        board_id: board?.id,
    });

    const selected = params.board_id == id;

    return (
        <Link
            to={path}
            className={clx(
                "flex px-2 py-1 flex-row items-center",
                selected
                    ? "bg-primary-500 text-white"
                    : "text-gray-500 hover:bg-slate-200"
            )}>
            <Icons.Board className={clx("w-5 h-5 mx-1")} />
            <span
                className={clx(
                    "pl-2 font-semibold text-sm flex-inline flex-grow overflow-x-hidden",
                    {
                        ["text-gray-500"]: !selected,
                    }
                )}>
                <Text>{board!.name}</Text>
            </span>
            <Counter value={notification} />
        </Link>
    );
});
