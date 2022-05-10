import React, { useEffect } from "react";
import Main from "./Main";
import Board from "./Context";
import { useDispatch } from "react-redux";
import * as BoardAction from "@octal/store/lib/actions/board";
import { useBoard, useBoardLoaded } from "@octal/store";
import { useParams } from "react-router-dom";
export * from "./hooks";

export default React.memo(() => {
    const [loading, setLoading] = React.useState<string[]>([]);
    const params = useParams<{ space_id: string; board_id: string }>();
    const dispatch = useDispatch();
    const board = useBoard(params.board_id!);
    const loaded = useBoardLoaded(params.board_id!);

    useEffect(() => {
        if (!Boolean(board)) {
            return;
        }
        if (loaded.includes("columns")) {
            if (loading.includes("columns")) {
                setLoading((loading) =>
                    loading.filter((col) => col !== "columns")
                );
            }
        } else if (!loading.includes("columns")) {
            const action = BoardAction.loadBoardColumns(params as any);
            dispatch(action);
            setLoading((loading) => loading.concat(["columns"]));
        }

        if (loaded.includes("cards")) {
            if (loading.includes("cards")) {
                setLoading((loading) =>
                    loading.filter((col) => col !== "cards")
                );
            }
        } else if (!loading.includes("cards")) {
            const action = BoardAction.loadBoardCards(params as any);
            dispatch(action);
            setLoading((loading) => loading.concat(["cards"]));
        }
    }, [loaded]);

    if (board) {
        return (
            <Board.Provider value={board!}>
                <Main />
            </Board.Provider>
        );
    } else {
        return <div className="flex flex-1" />;
    }
});
