import React, { useState, useCallback, useRef } from "react";
import { Button } from "@colab/ui";
import { Droppable } from "react-beautiful-dnd";
import { sort } from "@colab/common";
import * as Icons from "@colab/icons";
import { CollectionRecord } from "@colab/store/lib/records";
import { useDispatch } from "react-redux";
import { createCollection } from "@colab/store/lib/actions/board";
import Collection from "./Collection";
import { useCollections, useBoard } from "./hooks";
import { usePermissions } from "../Space/hooks";
import CollectionNameInput, {
    ICollectionNameInputRef,
} from "./Collection/NameInput";

const positionSort = sort("index", "asc");

function CreateCollection() {
    const board = useBoard();

    const dispatch = useDispatch();

    const creatorRef = useRef<ICollectionNameInputRef>(null);

    const [open, setOpen] = useState<boolean>(false);

    const [creating, setCreating] = useState<boolean>(false);

    const toggleOpen = useCallback(() => {
        setOpen((open) => !open);
    }, []);

    const handleClose = useCallback(() => {
        setOpen(false);
    }, []);

    const handleCreateCollection = useCallback(
        (name: string) => {
            setCreating(true);
            const action = createCollection({
                name: name,
                type: "stack",
                origin: true,
                capacity: 10,
                board_id: board.id,
            });
            return dispatch(action)
                .then(() => {
                    setCreating(false);
                    creatorRef.current?.reset();
                })
                .catch(() => {
                    setCreating(false);
                    creatorRef.current?.focus();
                });
        },
        [board.id]
    );

    return (
        <div
            className="flex-zeros-auto pt-2.5 pl-4 mt-1 mx-4 flex-col"
            style={{ width: "330px" }}>
            {open ? (
                <CollectionNameInput
                    ref={creatorRef}
                    disabled={creating}
                    onSubmit={handleCreateCollection}
                    onClose={handleClose}
                />
            ) : (
                <Button
                    onClick={toggleOpen}
                    className="flex flex-row justify-center h-10 items-center">
                    <Icons.Plus />
                </Button>
            )}
        </div>
    );
}

function renderCollection(collection: CollectionRecord, index: number) {
    return (
        <Collection key={collection.id} index={index} collection={collection} />
    );
}

interface ICollections {}

const unarchived = (collection: CollectionRecord) =>
    !Boolean(collection.archived_at);

export default React.memo<ICollections>(() => {
    const collections = useCollections();
    const permissions = usePermissions();

    function renderProvided(provided: any) {
        return (
            <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="flex flex-row first-child:pl-8 last-child:pr-12">
                {collections
                    .filter(unarchived)
                    .sort(positionSort)
                    .map(renderCollection)}
                {provided.placeholder}
                {permissions.get("board.manage") && <CreateCollection />}
            </div>
        );
    }

    return (
        <Droppable
            droppableId="collections"
            direction="horizontal"
            type="collection">
            {renderProvided}
        </Droppable>
    );
});
