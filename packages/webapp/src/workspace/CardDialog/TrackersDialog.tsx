import React from "react";
import { Switch, Dialog } from "@octal/ui";
import { CardRecord, useTrackers } from "@octal/store";
import { useActions } from "./hooks";

interface ITracker {
    name: string;
    event: string;
    description: string;
}

const trackers: ITracker[] = [
    {
        name: "Card Complete",
        event: "card:complete",
        description: "Track card complete status",
    },
    {
        name: "Tasks Done",
        event: "card.checklist.task:done",
        description: "Track task done status",
    },
    {
        name: "Ranking",
        event: "card.position:change",
        description: "Track card ranking within collection",
    },
    {
        name: "Collection",
        event: "card.collection:change",
        description: "Track card collection changes",
    },
    {
        name: "Checklist Complete",
        event: "card.checklist:complete",
        // I don't really know how to word this
        // but i hope this lands
        description: "Track checklist with all tasks done",
    },
];

interface IDialog {
    card: CardRecord;
}

export default Dialog.create<IDialog>(({ card, ...props }) => {
    const events = useTrackers(card.id);
    const actions = useActions(card);

    function handleToggleTracker(tracker: string, event: React.ChangeEvent) {
        if (events.includes(tracker)) {
            actions.untrackEvent(tracker);
        } else {
            actions.trackEvent(tracker);
        }
    }

    return (
        <Dialog
            title="Card Trackers"
            maxWidth="xs"
            open={props.open}
            fullWidth={false}
            onClose={props.onClose}>
            <Dialog.Content className="flex flex-col pb-8">
                {trackers.map((tracker) => (
                    <div
                        key={tracker.event}
                        className="flex flex-row items-center p-4 justify-between rounded-md bg-gray-50 my-1 border-2 border-gray-200">
                        <div className="flex flex-col pr-8">
                            <span className="font-semibold">
                                {tracker.name}
                            </span>
                            <span className="text-sm text-gray-500">
                                {tracker.description}
                            </span>
                        </div>

                        <Switch
                            checked={events.includes(tracker.event)}
                            onChange={(e) =>
                                handleToggleTracker(tracker.event, e)
                            }
                        />
                    </div>
                ))}
            </Dialog.Content>
        </Dialog>
    );
});
