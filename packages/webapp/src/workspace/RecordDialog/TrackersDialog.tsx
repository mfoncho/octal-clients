import React from "react";
import { Switch, Dialog } from "@colab/ui";
import { RecordRecord, useTrackers } from "@colab/store";
import { useActions } from "./hooks";
import { useTrackerActions } from "@workspace/hooks";

interface ITracker {
    name: string;
    event: string;
    target: string;
    description: string;
}

const actionName = (tracker: { event: string; target: string }) =>
    `${tracker.target}:${tracker.event}`;

const trackers: ITracker[] = [
    {
        name: "Record Complete",
        event: "complete",
        target: "record",
        description: "Track record complete status",
    },
    {
        name: "Tasks Done",
        target: "record.checklist.task",
        event: "done",
        description: "Track task done status",
    },
    {
        name: "Ranking",
        target: "record.index",
        event: "change",
        description: "Track record ranking within collection",
    },
    {
        name: "Collection",
        target: "record.collection",
        event: "change",
        description: "Track record collection changes",
    },
    {
        name: "Checklist Complete",
        target: "record.checklist",
        event: "complete",
        // I don't really know how to word this
        // but i hope this lands
        description: "Track checklist with all tasks done",
    },
];

interface IDialog {
    record: RecordRecord;
}

export default Dialog.create<IDialog>(({ record, ...props }) => {
    const trackerActions = useTrackerActions(record.id);

    function handleToggleTracker(tracker: ITracker, event: React.ChangeEvent) {
        let tracked = trackerActions.trackers.has(actionName(tracker));
        if (tracked) {
            trackerActions.untrack(tracker.target, tracker.event);
        } else {
            trackerActions.track(tracker.target, tracker.event);
        }
        event.stopPropagation();
        event.preventDefault();
    }

    return (
        <Dialog
            title="Record Trackers"
            maxWidth="xs"
            open={props.open}
            fullWidth={false}
            onClose={props.onClose}>
            <Dialog.Content className="flex flex-col pb-8">
                {trackers.map((tracker, index) => (
                    <div
                        key={String(index)}
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
                            checked={trackerActions.trackers.has(
                                actionName(tracker)
                            )}
                            onChange={(e) => handleToggleTracker(tracker, e)}
                        />
                    </div>
                ))}
            </Dialog.Content>
        </Dialog>
    );
});
