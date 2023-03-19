import React, { useEffect, useState } from "react";
import Main from "./Main";
import Board from "./Context";
import { useDispatch } from "react-redux";
import * as BoardAction from "@colab/store/lib/actions/board";
import { useBoard, useBoardLoaded } from "@colab/store";
import { useParams } from "react-router-dom";
import { useNavigator } from "src/hooks";
export * from "./hooks";

export default React.memo(() => {
    const nav = useNavigator();
    const [init, setInit] = useState<boolean>(false);
    const [loading, setLoading] = React.useState<string[]>([]);
    const params = useParams<{ space_id: string }>();
    const dispatch = useDispatch();
    const board = useBoard(params.space_id!);
    const loaded = useBoardLoaded(params.space_id!);

    useEffect(() => {
        if (Boolean(board.space_id)) {
            setInit(true);
        }
        if (init && board.space_id !== params.space_id) {
            return nav.openSpace({ id: params.space_id! });
        }
    }, [board.space_id, init]);

    useEffect(() => {
        if (!init) {
            return;
        }
        if (init && board.space_id !== params.space_id) {
            return;
        }
        if (loaded.includes("collections")) {
            if (loading.includes("collections")) {
                setLoading((loading) =>
                    loading.filter((col) => col !== "collections")
                );
            }
        } else if (!loading.includes("collections")) {
            const action = BoardAction.loadBoardCollections(params as any);
            dispatch(action);
            setLoading((loading) => loading.concat(["collections"]));
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
    }, [init, loaded]);

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
