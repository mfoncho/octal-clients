import React, { useState } from "react";
import * as Icons from "@octal/icons";
import emoji from "@octal/emoji";
import { Link } from "react-router-dom";
import StatusDialog from "../StatusDialog";
import AccountDialog from "../AccountDialog";
import PresenceDialog from "../PresenceDialog";
import { presence as colors } from "src/colors";
import { Popper, Button, Text, Dialog, Tooltip } from "@octal/ui";
import { usePresence, useStatus } from "@octal/store";
import { GoPrimitiveDot as PresenceDotIcon } from "react-icons/go";

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
    const [icon, status] = emoji.prefixed(useStatus());
    if (Boolean(icon) && Boolean(status)) {
        return (
            <Tooltip
                placement="top"
                title={<span className="text-xs font-bold">{status}</span>}>
                <span>
                    <Text>{icon}</Text>
                </span>
            </Tooltip>
        );
    }
    return <span />;
});

const Presence = React.memo<IPresence>((props) => {
    const presence = usePresence();
    return (
        <PresenceDotIcon
            className={props.className}
            style={{ color: colors.get(presence.state) }}
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
            placement="right-end"
            className="flex z-10 flex-col min-w-[220px] shadow-md rounded-md border border-gray-200 bg-white p-2"
            anchorEl={props.anchorEl}
            onHoverAway={props.onHoverAway}
            onClickAway={props.onClickAway}>
            {props.options.map((option) => (
                <div
                    role="button"
                    className="rounded-md px-4 py-2 text-base text-gray-700 hover:bg-gray-100 flex flex-row items-center justify-between"
                    key={option.name}
                    onClick={hanleSelect(option.name)}>
                    <span className="font-semibold text-sm">{option.name}</span>
                    {option.secondary}
                </div>
            ))}

            <Link
                to="/console"
                className="rounded-md px-4 py-2 text-base text-gray-700 hover:bg-gray-100 flex flex-row items-center justify-between">
                <span className="font-semibold text-sm">Console</span>
            </Link>
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
                <Icons.Menu.Bugger className="text-white group-hover:text-gray-600" />
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
