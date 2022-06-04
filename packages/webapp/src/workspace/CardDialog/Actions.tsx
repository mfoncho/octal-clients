import React, { useRef } from "react";
import * as Icons from "@octal/icons";
import TrackersDialog from "./TrackersDialog";
import { MdOutlineTrackChanges as TrackerIcon } from "react-icons/md";
import { BsChatSquareTextFill as ThreadIcon } from "react-icons/bs";
import { BsCheckCircleFill as DoneIcon } from "react-icons/bs";
import { Dialog, Button } from "@octal/ui";
import { CardRecord, useTrackers, useAuthId } from "@octal/store";
import { useActions } from "./hooks";
import { usePermissions } from "@workspace/Space";
import { useDrawer } from "./hooks";
import Warning from "./DeleteWarning";

interface IActions {
    card: CardRecord;
    onClose: (e: React.MouseEvent) => void;
}

export default function Actions({ card, ...props }: IActions) {
    const aid = useAuthId();
    const events = useTrackers(card.id);
    const dialog = Dialog.useDialog("");
    const rootRef = useRef<HTMLDivElement>(null);
    const permissions = usePermissions();
    const [drawer, drawerActions] = useDrawer(card.id);
    const owner = card.user_id == aid;
    const canManageBoard = permissions.get("board.manage");

    const actions = useActions(card);

    function handleDeleteCard(e: React.MouseEvent) {
        actions.destroyCard();
        props.onClose(e);
    }

    function handleToggleComplete(e: React.MouseEvent) {
        e.stopPropagation();
        e.preventDefault();
        if (card.complete) {
            actions.uncompleteCard();
        } else {
            actions.completeCard();
        }
    }

    return (
        <div className="flex flex-row items-center" ref={rootRef}>
            <Button
                variant="icon"
                className="sm:hidden ml-2"
                onClick={() =>
                    drawerActions.open({
                        id: card.id,
                        type: "thread",
                        thread_id: card.thread_id,
                    })
                }>
                <ThreadIcon className="text-gray-500" />
            </Button>
            {!card.archived && (
                <Button
                    variant="icon"
                    className="ml-2"
                    onClick={dialog.opener("trackers")}>
                    <TrackerIcon
                        className={
                            events.isEmpty()
                                ? "text-gray-500"
                                : "text-green-500"
                        }
                    />
                </Button>
            )}
            {!card.archived && (
                <Button
                    variant="icon"
                    className="mx-2"
                    disabled={!owner && !canManageBoard}
                    onClick={handleToggleComplete}>
                    <DoneIcon
                        className={
                            card.complete ? "text-green-500" : "text-gray-500"
                        }
                    />
                </Button>
            )}
            {card.archived && canManageBoard && (
                <Button
                    variant="icon"
                    className="mx-2"
                    onClick={dialog.opener("warning")}>
                    <Icons.Delete className="text-gray-500" />
                </Button>
            )}
            <Warning
                open={dialog.warning}
                card={card}
                onClose={dialog.close}
                onConfirm={handleDeleteCard}
            />
            <TrackersDialog
                card={card}
                open={dialog.trackers}
                onClose={dialog.close}
            />
        </div>
    );
}
