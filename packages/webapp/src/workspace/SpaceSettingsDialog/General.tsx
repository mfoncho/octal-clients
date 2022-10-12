import React, { useState, useEffect, useRef } from "react";
import clx from "classnames";
import { useInput } from "src/utils";
import { SpaceManagerProps } from "./index";
import { Actions } from "@colab/store";
import { useDispatch } from "react-redux";
import * as Icons from "@colab/icons";
import { Switch, Button } from "@colab/ui";
import Layout from "./Layout";

type ChangesType = {
    name?: string;
    type?: string;
};

const TypeDescription = {
    public: "Everyone in the space workspace can join and leave the space as they please. Other must be invited to join the space",
    private:
        "Space will be visible only to space members. Others can join the space by invition or adding them from the space workspace",
    direct: "",
};

const Manager = React.memo(({ space }: SpaceManagerProps) => {
    const dispatch = useDispatch();
    const name = useInput(space.name);

    const type = useInput(space.type);

    const rootRef = useRef<HTMLDivElement>(null);

    const [loading, setLoading] = useState(false);

    const [changes, setChanges] = useState<ChangesType>({});

    useEffect(() => {
        name.setValue(space.name);
    }, [space.name]);

    useEffect(() => {
        type.setValue(space.is_private ? "private" : "public");
    }, [space.is_private]);

    useEffect(() => {
        if (type.value == (space.is_private ? "private" : "public")) {
            if ("type" in changes) {
                setChanges(({ type, ...vals }) => vals);
            }
        } else if (type.valid) {
            setChanges((vals) => ({ ...vals, type: type.value }));
        }
    }, [type.value, type.valid]);

    useEffect(() => {
        if (name.value == space.name || !name.valid) {
            if ("name" in changes) {
                setChanges(({ name, ...vals }) => vals);
            }
        } else if (name.valid) {
            setChanges((vals) => ({ ...vals, name: name.value }));
        }
    }, [name.value, name.valid]);

    function toggleAccess() {
        if (type.value == "public") {
            type.setValue("private");
        } else if (type.value == "private") {
            type.setValue("public");
        }
    }

    function handleSave() {
        const patches: any = { ...changes };
        if (changes.type) {
            patches.type = changes.type;
        }
        const actions = Actions.Space.updateSpace(space.id, patches);
        dispatch(actions)
            .then(() => setChanges({} as any))
            .finally(() => setLoading(false));
        setLoading(true);
    }
    const hasChanges = Object.keys(changes).length > 0;
    return (
        <Layout
            ref={rootRef}
            title="General"
            className="flex flex-col flex-grow justify-between">
            <div className="flex flex-col flex-grow">
                <div className="flex flex-col py-8">
                    <span className="font-semibold py-2 text-gray-500 text-sm">
                        Space Name
                    </span>
                    <input
                        {...name.props}
                        className="form-input font-semibold tex-gray-800 flex-grow rounded-md shadow-sm border border-gray-300"
                    />
                </div>

                {!space.is_common && (
                    <div className="flex flex-col py-8">
                        <div className="flex flex-row items-center py-4">
                            <Icons.Private className="text-gray-500" />
                            <span className="font-semibold px-2 flex-grow">
                                Private
                            </span>
                            <Switch
                                checked={type.value == "private"}
                                onChange={toggleAccess}
                            />
                        </div>
                        <span className="font-semibold text-xs pr-8 text-gray-700">
                            {(TypeDescription as any)[type.value]}
                        </span>
                    </div>
                )}
            </div>
            <div
                className={clx(
                    "flex bottom-4 flex-row items-center p-4 bg-white justify-between",
                    { invisible: !hasChanges }
                )}>
                <span className="font-semibold text-sm text-gray-500">
                    You have made some changes
                </span>
                <Button disabled={loading} color="primary" onClick={handleSave}>
                    Save
                </Button>
            </div>
        </Layout>
    );
});

function filter() {
    return true;
}

const name = "General";

export default {
    name: name,
    filter: filter,
    manager: Manager,
};
