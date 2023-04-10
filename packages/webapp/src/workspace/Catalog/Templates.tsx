import React from "react";
import * as Icons from "@colab/icons";
import { Button, Dialog, Text } from "@colab/ui";
import { CatalogRecord } from "@colab/store";
import { useCatalogActions } from "./hooks";
import { usePermissions } from "../Space";

interface IDialog {
    catalog: CatalogRecord;
}

export default Dialog.create<IDialog>((props) => {
    const [loading, setLoading] = React.useState<string[]>([]);

    const actions = useCatalogActions();

    const permissions = usePermissions();

    function handleDeleteTemplate(id: string) {
        actions.deleteRecordTemplate(id).finally(() => {
            setLoading((loading) => loading.filter((lid) => lid !== id));
        });
        setLoading((loading) => loading.concat([id]));
    }

    return (
        <Dialog
            title="Templates"
            maxWidth="xs"
            open={props.open}
            fullWidth={true}
            fullHeight={true}
            onClose={props.onClose}>
            <div className="flex flex-col pb-8 border divide-y divider-gray-200">
                {props.catalog.templates.map((template) => (
                    <div
                        key={template.id}
                        className="group flex flex-col hover:bg-primary-500 px-6 py-2">
                        <div className="flex flex-row items-center justify-between">
                            <div className="flex flex-col">
                                <div className="group-hover:text-white font-black text-gray-800">
                                    <Text>{template.name}</Text>
                                </div>
                                <div className="flex flex-row items-center space-x-2">
                                    <div className="group-hover:text-white text-gray-700 text-sm">
                                        fields
                                    </div>
                                    <div className="font-bold text-gray-700 rounded-md bg-slate-200 w-6 h-4 text-center text-xs">
                                        {template.fields.size}
                                    </div>
                                </div>
                            </div>
                            <div>
                                {permissions.get("catalog.manage") && (
                                    <Button
                                        onClick={() =>
                                            handleDeleteTemplate(template.id)
                                        }
                                        variant="icon"
                                        disabled={loading.includes(template.id)}
                                        color="clear">
                                        <Icons.Delete className="group-hover:text-white" />
                                    </Button>
                                )}
                            </div>
                        </div>
                        <div className="text-sm text-gray-500 group-hover:text-gray-200 font-semibold">
                            <Text>{template.description}</Text>
                        </div>
                    </div>
                ))}
            </div>
        </Dialog>
    );
});
