import React from "react";
import { Button, Dialog, Textarea } from "@colab/ui";
import { RecordRecord } from "@colab/store";
import { useCatalogActions } from "../Catalog/hooks";
import { useInput } from "src/utils";

interface IDialog {
    record: RecordRecord;
}

export default Dialog.create<IDialog>(({ record, ...props }) => {
    const [loading, setLoading] = React.useState<boolean>(false);

    const name = useInput("");

    const description = useInput("");

    const actions = useCatalogActions();

    function createTemplate(e: any) {
        let fields = record.fields
            .map((field) => {
                return {
                    name: field.name,
                    type: field.type,
                };
            })
            .toArray();
        setLoading(true);
        actions
            .createRecordTemplate(name.value, description.value, fields)
            .then(() => {
                props.onClose(e);
            })
            .catch(() => setLoading(false));
    }

    return (
        <Dialog
            title="Create Template"
            maxWidth="xs"
            open={props.open}
            fullWidth={true}
            onClose={props.onClose}>
            <Dialog.Content className="flex flex-col pb-8 space-y-2">
                <div className="relative flex flex-col">
                    <span className="py-2 text-xs font-bold text-gray-700 uppercase">
                        name
                    </span>
                    <Textarea.Input
                        disabled={loading}
                        className="form-input focus:ring focus:shadow text-base font-semibold w-full text-gray-800 rounded-md border border-gray-400"
                        {...name.props}
                    />
                </div>
                <div className="relative flex flex-col">
                    <span className="py-2 text-xs font-bold text-gray-700 uppercase">
                        description
                    </span>
                    <Textarea.Input
                        disabled={loading}
                        className="form-input focus:ring focus:shadow text-base font-semibold w-full text-gray-800 rounded-md border border-gray-400"
                        {...description.props}
                    />
                </div>
            </Dialog.Content>
            <Dialog.Actions className="rounded-b-lg">
                <Button
                    disabled={
                        !name.valid ||
                        !description.valid ||
                        loading ||
                        record.fields.isEmpty()
                    }
                    onClick={createTemplate}
                    color="primary">
                    Create
                </Button>
            </Dialog.Actions>
        </Dialog>
    );
});
