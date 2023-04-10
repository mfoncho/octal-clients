import React from "react";
import { Popper, Text } from "@colab/ui";
import { sort } from "@colab/common";
import { CollectionRecord, useCollectionRecordsIndex } from "@colab/store";
import * as Icons from "@colab/icons";
import { useCollections } from "./hooks";

export interface IMenu {
    onSelect: (e: React.MouseEvent, id: string) => any;
    selected?: string | string[];
    action?: string;
}

const positionSort = sort("index", "asc");

const unarchived = (collection: CollectionRecord) =>
    !Boolean(collection.archived_at);

interface ICollection {
    collection: CollectionRecord;
    onSelect: (e: React.MouseEvent, id: string) => void;
}

function Collection({ collection, ...props }: ICollection) {
    const indexed = useCollectionRecordsIndex(collection.id);

    let full = indexed.size >= collection.capacity;

    const Icon = collection.type == "stack" ? Icons.Stack : Icons.Queue;
    if (full) {
        return (
            <li
                key={collection.id}
                className="flex group flex-row items-center p-2 bg-gray-100 justify-between">
                <span className="text-gray-600 font-semibold">
                    <Text>{collection.name}</Text>
                </span>
                <div className="flex flex-row">
                    <Icons.Full className="text-gray-400" />
                </div>
            </li>
        );
    } else {
        return (
            <li
                key={collection.id}
                role="button"
                className="flex group cursor-pointer flex-row  items-center p-2 hover:bg-primary-500 justify-between"
                onClick={(e) => props.onSelect(e, collection.id)}>
                <span className="group-hover:text-white text-gray-800 font-semibold">
                    <Text>{collection.name}</Text>
                </span>
                <Icon className="group-hover:text-white text-gray-500" />
            </li>
        );
    }
}

export default Popper.create<HTMLUListElement, IMenu>((props) => {
    const collections = useCollections();

    function renderCollectionOption(collection: CollectionRecord) {
        return (
            <Collection
                key={collection.id}
                collection={collection}
                onSelect={props.onSelect}
            />
        );
    }

    function renderAction(action: string) {
        switch (action.toLowerCase()) {
            case "archive":
                return (
                    <li
                        role="button"
                        className="flex group cursor-pointer flex-row  items-center p-2 hover:bg-primary-500 justify-between bg-orange-50"
                        onClick={(e) => props.onSelect(e, action)}>
                        <span className="group-hover:text-white text-gray-800 font-semibold">
                            <Text>{action}</Text>
                        </span>
                        <Icons.Archive className="group-hover:text-white text-gray-500" />
                    </li>
                );

            case "delete":
                return (
                    <li
                        role="button"
                        className="flex group cursor-pointer flex-row  items-center p-2 hover:bg-primary-500 justify-between bg-red-50"
                        onClick={(e) => props.onSelect(e, action)}>
                        <span className="group-hover:text-white text-gray-800 font-semibold">
                            <Text>{action}</Text>
                        </span>
                        <Icons.Archive className="group-hover:text-white text-gray-500" />
                    </li>
                );
        }
        return null;
    }

    return (
        <Popper
            as={"ul"}
            placement="bottom-start"
            distance={10}
            tabIndex={-1}
            anchorEl={props.anchorEl}
            onClickAway={props.onClickAway}
            className="z-10 flex w-60 flex-col rounded-md ring-1 ring-gray-800 ring-opacity-5 max-h-64 bg-white shadow-lg overflow-x-hidden overflow-y-auto divide-y">
            {collections
                .filter(unarchived)
                .sort(positionSort)
                .map(renderCollectionOption)}
            {props.action && renderAction(props.action)}
        </Popper>
    );
});
