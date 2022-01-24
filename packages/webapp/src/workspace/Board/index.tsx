import React, { useEffect } from "react";
import Main from "./Main";
import Board from "./Context";
import { useBoardColumns, useBoardCards } from "@octal/store";
import { useDispatch } from "react-redux";
import * as BoardAction from "@octal/store/lib/actions/board";
import { useBoard, useBoardLoaded } from "@octal/store";
import { useParams } from "react-router-dom";
export * from "./hooks";

export default React.memo(() => {
    const params = useParams<{ space_id: string; board_id: string }>();
    const dispatch = useDispatch();
    const board = useBoard(params.board_id);
    const loaded = useBoardLoaded(params.board_id);

    const cards = useBoardCards(params.board_id);

    const columns = useBoardColumns(params.board_id);

    useEffect(() => {
        if (!loaded.includes("columns")) {
            const action = BoardAction.loadBoardColumns(params);
            dispatch(action);
        }
        if (!loaded.includes("cards")) {
            const action = BoardAction.loadBoardCards(params);
            dispatch(action);
        }
    }, [
        cards ? cards.size == 0 : cards,
        columns ? columns.size == 0 : columns,
    ]);

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
