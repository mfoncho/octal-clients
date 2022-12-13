import React, { useState, useEffect, useRef } from "react";
import clx from "classnames";
import { useInput } from "src/utils";
import { SpaceManagerProps } from "./index";
import { Actions } from "@colab/store";
import { useDispatch } from "react-redux";
import * as Icons from "@colab/icons";
import { Switch, Button, Textarea } from "@colab/ui";
import Layout from "./Layout";

export interface IAsInput extends React.InputHTMLAttributes<HTMLInputElement> {
    as?: "input";
}

export interface IAsSpan
    extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    as?: "textarea";
}

export type IAsComboAttributes = IAsInput | IAsSpan;

export type IInput = {
    label: string;
    description?: string;
} & IAsComboAttributes;

const TypeDescription = {
    public: "Everyone in the space workspace can join and leave the space as they please. Other must be invited to join the space",
    private:
        "Space will be visible only to space members. Others can join the space by invition or adding them from the space workspace",
    direct: "",
};

export function Input({ label, as = "input", description, ...props }: IInput) {
    const AsComponent: any = as;
    return (
        <div className="flex flex-col pb-8">
            <span className="font-bold text-xs text-gray-700 px-1">
                {label.toUpperCase()}
            </span>
            <AsComponent
                {...props}
                className={`focus:outline-none focus:ring focus:border-blue-300  rounded-lg border border-gray-200 p-2 w-full text-base text-gray-800 ${
                    props.className ?? ""
                }`}
            />
            {description && (
                <span className="text-gray-500 px-1 text-xs font-semibold">
                    {description}
                </span>
            )}
        </div>
    );
}

const Manager = React.memo(({ space }: SpaceManagerProps) => {
    const dispatch = useDispatch();
    const name = useInput(space.name);

    const type = useInput(space.type);

    const purpose = useInput(space.purpose);

    const rootRef = useRef<HTMLDivElement>(null);

    const [loading, setLoading] = useState(false);

    const hasChanges =
        space.type !== type.value.trim() ||
        name.value.trim() !== space.name.trim() ||
        purpose.value.trim() !== space.purpose.trim();

    function toggleAccess() {
        if (type.value == "public") {
            type.setValue("private");
        } else if (type.value == "private") {
            type.setValue("public");
        }
    }

    function handleSave() {
        const patches: any = {};
        if (name.valid) {
            patches.name = name.value.trim();
        }
        if (!space.is_common && type.valid) {
            patches.type = type.value.trim();
        }
        if (purpose.value.trim() !== space.purpose) {
            patches.purpose = purpose.value.trim();
        }

        const actions = Actions.Space.updateSpace(space.id, patches);
        dispatch(actions).finally(() => setLoading(false));
        setLoading(true);
    }
    return (
        <Layout
            ref={rootRef}
            title="General"
            className="flex flex-col flex-grow justify-between">
            <div className="flex flex-col flex-grow">
                <Input
                    label="Name"
                    disabled={loading}
                    className="min-h-[40px]"
                    description="Space name"
                    {...name.props}
                />
                <Input
                    as={Textarea as any}
                    disabled={loading}
                    label="Purpose"
                    className="min-h-[40px]"
                    description="Describe space purpose, what being accomplished by the members og this space"
                    {...purpose.props}
                />

                {!space.is_common && (
                    <div className="flex flex-col py-8">
                        <div className="flex flex-row items-center py-4">
                            <Icons.Private className="text-gray-500" />
                            <span className="font-semibold px-2 flex-grow">
                                Private
                            </span>
                            <Switch
                                disabled={loading}
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
