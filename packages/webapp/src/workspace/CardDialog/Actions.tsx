import React, { useRef } from "react";
import * as Icons from "@colab/icons";
import TrackersDialog from "./TrackersDialog";
import TemplateDialog from "./TemplateDialog";
import { MdOutlineTrackChanges as TrackerIcon } from "react-icons/md";
import { BsChatSquareTextFill as ThreadIcon } from "react-icons/bs";
import { BsCheckCircleFill as DoneIcon } from "react-icons/bs";
import { Dialog, Button } from "@colab/ui";
import { CardRecord, useTrackers } from "@colab/store";
import { useActions, useCardCapability } from "./hooks";
import { useDrawer } from "./hooks";
import Warning from "./DeleteWarning";

interface IActions {
    card: CardRecord;
    onClose: (e: React.MouseEvent) => void;
}

export default function Actions({ card, ...props }: IActions) {
    const can = useCardCapability(card.id);
    const events = useTrackers(card.id);
    const dialog = Dialog.useDialog("");
    const rootRef = useRef<HTMLDivElement>(null);
    const [_drawer, drawerActions] = useDrawer(card.id);

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
        <div
            className="flex flex-row items-center space-x-2 px-2"
            ref={rootRef}>
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
            {can("card.track") && (
                <Button variant="icon" onClick={dialog.opener("trackers")}>
                    <TrackerIcon
                        className={
                            events.isEmpty()
                                ? "text-gray-500"
                                : "text-green-500"
                        }
                    />
                </Button>
            )}
            {can("board.manage") && (
                <Button variant="icon" onClick={dialog.opener("template")}>
                    <Icons.Template className="text-gray-500" />
                </Button>
            )}
            {can("card.manage") && (
                <Button variant="icon" onClick={handleToggleComplete}>
                    <DoneIcon
                        className={
                            card.complete ? "text-green-500" : "text-gray-500"
                        }
                    />
                </Button>
            )}
            {can("card.delete") && (
                <Button variant="icon" onClick={dialog.opener("warning")}>
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
            <TemplateDialog
                card={card}
                open={dialog.template}
                onClose={dialog.close}
            />
        </div>
    );
}
