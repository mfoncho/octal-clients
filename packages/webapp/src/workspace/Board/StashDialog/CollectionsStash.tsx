import React from "react";
import { Dialog, Tooltip, Button, Text } from "@colab/ui";
import { CollectionRecord, CardRecord } from "@colab/store";
import Card from "@workspace/Board/Card";
import * as Icons from "@colab/icons";
import { useCollections } from "@workspace/Board";
import { useCollectionActions } from "@workspace/Board";
import PerfectScrollbar from "react-perfect-scrollbar";
import DestroyCollectionWarningDialog from "./DestroyCollectionWaringDialog";
import { useCollectionCards } from "@colab/store";

interface ICollectionsStash {
    board: { id: string };
}

interface ICollection {
    collection: CollectionRecord;
}

function Collection({ collection }: ICollection) {
    const dialog = Dialog.useDialog("");
    const cards = useCollectionCards(collection.id);
    const isFull = cards.size >= collection.capacity;
    const actions = useCollectionActions(collection);

    function renderCard(card: CardRecord) {
        return (
            <div key={card.id} className="pb-4">
                <Card card={card} />
            </div>
        );
    }

    return (
        <div
            className={"flex flex-col flex-none overflow-hidden mx-4"}
            style={{ width: "315px" }}>
            <div className="flex bg-slate-100 rounded-lg shadow pl-2 pr-1 py-1.5 flex-row items-center justify-between">
                <div className="flex flex-row items-center">
                    <span className="px-2 text-gray-800 font-semibold">
                        <Text>{collection.name}</Text>
                    </span>
                </div>
                <div className="flex flex-row items-center justify-end space-x-1">
                    {isFull && (
                        <Tooltip
                            placement="top"
                            title={<span className="font-semibold">Full</span>}>
                            <Icons.Full className="text-gray-500 w-6 h-6" />
                        </Tooltip>
                    )}
                    <Button
                        onClick={actions.unstash}
                        color="clear"
                        variant="icon">
                        <Icons.Unarchive />
                    </Button>
                    <Button
                        onClick={dialog.opener("destroy")}
                        color="clear"
                        variant="icon">
                        <Icons.Delete className="w-4 h-4" />
                    </Button>
                </div>
            </div>
            <PerfectScrollbar className="flex flex-col px-3">
                <div className="flex flex-col py-5 flex-grow">
                    {cards.toList().map(renderCard)}
                </div>
            </PerfectScrollbar>
            <DestroyCollectionWarningDialog
                open={dialog.destroy}
                onClose={dialog.close}
                collection={collection}
            />
        </div>
    );
}

export default function CollectionsArchive(props: ICollectionsStash) {
    const collections = useCollections().filter((collection) =>
        Boolean(collection.archived_at)
    );
    return (
        <Dialog.Content className="flex flex-1 flex-row overflow-x-auto overflow-y-hidden">
            {collections
                .map((collection) => (
                    <Collection key={collection.id} collection={collection} />
                ))
                .toList()}
        </Dialog.Content>
    );
}
