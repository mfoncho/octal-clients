import React, { useState } from "react";
//import Switch from "@material-ui/core/Switch";
import { useDispatch } from "react-redux";
import { Dialog, Button, Switch, Textarea, UIEvent } from "@octal/ui";
import * as Icons from "@octal/icons";
import { useInput } from "src/utils";
import { useNavigator } from "src/hooks";
import { createSpace } from "@octal/store/lib/actions/space";

interface ISpaceCreator {
    open: boolean;
    onClose: () => void;
}

interface IInput {
    label: string;
    value: string;
    onChange: (value: UIEvent) => void;
    subheader?: string;
    placeholder?: string;
}

const accessDescription = {
    public: "Everyone in the space workspace can join and leave the space as they please. Other must be invited to join the space",
    private:
        "Space will be visible only to space members. Others can join the space by invition or adding them from the space workspace",
};

function Input(props: IInput) {
    return (
        <div className="flex flex-col py-2">
            <span className="font-semibold text-xs">{props.label}</span>
            <Textarea.Input
                value={props.value}
                onChange={props.onChange}
                placeholder={props.placeholder}
                className="form-input rounded-md text-base"
            />
            <span className="text-xs text-gray-500">{props.subheader}</span>
        </div>
    );
}

export default React.memo<ISpaceCreator>((props) => {
    const nav = useNavigator();
    const dispatch = useDispatch();

    const [access, setAccess] = useState<"public" | "private">("public");

    const name = useInput("");

    const topic = useInput("");

    const [creating, setCreating] = useState<boolean>(false);

    function handleCreateSpace(event: React.MouseEvent) {
        event.preventDefault();
        event.stopPropagation();
        let payload: any = {
            name: name.value,
            access: access,
            topic: topic.value,
        };
        const action = createSpace(payload);
        dispatch(action)
            .then((space) => {
                setCreating(false);
                nav.openSpace(space);
                name.setValue("");
                topic.setValue("");
            })
            .then(props.onClose);
        setCreating(true);
    }

    function toggleAccess() {
        if (access == "public") {
            setAccess("private");
        } else if (access == "private") {
            setAccess("public");
        }
    }

    return (
        <Dialog
            title="Create space"
            maxWidth="xs"
            open={props.open}
            fullWidth={false}
            fullHeight={false}
            onClose={creating ? undefined : props.onClose}>
            <Dialog.Content className="flex flex-col overflow-y-auto">
                <Input label="Name" placeholder="name" {...name.props} />

                <Input
                    label="Topic"
                    placeholder="topic"
                    subheader="Main space topic"
                    {...topic.props}
                />

                <div className="flex flex-col py-4">
                    <div className="flex flex-row items-center">
                        <Icons.Private className="text-gray-500" />
                        <span className="font-semibold px-2 flex-grow text-xs">
                            Private
                        </span>
                        <Switch
                            checked={access == "private"}
                            onChange={toggleAccess}
                        />
                    </div>
                    <span className="font-semibold text-xs text-gray-500 py-2">
                        {accessDescription[access]}
                    </span>
                </div>
            </Dialog.Content>
            <Dialog.Actions>
                <Button
                    color="primary"
                    onClick={handleCreateSpace}
                    disabled={!name.valid || !topic.valid}>
                    Create
                </Button>
            </Dialog.Actions>
        </Dialog>
    );
});
