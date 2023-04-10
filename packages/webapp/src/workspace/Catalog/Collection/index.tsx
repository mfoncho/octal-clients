import React, { useState } from "react";
import Context from "./Context";
import { Draggable, Droppable } from "react-beautiful-dnd";
import PerfectScrollbar from "react-perfect-scrollbar";
import { Text, Tooltip, Button } from "@colab/ui";
import * as Icons from "@colab/icons";
import { DraggableRecord as Record } from "../Record";
import Menu from "./Menu";
import { sort } from "@colab/common";
import UpdateCollectionDialog from "./UpdateDialog";
import CreateRecordPopper from "./CreateRecordPopper";
import StashCollectionWarningDialog from "./StashCollectionWarningDialog";
import { CollectionRecord, RecordRecord } from "@colab/store";
import { useDragged, useCatalog } from "../hooks";
import { usePermissions } from "@workspace/Space";
import { useCollectionRecords } from "@colab/store";
export { default as Context } from "./Context";

interface ICollection {
    handle: any;
    collection: CollectionRecord;
}

const positionSort = sort("index", "asc");

const Collection = React.memo<ICollection>(({ collection, handle }) => {
    const catalog = useCatalog();

    const dragged = useDragged();

    const permissions = usePermissions();

    const [recordCreatorAnchorEl, setRecordCreatorAnchorEl] =
        useState<HTMLElement | null>(null);

    const [dialog, setDialog] = useState<string | null>(null);

    const records = useCollectionRecords(collection.id).sort(positionSort);

    const [menuAnchorEl, setMenuAnchorEl] = useState<HTMLElement | null>(null);

    function handleCloseMenu() {
        setMenuAnchorEl(null);
    }

    function handleCloseDialog() {
        setDialog("");
    }

    function renderRecord(record: RecordRecord, index: number) {
        return (
            <Record
                key={record.id}
                index={index}
                record={record}
                draggable={permissions.get("catalog.manage") as boolean}
            />
        );
    }

    function handleOpenCreateRecordDialog(e: React.MouseEvent) {
        let button = e.target as Node & Element;
        while (button.nodeName != "BUTTON") {
            button = button.parentNode as Node & Element;
        }

        setRecordCreatorAnchorEl(button as HTMLButtonElement);
    }

    function handleCloseRecordCreator() {
        setRecordCreatorAnchorEl(null);
    }

    function handleOpenMenu(event: React.MouseEvent<HTMLButtonElement>) {
        setMenuAnchorEl(event.currentTarget as HTMLElement);
    }

    function handleMenuItemClick(e: React.MouseEvent) {
        let li = e.target as Node & Element;
        while (li.nodeName != "LI") {
            li = li.parentNode as Node & Element;
        }
        const dialog = li.getAttribute("data-menu-name");
        setDialog(dialog);
    }

    const renderedRecords = (
        catalog.filter.valid
            ? records.filter((record) => catalog.filter.test(record))
            : records
    )
        .toList()
        .map(renderRecord);

    const canManageCatalog = permissions.get("catalog.manage");

    const isFull = records.size >= collection.capacity;

    const droppableId = `collection:${collection.id}`;

    const isDragging = droppableId == dragged?.draggableId;

    const filtered = renderedRecords.size != records.size;

    const dropDisabled =
        (isFull && dragged && dragged.source.droppableId !== droppableId) ||
        !canManageCatalog ||
        filtered;

    return (
        <React.Fragment>
            <div
                className={
                    isDragging
                        ? "w-[315px] flex flex-col overflow-hidden bg-gray-50 shadow-md p-2"
                        : "w-[315px] flex flex-col overflow-hidden p-2"
                }>
                <div
                    {...handle}
                    className="flex p-1 flex-row items-center justify-between rounded shadow bg-primary-100 m-1 h-10">
                    <button
                        onClick={canManageCatalog ? handleOpenMenu : undefined}
                        className="flex flex-row items-center">
                        <span className="px-2 text-gray-800 font-semibold">
                            <Text>{collection.name}</Text>
                        </span>
                    </button>
                    <div className="flex flex-row items-center justify-end">
                        {filtered && <Icons.Filter className="text-gray-700" />}
                        {isFull ? (
                            <Tooltip
                                placement="top"
                                title={
                                    <span className="font-semibold">Full</span>
                                }>
                                <Button
                                    variant="icon"
                                    disabled={true}
                                    color="clear">
                                    <Icons.Full />
                                </Button>
                            </Tooltip>
                        ) : (
                            collection.origin &&
                            permissions.get("record.create") && (
                                <Button
                                    color="clear"
                                    variant="icon"
                                    onClick={handleOpenCreateRecordDialog}>
                                    <Icons.Plus />
                                </Button>
                            )
                        )}
                    </div>
                </div>
                <PerfectScrollbar
                    className="flex flex-col px-2"
                    style={{ maxHeight: "100%" }}>
                    <Droppable
                        type="record"
                        direction="vertical"
                        droppableId={droppableId}
                        isDropDisabled={Boolean(dropDisabled)}>
                        {(provided) => (
                            <div
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                                className="flex pb-12 flex-col pt-3 flex-grow">
                                {renderedRecords}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </PerfectScrollbar>
            </div>
            <Menu
                open={Boolean(menuAnchorEl)}
                anchorEl={menuAnchorEl}
                onClickAway={handleCloseMenu}
                onSelect={handleMenuItemClick}
            />
            <CreateRecordPopper
                open={Boolean(recordCreatorAnchorEl)}
                anchorEl={recordCreatorAnchorEl}
                onClose={handleCloseRecordCreator}
                onClickAway={handleCloseRecordCreator}
                collection={collection}
            />
            <UpdateCollectionDialog
                open={dialog == "edit"}
                collection={collection}
                onClose={handleCloseDialog}
            />
            <StashCollectionWarningDialog
                open={dialog == "stash"}
                collection={collection}
                onClose={handleCloseDialog}
            />
        </React.Fragment>
    );
});

interface ICollectionMain {
    index: number;
    collection: CollectionRecord;
}

export default React.memo<ICollectionMain>(({ collection, index }) => {
    const permissions = usePermissions();

    return (
        <Draggable
            index={index}
            isDragDisabled={!permissions.get("catalog.manage")}
            draggableId={`collection:${collection.id}`}>
            {(provided) => (
                <div
                    {...provided.draggableProps}
                    ref={provided.innerRef}
                    className="flex flex-row pt-0 p-3">
                    <Context collection={collection}>
                        <Collection
                            collection={collection}
                            handle={provided.dragHandleProps}
                        />
                    </Context>
                </div>
            )}
        </Draggable>
    );
});
