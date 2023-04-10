import React, { useState } from "react";
import * as Icons from "@colab/icons";
import { Dialog, Text, Textarea, Button } from "@colab/ui";
import { CatalogRecord } from "@colab/store/lib/records";
import { useInput } from "src/utils";
import { useCatalogActions } from "./hooks";

interface IRenameTopicDialog {
    catalog: CatalogRecord;
}

export default Dialog.create<IRenameTopicDialog>((props) => {
    const actions = useCatalogActions();
    const [loading, setLoading] = useState(false);

    const name = useInput(props.catalog.name);

    function handleRenameCatalog(e: React.MouseEvent) {
        e.stopPropagation();
        e.preventDefault();
        setLoading(true);
        actions
            .updateCatalog({
                name: name.value.trim(),
            })
            .then(() => {
                props.onClose(e);
            })
            .catch(() => setLoading(false));
    }

    return (
        <Dialog.Base
            open={props.open}
            fullScreen={false}
            maxWidth="xs"
            className="flex flex-col"
            fullWidth={true}
            onClose={props.onClose}>
            <div className="flex max-w-full flex-none flex-row h-20 px-6 items-center justify-between">
                <div className="flex flex-row items-center overflow-hidden">
                    <Icons.Board className="h-6 w-6 text-primary-500" />
                    <span className="font-extrabold truncate text-xl px-2 text-gray-800">
                        <Text>{name.value.trim()}</Text>
                    </span>
                </div>
                <button
                    className="ml-2 rounded-md hover:bg-gray-200 w-8 h-8 flex justify-center items-center"
                    onClick={props.onClose}>
                    <Icons.Close />
                </button>
            </div>
            <Dialog.Content className="flex flex-col">
                <div className="relative flex flex-row">
                    <Textarea.Input
                        disabled={loading}
                        className="form-input focus:ring text-base font-semibold w-full text-gray-800 rounded-md border-gray-400"
                        {...name.props}
                    />
                </div>
            </Dialog.Content>
            <Dialog.Actions className="rounded-b-lg">
                <Button
                    disabled={
                        name.value.trim() === props.catalog.name.trim() ||
                        loading
                    }
                    onClick={handleRenameCatalog}
                    color="primary">
                    Save
                </Button>
            </Dialog.Actions>
        </Dialog.Base>
    );
});
