import React, { useState, useCallback, useEffect } from "react";
import { Dialog } from "@colab/ui";
import PerfectScrollbar from "react-perfect-scrollbar";
import Drawer from "./Drawer";
import Header from "./Header";
import Fields from "./Fields";
import { useDispatch } from "react-redux";
import { useDrawer } from "./hooks";
import ActionsField from "./ActionsField";
import { Context } from "@workspace/Catalog/Record";
import { useAuthId, useRecord, Actions } from "@colab/store";
import { useScreen } from "src/hooks";
import { RecordRecord } from "@colab/store";

export * from "./hooks";

interface IRecord {
    id: string;
    open: boolean;
    onClose: (e: any) => void;
}

interface IPreRecord {
    id: string;
    open: boolean;
    onClose: (e: any, reason: string) => void;
}

interface IRecordDialog {
    open: boolean;
    record: RecordRecord;
    onClose: (e: any, reason: string) => void;
}

interface ILoadingDialog {
    open: boolean;
    onClose: (e: any, reason: string) => void;
}

const scrollerOptions = {
    suppressScrollX: true,
    suppressScrollY: false,
};

export const RecordDialog = React.memo<IRecordDialog>(
    ({ record, onClose, open }) => {
        const screen = useScreen();

        const [, drawerActions] = useDrawer(record.id);

        let editable = record.user_id == useAuthId();

        const archived = Boolean(record.archived_at);

        editable = editable && !archived;

        const handleCloseDialog = useCallback(() => {
            onClose({}, "closed dialog");
        }, [record.id]);

        useEffect(() => {
            // Show the record thread on
            // bigger screen by default
            if (
                record.id &&
                record.thread_id &&
                (screen.tablet || screen.desktop)
            ) {
                drawerActions.open({
                    id: record.id,
                    type: "thread",
                    thread_id: record.thread_id,
                });
            }
        }, [record.id, screen.tablet, screen.desktop]);

        useEffect(() => {
            if (record.id) {
                return () => {
                    // Close record drawer on unmount
                    drawerActions.close({ type: "", id: "" });
                };
            }
        }, [record.id]);

        return (
            <Dialog.Base
                open={open}
                onClose={onClose}
                maxWidth="md"
                fullWidth={true}
                className="h-5/6"
                fullScreen={screen.mobile}>
                <Header record={record} onClose={handleCloseDialog} />

                <div className="flex flex-row flex-grow overflow-hidden">
                    <div className="flex flex-1 flex-col pb-8">
                        <PerfectScrollbar
                            options={scrollerOptions}
                            className="flex px-4 sm:px-8 flex-grow flex-col">
                            <ActionsField
                                record={record}
                                onClose={handleCloseDialog}
                            />
                            <Fields key={record.id} record={record} />
                        </PerfectScrollbar>
                    </div>
                    <Drawer id={record.id} />
                </div>
            </Dialog.Base>
        );
    }
);

function LoadDialog({ open, onClose }: ILoadingDialog) {
    const screen = useScreen();
    return (
        <Dialog
            title=""
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullHeight={true}
            fullWidth={true}
            fullScreen={screen.mobile}></Dialog>
    );
}

const RecordLoader = React.memo<IPreRecord>((props: IPreRecord) => {
    const record = useRecord(props.id);
    const dispatch = useDispatch();
    useEffect(() => {
        if (props.id !== record?.id) {
            const action = Actions.Catalog.loadRecord({ record_id: props.id });
            dispatch(action);
        }
    }, [record?.id]);
    if (record && record?.id === props.id) {
        return (
            <Context record={record}>
                <RecordDialog
                    open={props.open}
                    record={record}
                    onClose={props.onClose}
                />
            </Context>
        );
    }
    return <LoadDialog open={props.open} onClose={props.onClose} />;
});

export default React.memo<IRecord>(({ id, onClose, ...props }) => {
    const [open, setOpen] = useState(props.open);

    const handleClose = useCallback(
        (e: any) => {
            setOpen(false);
            // Close after animation timeout
            setTimeout(() => onClose(e), 200);
        },
        [id]
    );

    useEffect(() => {
        if (props.open === false && open) {
            handleClose({});
        } else if (props.open && open === false) {
            setOpen(true);
        }
    }, [props.open]);

    if (props.open || open) {
        return (
            <RecordLoader
                id={id}
                open={props.open && open}
                onClose={handleClose}
            />
        );
    } else {
        return <React.Fragment />;
    }
});
