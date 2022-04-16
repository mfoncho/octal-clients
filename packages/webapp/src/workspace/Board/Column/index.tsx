import React, { useState } from "react";
import Context from "./Context";
import AddIcon from "@material-ui/icons/Add";
import FullIcon from "@material-ui/icons/HourglassFull";
import { Draggable, Droppable } from "react-beautiful-dnd";
import PerfectScrollbar from "react-perfect-scrollbar";
import { Tooltip, Button } from "@octal/ui";
import * as Icons from "@octal/icons";
import { DraggableCard as Card } from "../Card";
import Menu from "./Menu";
import { sort } from "@octal/common";
import UpdateColumnDialog from "./UpdateDialog";
import CreateCardPopper from "./CreateCardPopper";
import ArchiveColumnWarningDialog from "./ArchiveColumnWarningDialog";
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
                        ? "flex flex-col overflow-hidden bg-gray-50 shadow-md"
                        : "flex flex-col overflow-hidden"
                }
                style={{ width: "315px" }}>
                <div
                    {...handle}
                    className="flex px-3 py-2 flex-row items-center justify-between">
                    <button
                        onClick={canManageBoard ? handleOpenMenu : undefined}
                        className="flex flex-row items-center">
                        <Tooltip
                            placement="top"
                            title={
                                <span className="font-semibold">
                                    {column.type}
                                </span>
                            }>
                            <>
                                {column.type == "stack" && (
                                    <Icons.Stack className="text-gray-600" />
                                )}
                                {column.type == "queue" && (
                                    <Icons.Queue className="text-gray-600" />
                                )}
                            </>
                        </Tooltip>
                        <span className="px-2 text-gray-800 font-semibold">
                            {column.name}
                        </span>
                    </button>
                    <div className="flex flex-row items-center justify-end">
                        {isFull ? (
                            <Tooltip
                                placement="top"
                                title={
                                    <span className="font-semibold">Full</span>
                                }>
                                <FullIcon className="text-gray-500" />
                            </Tooltip>
                        ) : (
                            column.origin &&
                            permissions.create_card && (
                                <Button
                                    variant="icon"
                                    color="clear"
                                    onClick={handleOpenCreateCardDialog}>
                                    <AddIcon />
                                </Button>
                            )
                        )}
                    </div>
                </div>
                <PerfectScrollbar
                    className="flex flex-col px-3 "
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
                                className="flex pb-12 flex-col pt-0.5 flex-grow">
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
            <ArchiveColumnWarningDialog
                open={dialog == "archive"}
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
