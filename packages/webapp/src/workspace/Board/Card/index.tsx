import React, { useCallback } from "react";
import BoardCard from "./BoardCard";
import { Draggable } from "react-beautiful-dnd";
import { CardRecord } from "@octal/store";
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

    return (
        <BoardCard
            card={card}
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
