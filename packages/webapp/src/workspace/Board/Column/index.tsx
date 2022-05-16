import React, { useState } from "react";
import Context from "./Context";
import { Draggable, Droppable } from "react-beautiful-dnd";
import PerfectScrollbar from "react-perfect-scrollbar";
import { Text, Tooltip, Button } from "@octal/ui";
import * as Icons from "@octal/icons";
import { DraggableCard as Card } from "../Card";
import Menu from "./Menu";
import { sort } from "@octal/common";
import UpdateColumnDialog from "./UpdateDialog";
import CreateCardPopper from "./CreateCardPopper";
import StashColumnWarningDialog from "./StashColumnWarningDialog";
import { ColumnRecord, CardRecord } from "@octal/store";
import { useDragged } from "../hooks";
import { usePermissions } from "@workspace/Space";
import { useColumnCards } from "@octal/store";
export { default as Context } from "./Context";

interface IColumn {
    handle: any;
    column: ColumnRecord;
}

const positionSort = sort("position", "asc");

const Column = React.memo<IColumn>(({ column, handle }) => {
    const dragged = useDragged();

    const permissions = usePermissions();

    const [cardCreatorAnchorEl, setCardCreatorAnchorEl] =
        useState<HTMLElement | null>(null);

    const [dialog, setDialog] = useState<string | null>(null);

    const cards = useColumnCards(column.id).sort(positionSort);

    const [menuAnchorEl, setMenuAnchorEl] = useState<HTMLElement | null>(null);

    function handleCloseMenu() {
        setMenuAnchorEl(null);
    }

    function handleCloseDialog() {
        setDialog("");
    }

    function renderCard(card: CardRecord, index: number) {
        return (
            <Card
                key={card.id}
                index={index}
                card={card}
                draggable={permissions.manage_board.value}
            />
        );
    }

    function handleOpenCreateCardDialog(e: React.MouseEvent) {
        let button = e.target as Node & Element;
        while (button.nodeName != "BUTTON") {
            button = button.parentNode as Node & Element;
        }

        setCardCreatorAnchorEl(button as HTMLButtonElement);
    }

    function handleCloseCardCreator() {
        setCardCreatorAnchorEl(null);
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

    const canManageBoard = permissions.manage_board.value;

    const isFull = cards.size >= column.capacity;

    const droppableId = `column:${column.id}`;

    const isDragging = droppableId == dragged?.draggableId;

    const dropDisabled =
        (isFull && dragged && dragged.source.droppableId !== droppableId) ||
        !canManageBoard;

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
                    className="flex px-3 py-1 flex-row items-center justify-between rounded shadow bg-primary-100 m-1">
                    <button
                        onClick={canManageBoard ? handleOpenMenu : undefined}
                        className="flex flex-row items-center">
                        <span className="px-2 text-gray-800 font-semibold">
                            <Text>{column.name}</Text>
                        </span>
                    </button>
                    <div className="flex flex-row items-center justify-end">
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
                            column.origin &&
                            permissions.create_card && (
                                <Button
                                    variant="icon"
                                    color="clear"
                                    onClick={handleOpenCreateCardDialog}>
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
                        type="card"
                        direction="vertical"
                        droppableId={droppableId}
                        isDropDisabled={Boolean(dropDisabled)}>
                        {(provided) => (
                            <div
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                                className="flex pb-12 flex-col pt-3 flex-grow">
                                {cards.toList().map(renderCard)}
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
            <CreateCardPopper
                open={Boolean(cardCreatorAnchorEl)}
                anchorEl={cardCreatorAnchorEl}
                onClose={handleCloseCardCreator}
                onClickAway={handleCloseCardCreator}
                column={column}
            />
            <UpdateColumnDialog
                open={dialog == "edit"}
                column={column}
                onClose={handleCloseDialog}
            />
            <StashColumnWarningDialog
                open={dialog == "stash"}
                column={column}
                onClose={handleCloseDialog}
            />
        </React.Fragment>
    );
});

interface IColumnMain {
    index: number;
    column: ColumnRecord;
}

export default React.memo<IColumnMain>(({ column, index }) => {
    const permissions = usePermissions();

    return (
        <Draggable
            index={index}
            isDragDisabled={!permissions.manage_board.value}
            draggableId={`column:${column.id}`}>
            {(provided) => (
                <div
                    {...provided.draggableProps}
                    ref={provided.innerRef}
                    className="flex flex-row p-3">
                    <Context column={column}>
                        <Column
                            column={column}
                            handle={provided.dragHandleProps}
                        />
                    </Context>
                </div>
            )}
        </Draggable>
    );
});
