import React, { useState } from "react";
import { UserRecord } from "@octal/store/lib/records";
import { useInput } from "src/utils";
import * as Icons from "@octal/icons";
import { Dialog, ImageInput, Button, Textarea } from "@octal/ui";
import * as UserActions from "@octal/store/lib/actions/user";
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

export default React.memo<IProfile>(({ user, ...props }) => {
    const dispatch = useDispatch();
    const imgInputId = React.useId();
    const [loading, setLoading] = useState<boolean>(false);
    const bio = useInput(user.bio);
    const name = useInput(user.name);
    const avatar = useInput<string | null>(null);
    const username = useInput(user.username);

    React.useEffect(() => {
        if (loading === false) {
            if (name.valid) {
                name.setValue(user.name);
            }
            if (username.valid) {
                username.setValue(user.username);
            }
            if (bio.valid) {
                bio.setValue(user.bio);
            }
            if (avatar.valid) {
                avatar.setValue(null);
            }
        }
    }, [loading]);
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
        if (avatar.valid) {
            params.avatar = avatar.value;
        }
        const action = UserActions.updateProfile(params);
        dispatch(action).finally(() => setLoading(false));
        setLoading(true);
    }
    return (
        <React.Fragment>
            <Dialog.Content className="overflow-y-auto overflow-x-hidden">
                <div className="flex flex-row">
                    <div className="flex flex-col flex-1 pr-8">
                        <div className="flex flex-col py-4">
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
                        </div>
                    </div>
                    <div className="relative flex flex-none flex-col px-4">
                        <ImageInput
                            id={imgInputId}
                            alt={user.name}
                            className="h-32 w-32 rounded-full border border-gray-200"
                            placeholder={user.avatar}
                            value={avatar.value}
                            onChange={avatar.setValue}
                        />
                        <label
                            role="button"
                            htmlFor={imgInputId}
                            className="group absolute h-32 w-32 rounded-full">
                            <div className="group-hover:visible invisible w-full h-full rounded-full flex justify-center items-center group-hover:bg-primary-800/80 text-white">
                                <Icons.Image.Add className="w-14 h-14" />
                            </div>
                        </label>
                        {avatar.valid && (
                            <div
                                role="button"
                                onClick={() => avatar.setValue(null)}
                                className="absolute right-4 -top-3 mt-5 bg-white py-1 px-1 border border-gray-300 shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 rounded-full">
                                <Icons.CloseCircleSolid />
                            </div>
                        )}
                    </div>
                </div>
                <div className="flex flex-col">
                    <Input
                        as={Textarea as any}
                        label="Bio"
                        disabled={loading}
                        className="min-h-[40px]"
                        description="Tell other about your self"
                        {...bio.props}
                    />
                    <div className="flex flex-row items-end py-4">
                        <Button onClick={() => props.setView("password")}>
                            Password
                        </Button>
                    </div>
                </div>
            </Dialog.Content>
            <Dialog.Actions>
                <Button
                    onClick={handleSubmit}
                    color="primary"
                    disabled={
                        (!name.valid &&
                            !bio.valid &&
                            !username.valid &&
                            !avatar.valid) ||
                        loading
                    }>
                    Save
                </Button>
            </Dialog.Actions>
        </React.Fragment>
    );
});
