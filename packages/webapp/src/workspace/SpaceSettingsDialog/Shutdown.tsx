import React, { useState } from "react";
import { Dialog, Button } from "@octal/ui";
import { SpaceManagerProps } from "./index";
import { useDispatch } from "react-redux";
import Layout from "./Layout";
import { SpaceRecord } from "@octal/store";
import { Actions } from "@octal/store";

interface IWarning {
    onConfirm: (e: React.MouseEvent) => void;
    loading: boolean;
    space: SpaceRecord;
}

function warningText(space: SpaceRecord) {
    return `This space will be inaccessible to all members.

Shuting down __${space.name}__?`;
}

const WarningDialog = Dialog.create<IWarning>((props) => {
    return (
        <Dialog.Warning
            open={props.open}
            title="Shutdown"
            onClose={props.onClose}
            disabled={props.loading}
            onConfirm={props.onConfirm}>
            {warningText(props.space)}
        </Dialog.Warning>
    );
});

const Manager = React.memo(({ space }: SpaceManagerProps) => {
    const dispatch = useDispatch();

    const dialog = Dialog.useDialog();

    const [loading, setLoading] = useState(false);

    function handleShutdownSpace() {
        const action = Actions.Space.shutdownSpace({
            space_id: space.id,
        });
        dispatch(action).finally(() => setLoading(false));
        setLoading(true);
    }

    return (
        <Layout title="Advanced" className="flex flex-col">
            <span>Shutdown space</span>
            <div className="flex flex-row p-4  justify-end">
                <Button
                    onClick={dialog.opener("shutdown")}
                    disabled={loading}
                    color="danger">
                    Shutdown
                </Button>
            </div>
            <WarningDialog
                onClose={dialog.close}
                loading={loading}
                open={dialog.shutdown}
                space={space}
                onConfirm={handleShutdownSpace}
            />
        </Layout>
    );
});

function filter() {
    return true;
}

const name = "Shutdown";

export default {
    name: name,
    filter: filter,
    manager: Manager,
};
