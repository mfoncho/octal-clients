import React, { useState } from "react";
//import Switch from "@material-ui/core/Switch";
import { useDispatch } from "react-redux";
import { Dialog, Button, Switch } from "@octal/ui";
import * as Icons from "@octal/icons";
import { useInput } from "src/utils";
import { useNavigator } from "src/hooks";
import { createSpace } from "@octal/store/lib/actions/space";

interface ISpaceCreator {
    open: boolean;
    onClose: () => void;
}

interface ISpaceType {
    name: string;
    type: "discuss" | "board";
    description: string;
}

const accessDescription = {
    public: "Everyone in the space workspace can join and leave the space as they please. Other must be invited to join the space",
    private:
        "Space will be visible only to space members. Others can join the space by invition or adding them from the space workspace",
};

const spaceTypes: ISpaceType[] = [
    {
        name: "DISCUSSION",
        type: "discuss",
        description: "Space for ideas, discusion, and, chat",
    },
    {
        name: "BOARD",
        type: "board",
        description: "Colaboration for projects and task",
    },
];

export default React.memo<ISpaceCreator>((props) => {
    const dispatch = useDispatch();

    const [type, setType] = useState<"board" | "discuss">("discuss");
    const [access, setAccess] = useState<"public" | "private">("public");

    const name = useInput("");

    const topic = useInput("");

    const [creating, setCreating] = useState<boolean>(false);

    function handleCreateSpace(event: React.MouseEvent) {
        event.preventDefault();
        event.stopPropagation();
        let payload: any = {
            type: type,
            access: access,
            name: name.value,
        };
        if (type == "board") {
            payload.board = {
                name: topic.value,
                columns: [],
            };
            payload.topics = [];
        } else if (type == "discuss") {
            payload.topics = [{ name: topic.value }];
        }
        const action = createSpace(payload);
        dispatch(action).then(() => setCreating(false));
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
            <Dialog.Content className="flex flex-col">
                <div className="flex py-2 flex-col">
                    {spaceTypes.map((stype) => (
                        <button
                            key={stype.type}
                            onClick={() => setType(stype.type)}
                            className="rounded-lg border-2 border-gray-200 mb-4 py-4 px-2 flex items-center flex-row hover:bg-primary-50">
                            <div className="flex flex-grow flex-col items-start">
                                <span className="font-bold text-base">
                                    {stype.name}
                                </span>
                                <span className="text-sm">
                                    {stype.description}
                                </span>
                            </div>

                            <input
                                type="radio"
                                name="type"
                                value={stype.type}
                                onChange={() => {}}
                                className="text-primary-500 rounded-full form-radio"
                                checked={stype.type == type}
                            />
                        </button>
                    ))}
                </div>

                <div className="flex flex-col py-2">
                    <span className="font-semibold">SPACE NAME</span>
                    <input
                        required
                        name="name"
                        placeholder="name"
                        className="form-input rounded-lg"
                        {...name.props}
                    />
                </div>

                <div className="flex flex-col py-2">
                    <span className="font-semibold">
                        {type == "board" && "BOARD NAME"}
                        {type == "discuss" && "MAIN TOPIC"}
                    </span>
                    <input
                        required
                        name="topic"
                        placeholder="topic"
                        className="form-input rounded-md"
                        {...topic.props}
                    />
                    {type == "board" && (
                        <span className="text-xs">Board board name</span>
                    )}
                    {type == "discuss" && (
                        <span className="text-xs">Main space topic</span>
                    )}
                </div>

                <div className="flex flex-col py-4">
                    <div className="flex flex-row items-center">
                        <Icons.Private className="text-gray-500" />
                        <span className="font-semibold px-2 flex-grow">
                            Private
                        </span>
                        <Switch
                            checked={access == "private"}
                            onChange={toggleAccess}
                        />
                    </div>
                    <span className="font-semibold text-xs text-gray-700">
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
