import React, { useState } from "react";
import emoji from "@colab/emoji";
import * as Icons from "@colab/icons";
import { Link } from "react-router-dom";
import StatusDialog from "../StatusDialog";
import AccountDialog from "../AccountDialog";
import PresenceDialog from "../PresenceDialog";
import { presence as colors } from "src/colors";
import { Popper, Button, Text, Dialog, Tooltip } from "@colab/ui";
import { usePresence, useStatus, useWorkspace, useAuth } from "@colab/store";

interface IOption {
    name: string;
    secondary?: React.ReactNode;
}

interface IDialog {
    open: boolean;
    onClose: any;
}

interface IMenu {
    options: IOption[];
    onSelect: (cmp: string) => void;
}

interface IMenuItem {
    name: string;
    component: React.FC<IDialog> | React.ComponentClass<IDialog>;
    secondary?: React.ReactNode;
}

export interface IPresence {
    className?: string;
}

const Status = React.memo<{}>(() => {
    const status = useStatus();
    if (Boolean(status.icon)) {
        return (
            <Tooltip
                placement="top"
                title={
                    <span className="text-xs font-bold">{status.text}</span>
                }>
                <span>
                    <Text>{status.icon}</Text>
                </span>
            </Tooltip>
        );
    }
    return <span />;
});

const Presence = React.memo<IPresence>((props) => {
    const presence = usePresence();
    return (
        <div
            className="w-3 h-3 rounded-full shadow"
            style={{ backgroundColor: colors.get(presence.state) }}
        />
    );
});

const items: IMenuItem[] = [
    {
        name: "Status",
        component: StatusDialog,
        secondary: <Status />,
    },
    {
        name: "Presence",
        component: PresenceDialog,
        secondary: <Presence />,
    },
    {
        name: "Account",
        component: AccountDialog,
    },
];

export const Menu = Popper.create<HTMLDivElement, IMenu>((props) => {
    const auth = useAuth();
    const workspace = useWorkspace();
    function hanleSelect(dialog: string) {
        return (event: React.MouseEvent): void => {
            event.stopPropagation();
            event.preventDefault();
            props.onSelect(dialog);
        };
    }

    return (
        <Popper
            as="div"
            open={props.open}
            placement="bottom-end"
            className="flex z-10 flex-col min-w-[220px] shadow-md rounded-lg border border-gray-200 bg-white dark:bg-slate-900 dark:border-slate-700 p-2 shadow-md"
            anchorEl={props.anchorEl}
            onHoverAway={props.onHoverAway}
            onClickAway={props.onClickAway}>
            {props.options.map((option) => (
                <div
                    role="button"
                    className="rounded-md px-4 py-2 text-base text-gray-700 hover:bg-gray-100 dark:hover:bg-slate-800 dark:text-slate-300 dark:hover:text-white flex flex-row items-center justify-between "
                    key={option.name}
                    onClick={hanleSelect(option.name)}>
                    <span className="font-semibold text-sm">{option.name}</span>
                    {option.secondary}
                </div>
            ))}

            {auth.get("id") === workspace.get("admin_id") && (
                <Link
                    to="/console"
                    className="rounded-md px-4 py-2 text-base text-gray-700 hover:bg-gray-100 dark:hover:bg-slate-800 dark:text-slate-300 dark:hover:text-white flex flex-row items-center justify-between">
                    <span className="font-semibold text-sm">Console</span>
                </Link>
            )}
        </Popper>
    );
});

export default React.memo(() => {
    const dialog = Dialog.useDialog();

    const [menu, setMenu] = useState<HTMLElement | null>(null);

    function handleOpenMenu(e: React.MouseEvent<HTMLElement>) {
        setMenu(e.currentTarget);
    }

    function handleCloseMenu() {
        setMenu(null);
    }

    return (
        <div role="button">
            <Button
                onClick={handleOpenMenu}
                className="group"
                variant="icon"
                color="clear">
                <Icons.Menu.Bugger className="text-gray-400 group-hover:text-gray-700 dark:text-gray-200 dark:group-hover:text-black" />
            </Button>
            <Menu
                open={Boolean(menu)}
                anchorEl={menu!}
                options={items}
                onSelect={dialog.open}
                onHoverAway={handleCloseMenu}
                onClickAway={handleCloseMenu}
            />
            {items.map((option) => {
                const DialogComponent = option.component;
                return (
                    <DialogComponent
                        key={option.name}
                        open={dialog[option.name]}
                        onClose={dialog.close as any}
                    />
                );
            })}
        </div>
    );
});
