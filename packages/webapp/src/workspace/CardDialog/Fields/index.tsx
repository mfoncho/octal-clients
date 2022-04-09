import React, { useState, useCallback } from "react";
import {
    DragDropContext,
    DropResult,
    DragStart,
    Draggable,
    Droppable,
    DraggableProvided,
} from "react-beautiful-dnd";
import FieldCreator from "./FieldCreator";
import { CardRecord, CardFieldRecord } from "@octal/store";
import { Elements } from "@octal/ui";
import { useActions } from "../hooks";
import Suggestion from "./Suggestion";
import { Mention } from "@workspace/Mention";
import TextField from "./TextField";
import UserField from "./UserField";
import LabelField from "./LabelField";
import NumberField from "./NumberField";
import DateTimeField from "./DateTimeField";
import ChecklistField from "./ChecklistField";
import { Dragged as FieldDragged } from "./Context";

interface IFields {
    card: CardRecord;
}

const components = {
    Suggestion,
    Mention,
};

export default React.memo<IFields>((props) => {
    const { card } = props;

    const actions = useActions(card);

    const [dragged, setDragged] = useState<DragStart | null>(null);

    const dnd = !card.archived;

    const handleDragStart = useCallback(
        (dragged: DragStart) => {
            setDragged(dragged);
        },
        [card.id]
    );

    const handleDragEnd = useCallback(
        (drop: DropResult) => {
            setDragged(null);
            if (drop.destination == null) return;

            if (drop.source.index === drop.destination.index) return;

            const position = drop.destination.index;

            const id = drop.draggableId.split(":")[1];

            actions.moveField(id, position);
        },
        [card.id]
    );

    function renderField(field: CardFieldRecord, index: number) {
        function renderDraggable(provided: DraggableProvided) {
            let el = <></>;
            const fieldProps = {
                field,
                index,
                handle: provided.dragHandleProps,
            };
            switch (field.type) {
                case "text":
                    el = <TextField {...fieldProps} />;
                    break;
                case "user":
                    el = <UserField {...fieldProps} />;
                    break;
                case "label":
                    el = <LabelField {...fieldProps} />;
                    break;

                case "number":
                    el = <NumberField {...fieldProps} />;
                    break;

                case "checklist":
                    el = <ChecklistField {...fieldProps} />;
                    break;
                case "date":
                case "datetime":
                    el = <DateTimeField {...fieldProps} />;
                    break;
                default:
                    break;
            }
            return (
                <div
                    {...provided.draggableProps}
                    ref={provided.innerRef}
                    className="flex flex-col bg-white rounded-md">
                    {el}
                </div>
            );
        }
        return (
            <Draggable
                key={field.id}
                index={index}
                isDragDisabled={!dnd}
                draggableId={`field:${field.id}`}>
                {renderDraggable}
            </Draggable>
        );
    }

    function renderFields(provided: any) {
        return (
            <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="flex flex-col">
                {card.fields.map(renderField)}
                {provided.placeholder}
            </div>
        );
    }

    return (
        <React.Fragment>
            <Elements.Provider value={components}>
                <FieldDragged.Provider value={dragged}>
                    <DragDropContext
                        onDragEnd={handleDragEnd}
                        onDragStart={handleDragStart}>
                        <Droppable
                            isDropDisabled={!dnd}
                            droppableId="fields"
                            direction="vertical"
                            type="field">
                            {renderFields}
                        </Droppable>
                    </DragDropContext>
                </FieldDragged.Provider>
            </Elements.Provider>
            {Boolean(card.id) && !Boolean(card.archived) && (
                <FieldCreator card={card} />
            )}
        </React.Fragment>
    );
});
