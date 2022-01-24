import React, { useState } from "react";
import { Text, Dialog, Tooltip } from "@octal/ui";
import { useUser, usePresence, useStatus } from "@octal/store";
import Menu from "./Menu";
import StatusDialog from "../StatusDialog";
import AccountDialog from "../Account";
import PresenceDialog from "../PresenceDialog";
import PreferencesDialog from "../PreferencesDialog";
import { presence as colors } from "src/colors";
import { GoPrimitiveDot as PresenceDotIcon } from "react-icons/go";

interface IDialog {
    open: boolean;
    onClose: any;
}

interface IMenuItem {
    name: string;
    component: React.FC<IDialog> | React.ComponentClass<IDialog>;
    secondary?: React.ReactNode;
}

const Status = React.memo<{}>(() => {
    const { icon, status } = useStatus();
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

export interface IPresence {
    className?: string;
}

const Presence = React.memo<IPresence>((props) => {
    const presence = usePresence();
    return (
        <PresenceDotIcon
            className={props.className}
            style={{ color: colors.get(presence.state) }}
        />
    );
});

const menuItems: IMenuItem[] = [
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
        name: "Profile",
        component: AccountDialog,
    },
    {
        name: "Preferences",
        component: PreferencesDialog,
    },
];

export default React.memo(() => {
    const user = useUser();

    const dialog = Dialog.useDialog();

    const [menu, setMenu] = useState<HTMLElement | null>(null);

    function handleOpenMenu(e: React.MouseEvent<HTMLElement>) {
        setMenu(e.currentTarget);
    }

    function handleCloseMenu() {
        setMenu(null);
    }

    return (
        <>
            <button
                onClick={handleOpenMenu}
                className="flex flex-row items-center">
                <Presence className="w-4 h-4" />
                <span className="text-sm font-semibold text-gray-700 pr-2 ">
                    {user.username}
                </span>
                <Status />
            </button>
            <Menu
                open={Boolean(menu)}
                anchorEl={menu!}
                options={menuItems}
                onSelect={dialog.open}
                onHoverAway={handleCloseMenu}
                onClickAway={handleCloseMenu}
            />
            {menuItems.map((option) => {
                const DialogComponent = option.component;
                return (
                    <DialogComponent
                        key={option.name}
                        open={dialog[option.name]}
                        onClose={dialog.close as any}
                    />
                );
            })}
        </>
    );
});
