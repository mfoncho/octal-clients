import React, { useCallback } from "react";
import BoardCard from "./Card";
import { Draggable } from "react-beautiful-dnd";
import { CardRecord, useBoard } from "@colab/store";
import { useNavigator } from "src/hooks";
export { default as Context } from "./Context";
export * from "./hooks";

export interface IDraggableCard {
    index: number;
    card: CardRecord;
    draggable: boolean;
}

interface ICard {
    card: CardRecord;
    dragHandle?: any;
}

export const Card = React.memo<ICard>(({ card, dragHandle }) => {
    const navigator = useNavigator();

    const handleOpenCardDialog = useCallback(() => {
        navigator.openCard(card);
    }, [card.id]);

    const blabel = useBoard(card.board_id)
        .labels.toMap()
        .mapKeys((_index, val) => val.id);

    const labels = card.labels
        .map((val) => blabel.get(val)!)
        .filter(Boolean)
        .toList();

    const checklists = card.fields
        .filter((field) => field.type == "checklist")
        .map((field) => field.name);

    return (
        <BoardCard
            name={card.name}
            users={card.users}
            labels={labels}
            complete={card.complete}
            checklists={checklists}
            dragHandle={dragHandle}
            onClick={handleOpenCardDialog}
        />
    );
});

export const DraggableCard = React.memo<IDraggableCard>(
    ({ card, index, draggable }) => {
        return (
            <Draggable
                index={index}
                draggableId={`card:${card.id}`}
                isDragDisabled={!draggable}>
                {(provided) => (
                    <div
                        {...provided.draggableProps}
                        ref={provided.innerRef}
                        className="mb-4 cursor-pointer">
                        <Card
                            card={card}
                            dragHandle={provided.dragHandleProps}
                        />
                    </div>
                )}
            </Draggable>
        );
    }
);

export default Card;
