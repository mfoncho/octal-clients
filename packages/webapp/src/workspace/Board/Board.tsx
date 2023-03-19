import React, { useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import Collections from "./Collections";
import { Dragged } from "./Context";
import PerfectScrollbar from "react-perfect-scrollbar";
import { DragDropContext, DropResult, DragStart } from "react-beautiful-dnd";
import * as BoardAction from "@colab/store/lib/actions/board";
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

            const index = drop.destination.index;

            const id = drop.draggableId.split(":")[1];

            switch (drop.type) {
                case "card":
                    {
                        let action = BoardAction.moveCard({
                            card_id: id,
                            space_id: board.space_id,
                            index: index,
                            collection_id:
                                drop.destination.droppableId.split(":")[1],
                        });
                        dispatch(action);
                    }
                    break;

                case "collection":
                    {
                        let action = BoardAction.moveCollection({
                            collection_id: id,
                            index: index,
                            space_id: board.space_id,
                        });
                        dispatch(action);
                    }
                    break;

                default:
                    break;
            }
        },
        [board.space_id]
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
                        <Collections />
                    </div>
                </DragDropContext>
            </PerfectScrollbar>
        </Dragged.Provider>
    );
}
