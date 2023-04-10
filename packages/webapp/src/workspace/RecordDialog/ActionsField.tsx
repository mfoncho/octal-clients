import React, { useState, useRef } from "react";
import * as Icons from "@colab/icons";
import CollectionsMenuPopper from "@workspace/Catalog/CollectionsMenuPopper";
import { RecordRecord, useCollection, useAuthId } from "@colab/store";
import { Text, useScreen } from "@colab/ui";
import Actions from "./Actions";
import { useActions } from "./hooks";
import { usePermissions } from "@workspace/Space";

interface ICollectionField {
    record: RecordRecord;
    onClose: (e: React.MouseEvent) => void;
}

export default function CollectionField({
    record,
    ...props
}: ICollectionField) {
    const actions = useActions(record);
    const screen = useScreen();
    const root = useRef<HTMLButtonElement>(null);
    const collection = useCollection(record.collection_id);
    const [popper, setPopper] = useState(false);
    const permissions = usePermissions();

    const authId = useAuthId();

    let owner = record.user_id == authId;

    const moveable = permissions.get("catalog.manage") || owner;

    function handleCollectionSelect(e: React.MouseEvent, id: string) {
        e.preventDefault();
        e.stopPropagation();
        setPopper(false);
        if (moveable && record.collection_id !== id) {
            if (id == "Archive") {
                return actions.archiveRecord();
            } else {
                return actions.moveRecord(id);
            }
        }
    }

    return (
        <div className="flex flex-row items-center justify-between py-4">
            <button
                ref={root}
                disabled={!moveable}
                onClick={moveable ? () => setPopper(true) : undefined}
                className="py-1 px-2 flex flex-row rounded-md hover:bg-slate-200 items-center bg-slate-100">
                {record.archived ? (
                    <>
                        <span className="bg-primary-500 font-bold text-sm rounded text-white">
                            <Icons.Unarchive />
                        </span>
                        <span className="px-2 mx-1 text-base font-bold text-gray-700">
                            Unarchive
                        </span>
                    </>
                ) : (
                    <>
                        <span className="px-1.5 bg-primary-500 font-bold text-sm rounded text-white">
                            {record.index + 1}
                        </span>
                        <span className="px-2 mx-1 text-base font-bold text-gray-700">
                            <Text>{collection.name}</Text>
                        </span>
                    </>
                )}
            </button>
            {screen.mobile && (
                <div className="flex flex-row  items-center sm:hidden">
                    <Actions record={record} onClose={props.onClose} />
                </div>
            )}
            <CollectionsMenuPopper
                open={popper}
                anchorEl={root.current}
                selected={record.collection_id}
                onSelect={handleCollectionSelect}
                action={record.archived ? undefined : "Archive"}
                onClickAway={() => setPopper(false)}
            />
        </div>
    );
}
