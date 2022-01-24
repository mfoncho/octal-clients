import React, { useState, useEffect, useRef } from "react";
import { useInput } from "src/utils";
import GeneralIcon from "@material-ui/icons/AccountTreeRounded";
import { SpaceManagerProps } from "./index";
import Transition from "@material-ui/core/Slide";
import * as SpaceActions from "@octal/store/lib/actions/space";
import { useDispatch } from "react-redux";
import * as Icons from "@octal/icons";
import { Switch, Button } from "@octal/ui";
import Layout from "./Layout";

type SpaceAccess = "public" | "private";

type ChangesType = {
    name?: string;
    purpose?: string;
    access?: SpaceAccess;
    icon?: File;
};

const accessDescription = {
    public: "Everyone in the space workspace can join and leave the space as they please. Other must be invited to join the space",
    private:
        "Space will be visible only to space members. Others can join the space by invition or adding them from the space workspace",
};

const Manager = React.memo(({ space }: SpaceManagerProps) => {
    const dispatch = useDispatch();
    const name = useInput(space.name);

    const access = useInput<SpaceAccess>("public");

    const rootRef = useRef<HTMLDivElement>(null);

    const [loading, setLoading] = useState(false);

    const [changes, setChanges] = useState<ChangesType>({});

    useEffect(() => {
        name.setValue(space.name);
    }, [space.name]);

    useEffect(() => {
        access.setValue(space.is_private ? "private" : "public");
    }, [space.is_private]);

    useEffect(() => {
        if (access.value == (space.is_private ? "private" : "public")) {
            if ("access" in changes) {
                setChanges(({ access, ...vals }) => vals);
            }
        } else if (access.valid) {
            setChanges((vals) => ({ ...vals, access: access.value }));
        }
    }, [access.value, access.valid]);

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
        if (access.value == "public") {
            access.setValue("private");
        } else if (access.value == "private") {
            access.setValue("public");
        }
    }

    function handleSave() {
        const patches: any = { ...changes };
        if (changes.access) {
            patches.is_private = changes.access == "private" ? true : false;
        }
        const actions = SpaceActions.updateSpace(space.id, patches);
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
            className="relative flex flex-col flex-grow pb-20">
            <div className="flex py-4 flex-row justify-center">
                <div className="w-16 h-16 flex text-white items-center justify-center rounded-xl bg-primary-500">
                    <Icons.Space className="w-8 h-8" />
                </div>
            </div>
            <div className="h-px my-4 bg-gray-300" />
            <div className="flex flex-col py-8">
                <span className="font-semibold py-2 text-gray-500 text-sm">
                    Space Name
                </span>
                <input
                    {...name.props}
                    className="form-input font-semibold tex-gray-800 flex-grow rounded-md shadow-sm border border-gray-300"
                />
            </div>

            <div className="flex flex-col py-8">
                <div className="flex flex-row items-center py-4">
                    <Icons.Private className="text-gray-500" />
                    <span className="font-semibold px-2 flex-grow">
                        Private
                    </span>
                    <Switch
                        checked={access.value == "private"}
                        onChange={toggleAccess}
                    />
                </div>
                <span className="font-semibold text-xs pr-8 text-gray-700">
                    {accessDescription[access.value]}
                </span>
            </div>
            <Transition appear={hasChanges} direction="up" in={hasChanges}>
                <div
                    className="fixed flex bottom-4 flex-row items-center p-4 bg-white justify-between"
                    style={{ width: "550px" }}>
                    <span className="font-semibold text-sm text-gray-500">
                        You have made some changes
                    </span>
                    <Button
                        disabled={loading}
                        color="primary"
                        onClick={handleSave}>
                        Save
                    </Button>
                </div>
            </Transition>
        </Layout>
    );
});

function filter() {
    return true;
}

const name = "General";

export default {
    name: name,
    icon: GeneralIcon,
    filter: filter,
    manager: Manager,
};
