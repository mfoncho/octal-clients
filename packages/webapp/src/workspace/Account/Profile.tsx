import React, { useState } from "react";
import { UserRecord } from "@octal/store/lib/records";
import { useInput } from "src/utils";
import { Dialog, Avatar, Button } from "@octal/ui";
import { updateProfile } from "@octal/store/lib/actions/user";
import { useDispatch } from "react-redux";

export interface IProfile {
    user: UserRecord;
    setView: (view: string) => void;
}

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

export function Input({ label, as = "input", description, ...props }: IInput) {
    const AsComponent: any = as;
    return (
        <div className="flex flex-col pb-8">
            <span className="font-semibold text-base text-gray-800 py-1.5">
                {label}
            </span>
            <AsComponent
                className="focus:outline-none focus:ring focus:border-blue-300  rounded-lg border border-gray-200 p-2 w-full text-base text-gray-800"
                {...props}
            />
            {description && (
                <span className="text-gray-500 py-1 text-xs font-semibold">
                    {description}
                </span>
            )}
        </div>
    );
}

export default React.memo<IProfile>(({ user, ...props }) => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState<boolean>(false);
    const bio = useInput(user.bio);
    const name = useInput(user.name);
    const username = useInput(user.username);
    function handleSubmit(e: React.MouseEvent) {
        e.stopPropagation();
        e.preventDefault();
        const params: any = {};
        if (name.valid) {
            params.name = name.value;
        }
        if (username.valid) {
            params.username = username.value;
        }
        if (bio.valid) {
            params.bio = bio.value;
        }
        const action = updateProfile(params);
        dispatch(action).finally(() => setLoading(false));
        setLoading(true);
    }
    return (
        <React.Fragment>
            <Dialog.Content>
                <div className="flex flex-row">
                    <div className="flex flex-col flex-1 pr-8">
                        <div className="flex flex-col">
                            <Input
                                label="Name"
                                disabled={loading}
                                description="Name used in email and other official document"
                                {...name.props}
                            />
                            <Input
                                label="Display name"
                                disabled={loading}
                                description="This could be your first name, or a nickname — however you’d like people to refer to you"
                                {...username.props}
                            />
                            <Input
                                as="textarea"
                                label="Bio"
                                disabled={loading}
                                description="Tell other about your self"
                                {...bio.props}
                            />
                            <div className="flex flex-row items-end py-4">
                                <Button
                                    onClick={() => props.setView("password")}>
                                    Password
                                </Button>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-none flex-col px-4">
                        <Avatar
                            className="h-32 w-32"
                            src={user.avatar}
                            alt={user.name}
                        />
                    </div>
                </div>
            </Dialog.Content>
            <Dialog.Actions>
                <Button
                    onClick={handleSubmit}
                    color="primary"
                    disabled={
                        (!name.valid && !bio.valid && !username.valid) ||
                        loading
                    }>
                    Save
                </Button>
            </Dialog.Actions>
        </React.Fragment>
    );
});
