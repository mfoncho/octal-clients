import React, { useState, useEffect } from "react";
import * as Icons from "@colab/icons";
import { Dialog, Button } from "@colab/ui";
import { useParams } from "react-router-dom";
import Layout from "@console/Layout";
import client from "@console/client";
import { io } from "@console/types";
import { useNavigator } from "@console/hooks";
import Topics from "./Topics";
import Boards from "./Boards";
import Members from "./Members";

interface IWarning {
    onConfirm: (e: React.MouseEvent) => void;
    loading: boolean;
    space: io.Space;
}

function warningText(space: io.Space) {
    return `Delete __${space.name}__, All data assiciated with this space will be lost permanently.`;
}

const WarningDialog = Dialog.create<IWarning>((props) => {
    return (
        <Dialog.Warning
            open={props.open}
            title="Delete Space"
            confirm="Delete"
            onClose={props.onClose}
            disabled={props.loading}
            onConfirm={props.onConfirm}>
            {warningText(props.space)}
        </Dialog.Warning>
    );
});

export default React.memo(() => {
    const [loading, setLoading] = useState(false);
    const dialog = Dialog.useDialog();
    const navigator = useNavigator();
    const params = useParams<{ space_id: string }>();
    const [space, setSpace] = useState<io.Space>();

    useEffect(() => {
        if (!space) {
            getSpace();
        }
    }, [Boolean(space)]);

    async function getSpace() {
        return client
            .getSpace(params as any)
            .then((data) => setSpace(data))
            .catch(() => {});
    }

    if (!space) return <></>;

    async function handleDeleteSpace() {
        setLoading(true);
        return client
            .deleteSpace(params as any)
            .then(navigator.openSpaces)
            .catch(() => setLoading(false));
    }

    async function handleRestoreSpace() {
        setLoading(true);
        return client
            .restoreSpace(params as any)
            .then((data) => setSpace(data))
            .catch(() => {})
            .finally(() => setLoading(false));
    }

    const icon = (
        <div className="w-8 h-8 flex justify-center items-center text-white bg-primary-500 rounded-md">
            <Icons.Space />
        </div>
    );
    return (
        <Layout
            icon={icon}
            title={space.name}
            className="bg-slate-200 block p-4 space-y-6 overflow-y-auto">
            <Boards space={space} />
            <Topics space={space} />
            <Members space={space} updateSpace={setSpace} />
            <WarningDialog
                onConfirm={handleDeleteSpace}
                loading={loading}
                space={space}
                open={dialog.destroy}
                onClose={dialog.close}
            />
            {space.is_shutdown && (
                <div className="flex flex-row justify-end py-4">
                    <Button
                        color="primary"
                        disabled={loading}
                        className="mx-2"
                        onClick={handleRestoreSpace}>
                        Restore
                    </Button>
                    <Button
                        disabled={loading}
                        color="danger"
                        onClick={dialog.opener("destroy")}>
                        Delete
                    </Button>
                </div>
            )}
        </Layout>
    );
});
