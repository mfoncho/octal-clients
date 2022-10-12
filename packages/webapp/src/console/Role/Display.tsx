import React, { useState } from "react";
import { useInput } from "src/utils";
import * as Icons from "@colab/icons";
import { Dialog, Button, Text, Emoji } from "@colab/ui";
import { io } from "@console/types";
import client from "@console/client";
import { useNavigator } from "@console/hooks";

interface IRole {
    role: io.Role;
    updateRole: (role: io.Role) => void;
}

interface ICustomize {
    loading?: boolean;
    name: string;
    onConfirm?: (e: React.MouseEvent) => void;
}
const noop = () => {};

function deleteText(name: string) {
    return `Delete role __${name}__. 

Permissions will be lost permantly.
###### Are you sure you want to proceed`;
}

const DeleteRoleDialog = Dialog.create<ICustomize>((props) => {
    return (
        <Dialog.Warning
            open={props.open}
            title={`Delete Role`}
            onClose={props.loading ? undefined : props.onClose}
            disabled={props.loading}
            onConfirm={props.onConfirm as any}>
            {deleteText(props.name)}
        </Dialog.Warning>
    );
});

export default function Role(props: IRole) {
    const { role } = props;
    const navigator = useNavigator();
    const dialog = Dialog.useDialog();
    const iconAnchorEl = React.useRef<HTMLButtonElement>(null);
    const icon = useInput(role.icon);
    const name = useInput(role.name);
    const [loading, setLoading] = useState(false);
    const hasChanges =
        icon.value !== role.icon || role.name !== name.value.trim();

    function updateRole() {
        const params = { name: name.value.trim(), icon: icon.value };
        client
            .updateRole({ role_id: role.id, params })
            .then((data) => props.updateRole(data))
            .catch(noop)
            .finally(() => setLoading(false));
    }

    function handleDeleteRole() {
        client
            .deleteRole({ role_id: role.id })
            .then(navigator.openRoles)
            .catch(() => setLoading(false));
    }

    return (
        <div className="flex flex-col p-2">
            {!role.is_default && (
                <div className="pt-4 flex flex-row justify-end">
                    <Button
                        color="danger"
                        variant="icon"
                        disabled={loading}
                        onClick={dialog.opener("warning")}>
                        <Icons.Delete />
                    </Button>
                </div>
            )}
            {!role.is_default && (
                <div className="flex flex-row justify-center items-center p-2">
                    <button
                        ref={iconAnchorEl}
                        onClick={dialog.opener("emoji")}
                        className="text-6xl p-4 hover:bg-gray-200 rounded-md">
                        <Text>{icon.value}</Text>
                    </button>
                </div>
            )}
            <div className="col-span-6 sm:col-span-3">
                <label
                    htmlFor="role-name"
                    className="block text-sm font-medium text-gray-700">
                    Role name
                </label>
                <input
                    {...name.props}
                    type="text"
                    name="first-name"
                    id="role-name"
                    disabled={loading || role.is_default}
                    autoComplete="given-name"
                    className="mt-1 p-2 font-bold text-gray-700 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-md border-gray-300 rounded-md"
                />
            </div>
            {!role.is_default && (
                <div className="py-2 flex flex-row justify-end">
                    <Button
                        color="primary"
                        disabled={!hasChanges || loading}
                        onClick={updateRole}>
                        Save
                    </Button>
                </div>
            )}
            <DeleteRoleDialog
                name={role.name}
                loading={loading}
                open={dialog.warning}
                onClose={dialog.close}
                onConfirm={handleDeleteRole}
            />
            <Emoji.Picker.Popper
                open={dialog.emoji}
                anchorEl={iconAnchorEl.current}
                onSelect={icon.setValue}
                onClickAway={dialog.close}
            />
        </div>
    );
}
