import React, { useState } from "react";
import { useDispatch } from "react-redux";
import * as Icons from "@colab/icons";
import { useInput } from "src/utils";
import client, { io } from "@colab/client";
import { useNavigator } from "src/hooks";
import { LeaveWarning } from "../SpaceDialog";
import { Actions, usePermissions, useSpaces, useAuthId } from "@colab/store";
import { Dialog, Button, Text, Switch, Textarea, UIEvent } from "@colab/ui";

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

const typeDescription = {
    public: "Everyone in the space workspace can join and leave the space as they please. Other must be invited to join the space",
    private:
        "Space will be visible only to space members. Others can join the space by invition or adding them from the space workspace",
};

function Input(props: IInput) {
    return (
        <div className="flex flex-col py-2">
            <span className="font-bold text-xs px-1">
                {props.label.toUpperCase()}
            </span>
            <Textarea.Input
                value={props.value}
                onChange={props.onChange}
                placeholder={props.placeholder}
                className="form-input rounded-md text-base"
            />
            <span className="font-semibold text-xs text-gray-500 px-1">
                {props.subheader}
            </span>
        </div>
    );
}

function SpaceCreator(props: any) {
    const permissions = usePermissions();
    const nav = useNavigator();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState<boolean>(false);

    const [type, setType] = useState<"public" | "private">("public");

    const name = useInput("");

    const topic = useInput("");

    function toggleAccess() {
        if (type == "public") {
            setType("private");
        } else if (type == "private") {
            setType("public");
        }
    }

    function handleCreateSpace(event: React.MouseEvent) {
        event.preventDefault();
        event.stopPropagation();
        let payload: any = {
            type: type,
            name: name.value,
            topic: topic.value,
        };
        const action = Actions.Space.createSpace(payload);
        setLoading(true);
        dispatch(action)
            .then((space) => {
                setLoading(false);
                nav.openSpace(space);
            })
            .then(props.onClose);
    }

    return (
        <Dialog
            title="Create Space"
            maxWidth="xs"
            open={props.open}
            fullWidth={true}
            fullHeight={false}
            onClose={loading ? undefined : props.onClose}>
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
                            checked={type == "private"}
                            onChange={toggleAccess}
                        />
                    </div>
                    <span className="font-semibold text-xs text-gray-500 py-2">
                        {typeDescription[type]}
                    </span>
                </div>
            </Dialog.Content>
            <Dialog.Actions className="space-x-2">
                <Button
                    color="primary"
                    onClick={() => props.setMode("discover")}
                    disabled={loading}>
                    Discover
                </Button>
                <Button
                    color="primary"
                    onClick={handleCreateSpace}
                    disabled={
                        !permissions.get("space.create") ||
                        !name.valid ||
                        !topic.valid ||
                        loading
                    }>
                    Create
                </Button>
            </Dialog.Actions>
        </Dialog>
    );
}

function Discover(props: any) {
    const authid = useAuthId();
    const nav = useNavigator();
    const spaces = useSpaces();
    const dispatch = useDispatch();
    const permissions = usePermissions();
    const [loading, setLoading] = useState<string[]>([]);
    const [warning, setWarning] = useState<string | null>(null);
    const [available, setAvailable] = useState<io.Space[]>([]);
    React.useEffect(() => {
        client.fetchSpaces({ params: { type: "public" } }).then(setAvailable);
    }, []);

    function blockSpace(id: string) {
        setLoading((loading) =>
            loading.includes(id) ? loading : loading.concat([id])
        );
    }

    function freeSpace(id: string) {
        setLoading((loading) => {
            const index = loading.indexOf(id);
            if (index >= 0) {
                loading.splice(index, 1);
            }
            return [...loading];
        });
    }

    function joinSpace(id: string) {
        blockSpace(id);
        const action = Actions.Space.joinSpace(id);
        dispatch(action)
            .then((space) => {
                nav.openSpace(space);
                props.onClose({});
            })
            .finally(() => freeSpace(id));
    }

    function leaveSpace(id: string) {
        if (spaces.get(id)?.admin_id === authid) {
            return;
        }
        blockSpace(id);
        const action = Actions.Space.leaveSpace(id);
        dispatch(action).finally(() => {
            freeSpace(id);
            setWarning(null);
        });
    }

    function renderSpaces() {
        return available.map((space) => (
            <div
                key={space.id}
                className="group flex flex-row justify-between hover:bg-primary-500 py-2 px-6">
                <div className="flex flex-col">
                    <div className="group-hover:text-white font-black text-gray-800">
                        <Text>{space.name}</Text>
                    </div>
                    <div className="text-sm text-gray-500 group-hover:text-gray-200 font-semibold">
                        <Text>purpose</Text>
                    </div>
                </div>
                <div>
                    {loading.includes(space.id) ? (
                        <div className="group-hover:text-white text-primary-500 px-6 py-2">
                            <Icons.Loader.Crescent className="text-2xl animate-spin" />
                        </div>
                    ) : spaces.has(space.id) ? (
                        <button
                            disabled={spaces.get(space.id)?.admin_id === authid}
                            onClick={() => setWarning(space.id)}
                            className="group-hover:visible invisible text-white text-sm font-bold px-3 py-1 border border-2 border-white rounded-md hover:shadow-md disabled:text-primary-400 disabled:border-primary-400 disabled:shadow-none">
                            Leave
                        </button>
                    ) : (
                        <button
                            onClick={() => joinSpace(space.id)}
                            className="group-hover:visible invisible text-white text-sm font-bold px-3 py-1 border border-2 border-white rounded-md hover:shadow-md">
                            Join
                        </button>
                    )}
                </div>
            </div>
        ));
    }
    return (
        <Dialog
            title="Discover"
            maxWidth="xs"
            open={props.open}
            fullWidth={true}
            fullHeight={true}
            onClose={loading.length > 0 ? undefined : props.onClose}>
            <div className="flex flex-col overflow-y-auto max-h-full w-full pb-8 divide-y divider-gray-200">
                {renderSpaces()}
                {Boolean(warning) && spaces.get(warning!) && (
                    <LeaveWarning
                        space={spaces.get(warning!)!}
                        loading={loading.includes(warning!)}
                        onClose={() => setWarning(null)}
                        open={Boolean(warning)}
                        onConfirm={() => leaveSpace(warning!)}
                    />
                )}
            </div>
            {permissions.get("space.create") && (
                <Dialog.Actions>
                    <Button
                        color="primary"
                        onClick={() => props.setMode("creator")}
                        disabled={loading.length > 0}>
                        Create Space
                    </Button>
                </Dialog.Actions>
            )}
        </Dialog>
    );
}

export default React.memo<ISpaceCreator>((props) => {
    const mode = Dialog.useDialog("discover");

    return (
        <React.Fragment>
            {props.open && (
                <>
                    {mode.discover && (
                        <Discover {...props} setMode={mode.open} />
                    )}
                    {mode.creator && (
                        <SpaceCreator {...props} setMode={mode.open} />
                    )}
                </>
            )}
        </React.Fragment>
    );
});
