import React, { useState, useRef } from "react";
import Role from "./Role";
import GeneralIcon from "@material-ui/icons/AccountTreeRounded";
import * as Icons from "@octal/icons";
import Layout from "../Layout";
import { useActions } from "@workspace/Space";
import { Popper, Button, Dialog, Markdown, Text } from "@octal/ui";
import { SpaceRecord, useRoles, RoleRecord } from "@octal/store";

interface IManager {
    space: SpaceRecord;
}

interface IMenu {
    roles: ReturnType<typeof useRoles>;
    selected: string[];
    onSelect?: (e: React.MouseEvent, id: string) => void;
}

interface ICustomize {
    loading?: boolean;
    name: string;
    onConfirm?: (e: React.MouseEvent) => void;
}

function customizeText(name: string) {
    return `Override default role (__${name}__) permissions. Customized permissions will be applied to all space members with this role`;
}

function deleteText(name: string) {
    return `Delete custom role (__${name}__). 

Customized permissions will be lost permantly.
###### Are you sure you want to proceed`;
}

const CustomizeDialog = Dialog.create<ICustomize>((props) => {
    return (
        <Dialog
            open={props.open}
            maxWidth="xs"
            title="Customize Role"
            onClose={props.loading ? undefined : props.onClose}>
            <Dialog.Content className="text-base">
                <Markdown>{customizeText(props.name)}</Markdown>
            </Dialog.Content>
            <Dialog.Actions>
                <Button
                    color="clear"
                    onClick={props.onClose}
                    disabled={props.loading}
                    className="mx-2">
                    Cancel
                </Button>
                <Button
                    disabled={props.loading}
                    color="primary"
                    onClick={props.onConfirm}>
                    Customize
                </Button>
            </Dialog.Actions>
        </Dialog>
    );
});

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
const MenuPopper = Popper.create<HTMLDivElement, IMenu>((props) => {
    return (
        <Popper
            open={props.open}
            anchorEl={props.anchorEl}
            placement="bottom-end"
            onClickAway={props.onClickAway}
            className="rounded-md shadow flex bg-white min-w-[300px] flex-col border border-gray-200 divide-y divide-solid divide-gray-200">
            {props.roles
                .map((role) => {
                    const selected = props.selected.includes(role.id);
                    return (
                        <div
                            key={role.id}
                            onClick={
                                props.onSelect
                                    ? (e) => props.onSelect!(e, role.id)
                                    : undefined
                            }
                            className="hover:bg-slate-200 flex py-2 px-4 flex-row items-center justify-between cursor-pointer">
                            <span className="font-bold text-gray-700">
                                <Text>{role.name}</Text>
                            </span>
                            {selected && (
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    className="h-6 w-6 text-primary-500"
                                    stroke="currentColor">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M5 13l4 4L19 7"
                                    />
                                </svg>
                            )}
                        </div>
                    );
                })
                .toList()}
        </Popper>
    );
});

const Manager = React.memo(({ space }: IManager) => {
    const rootRef = useRef<HTMLDivElement>(null);
    const addBtnRef = useRef<HTMLButtonElement>(null);
    const [addMenu, setAddMenu] = useState<boolean>(false);
    const [selected, setSelected] = useState<string | null>(null);
    const [warning, setWarning] = useState<string | null>(null);
    const [customize, setCustomize] = useState<string | null>(null);
    const roles = useRoles();

    const actions = useActions(space);

    const customRoles = roles.filter((role) =>
        space.roles.find((srole) => srole.role_id === role.id)
    );

    const role = roles.get(selected ?? "");

    const custom = space.roles.find((role) => role.role_id === selected);

    function openRoleClickHanlder(id: string) {
        return (e: React.MouseEvent) => {
            e.stopPropagation();
            e.preventDefault();
            setSelected(id);
        };
    }

    function handleOpenWarning(id: string) {
        return (e: React.MouseEvent) => {
            e.stopPropagation();
            e.preventDefault();
            setWarning(id);
        };
    }

    function handleDeleteRole() {
        let role = space.roles.find((role) => role.role_id == warning);
        if (role) {
            actions.deleteRole(role.id).then(() => setWarning(null));
        }
    }

    function handleCloseWarning() {
        setWarning(null);
    }

    function handleOpenCustomizer(e: React.MouseEvent, id: string) {
        e.stopPropagation();
        e.preventDefault();
        if (!space.roles.has(id)) {
            setCustomize(id);
        }
    }

    function handleCreateCustomRole(e: React.MouseEvent) {
        e.stopPropagation();
        e.preventDefault();
        if (customize) {
            actions.createRole(customize).then(() => setCustomize(null));
        }
    }

    function handleCloseCustomizer() {
        setCustomize(null);
    }

    function handleOpenMenu(e: React.MouseEvent) {
        e.stopPropagation();
        e.preventDefault();
        setAddMenu(true);
    }

    function handleCloseMenu() {
        setAddMenu(false);
    }

    function handleRoleClose(e: React.MouseEvent) {
        e.stopPropagation();
        e.preventDefault();
        setSelected(null);
    }

    function renderRole(role: RoleRecord) {
        const clickHandler = openRoleClickHanlder(role.id);
        return (
            <div
                key={role.id}
                role="button"
                onClick={clickHandler}
                className="group hover:bg-slate-100 flex py-2 px-4 flex-row items-center justify-between">
                <span className="font-bold text-gray-700">
                    <Text>{role.name}</Text>
                </span>
                <div className="invisible group-hover:visible flex flex-row items-center justify-end space-x-2">
                    <button
                        className="text-gray-500 rounded-md border border-gray-400 p-2 hover:bg-gray-200 flex items-center justify-center"
                        onClick={handleOpenWarning(role.id)}>
                        <Icons.Delete />
                    </button>
                </div>
            </div>
        );
    }

    return (
        <Layout
            ref={rootRef}
            title="Roles & Permissions"
            className="flex flex-col flex-grow pb-20">
            {role && custom ? (
                <Role role={role} selected={custom} onClose={handleRoleClose} />
            ) : (
                <>
                    <div className="flex flex-row pb-4 justify-end my-1">
                        <button
                            onClick={handleOpenMenu}
                            ref={addBtnRef}
                            className="flex rounded-md bg-primary-500 flex-row items-center text-white px-3 py-1.5 font-semibold">
                            Create Role
                        </button>
                    </div>

                    <div className="flex flex-col rounded-md border border-gray-200 divide-y divide-solid divide-gray-200">
                        {customRoles.map(renderRole).toList()}
                    </div>
                </>
            )}
            <MenuPopper
                roles={roles}
                open={addMenu}
                selected={
                    space.roles
                        .map((role) => role.role_id)
                        .toList()
                        .toJS() as string[]
                }
                onSelect={handleOpenCustomizer}
                anchorEl={addBtnRef.current}
                onClickAway={handleCloseMenu}
            />
            <CustomizeDialog
                name={roles.get(customize ?? "")?.name!}
                open={Boolean(customize)}
                onClose={handleCloseCustomizer}
                onConfirm={handleCreateCustomRole}
            />
            <DeleteRoleDialog
                name={roles.get(warning ?? "")?.name!}
                open={Boolean(warning)}
                onClose={handleCloseWarning}
                onConfirm={handleDeleteRole}
            />
        </Layout>
    );
});

function filter() {
    return true;
}

const name = "Roles & Permissions";

export default {
    name: name,
    icon: GeneralIcon,
    filter: filter,
    manager: Manager,
};
