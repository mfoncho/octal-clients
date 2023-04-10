import React, { useRef } from "react";
import * as Icons from "@colab/icons";
import TrackersDialog from "./TrackersDialog";
import TemplateDialog from "./TemplateDialog";
import { Dialog, Button } from "@colab/ui";
import { RecordRecord, useTrackers } from "@colab/store";
import { useActions, useRecordCapability } from "./hooks";
import { useDrawer } from "./hooks";
import Warning from "./DeleteWarning";

interface IActions {
    record: RecordRecord;
    onClose: (e: React.MouseEvent) => void;
}

export default function Actions({ record, ...props }: IActions) {
    const can = useRecordCapability(record.id);
    const events = useTrackers(record.id);
    const dialog = Dialog.useDialog("");
    const rootRef = useRef<HTMLDivElement>(null);
    const [_drawer, drawerActions] = useDrawer(record.id);

    const actions = useActions(record);

    function handleDeleteRecord(e: React.MouseEvent) {
        actions.destroyRecord();
        props.onClose(e);
    }

    function handleToggleComplete(e: React.MouseEvent) {
        e.stopPropagation();
        e.preventDefault();
        if (record.complete) {
            actions.uncompleteRecord();
        } else {
            actions.completeRecord();
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
                        id: record.id,
                        type: "thread",
                        thread_id: record.thread_id,
                    })
                }>
                <Icons.Chat className="text-gray-500" />
            </Button>
            {can("record.track") && (
                <Button variant="icon" onClick={dialog.opener("trackers")}>
                    <Icons.Tracker
                        className={
                            events.isEmpty()
                                ? "text-gray-500"
                                : "text-green-500"
                        }
                    />
                </Button>
            )}
            {can("catalog.manage") && (
                <Button variant="icon" onClick={dialog.opener("template")}>
                    <Icons.Template className="text-gray-500" />
                </Button>
            )}
            {can("record.manage") && (
                <Button variant="icon" onClick={handleToggleComplete}>
                    <Icons.CheckedDot
                        className={
                            record.complete ? "text-green-500" : "text-gray-500"
                        }
                    />
                </Button>
            )}
            {can("record.delete") && (
                <Button variant="icon" onClick={dialog.opener("warning")}>
                    <Icons.Delete className="text-gray-500" />
                </Button>
            )}
            <Warning
                open={dialog.warning}
                record={record}
                onClose={dialog.close}
                onConfirm={handleDeleteRecord}
            />
            <TrackersDialog
                record={record}
                open={dialog.trackers}
                onClose={dialog.close}
            />
            <TemplateDialog
                record={record}
                open={dialog.template}
                onClose={dialog.close}
            />
        </div>
    );
}
