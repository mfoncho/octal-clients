import React from "react";
import Dialog from "../Dialog";
import Button from "../Button";
import Markdown from "../Markdown";

interface IDialog {
    children: React.ReactNode;
    open: boolean;
    title?: string;
    confirm?: string;
    loading?: boolean;
    disabled?: boolean;
    onClose?: (e: any, reason: string) => any | void;
    onConfirm: (e: React.MouseEvent) => any | void;
}

export default React.memo<IDialog>(
    ({
        children,
        title = "",
        loading = false,
        confirm = "Confirm",
        ...props
    }) => {
        return (
            <Dialog
                title={title}
                fullWidth={false}
                open={props.open}
                onClose={loading ? undefined : props.onClose}>
                <Dialog.Content>
                    {typeof children == "string" ? (
                        <div className="pb-4 text-base text-gray-800">
                            <Markdown>{children}</Markdown>
                        </div>
                    ) : (
                        children
                    )}
                </Dialog.Content>

                <Dialog.Actions>
                    <Button
                        color="clear"
                        className="mx-4 border border-gray-300 shadow-sm"
                        onClick={(e) =>
                            props.onClose && props.onClose(e, "closed")
                        }
                        disabled={props.disabled || loading}>
                        Cancel
                    </Button>
                    <Button
                        color="danger"
                        onClick={props.onConfirm}
                        disabled={props.disabled || loading}>
                        {confirm}
                    </Button>
                </Dialog.Actions>
            </Dialog>
        );
    }
);
