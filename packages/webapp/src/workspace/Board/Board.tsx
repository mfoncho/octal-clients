import React, { useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import Columns from "./Columns";
import { Dragged } from "./Context";
import PerfectScrollbar from "react-perfect-scrollbar";
import { DragDropContext, DropResult, DragStart } from "react-beautiful-dnd";
import * as BoardAction from "@octal/store/lib/actions/board";
import { useBoard } from "./hooks";

const scrollbarOptions = {
    suppressScrollY: true,
};

export default function Board() {
    const board = useBoard();

    const dispatch = useDispatch();

    const [dragged, setDragged] = useState<DragStart | null>(null);

    const handleDragStart = useCallback((dragged: DragStart) => {
        setDragged(dragged);
    }, []);

    const handleDragEnd = useCallback(
        (drop: DropResult) => {
            setDragged(null);
            if (drop.destination == null) return;

            if (
                drop.source.index === drop.destination.index &&
                drop.source.droppableId === drop.destination.droppableId
            )
                return;

            const position = drop.destination.index;

            const id = drop.draggableId.split(":")[1];

            switch (drop.type) {
                case "card":
                    {
                        let action = BoardAction.moveCard({
                            card_id: id,
                            board_id: board.id,
                            position: position,
                            column_id:
                                drop.destination.droppableId.split(":")[1],
                        });
                        dispatch(action);
                    }
                    break;

                case "column":
                    {
                        let action = BoardAction.moveColumn({
                            column_id: id,
                            position: position,
                            board_id: board.id,
                        });
                        dispatch(action);
                    }
                    break;

                default:
                    break;
            }
        },
        [board.id]
    );

    return (
        <Dragged.Provider value={dragged}>
            <PerfectScrollbar
                options={scrollbarOptions}
                className="flex-1 flex overflow-y-hidden">
                <DragDropContext
                    onDragEnd={handleDragEnd}
                    onDragStart={handleDragStart}>
                    <div className="flex flex-grow">
                        <Columns />
                    </div>
                </DragDropContext>
            </PerfectScrollbar>
        </Dragged.Provider>
    );
}
