import React, { useState, useEffect } from "react";
import clx from "classnames";
import { Link, generatePath, useParams } from "react-router-dom";
import { Text, Collapse, Dialog, Popper } from "@colab/ui";
import TopicCreatorDialog from "../Space/CreateTopic";
import CreateCatalogDialog from "../Space/CreateCatalogDialog";
import paths from "src/paths/workspace";
import Counter from "./Counter";
import * as Icons from "@colab/icons";
import Topic from "./Topic";
import Catalog from "./Catalog";
import SpaceSettingsDialog from "../SpaceSettingsDialog";
import SpaceDialog from "../SpaceDialog";
import InviteDialog from "../InviteDialog";
import store, {
    SpaceRecord,
    useUser,
    useAuthId,
    useSpacePermissions,
    useSpaceCatalogsIndex,
    useSpaceTopicsIndex,
} from "@colab/store";

export interface ISpace {
    space: SpaceRecord;
}

export interface ISpaceItem {
    id: string;
    type: string;
}

export interface IMenuItem {
    icon?: React.ReactNode;
    name: string;
    menu: string;
    action?: React.ReactNode;
}

export interface IMenu {
    onSelect: (e: React.MouseEvent) => void;
    options: IMenuItem[];
}

const sortSpaceItems = (a: ISpaceItem, b: ISpaceItem) => {
    let atimestamp = "";
    let btimestamp = "";
    switch (a.type) {
        case "topic":
            atimestamp = store.getState().topics.getTopic(a.id)!.created_at!;
            break;
        case "catalog":
            atimestamp = store.getState().catalogs.getCatalog(a.id)!
                .created_at!;
            break;
    }
    switch (b.type) {
        case "topic":
            btimestamp = store.getState().topics.getTopic(b.id)!.created_at!;
            break;
        case "catalog":
            btimestamp = store.getState().catalogs.getCatalog(b.id)!
                .created_at!;
            break;
    }
    if (atimestamp > btimestamp) return 1;
    if (atimestamp < btimestamp) return -1;
    return 0;
};

const Menu = Popper.create<HTMLUListElement, IMenu>((props) => {
    return (
        <Popper
            as="ul"
            role="select"
            open={props.open}
            tabIndex={-1}
            anchorEl={props.anchorEl}
            placement="bottom-start"
            onClickAway={props.onClickAway}
            className="focus:outline-none flex w-56 flex-col rounded-md ring-1 ring-gray-800 ring-opacity-5 max-h-52 p-2 bg-white shadow-md overflow-x-hidden">
            {props.options.map((item, index) => (
                <li
                    key={String(index)}
                    role="button"
                    data-menu-name={item.menu}
                    className="flex group p-1.5 rounded-md flex-row items-center hover:bg-primary-500 hover:text-white justify-between text-gray-600 group hover:shadow"
                    onClick={props.onSelect}>
                    <div className="flex flex-row items-center">
                        {item.icon && (
                            <div className="overflow-hidden px-1">
                                {item.icon}
                            </div>
                        )}
                        <span className="px-1 font-semibold text-sm group-hover:text-white">
                            {item.name}
                        </span>
                    </div>
                    <div className="flex flex justify-center items-center invisible group-hover:visible">
                        {item.action}
                    </div>
                </li>
            ))}
        </Popper>
    );
});

export const DirectSpace = React.memo<ISpace>(({ space }) => {
    const authId = useAuthId();

    const uid = space.users.find((id) => id != authId);

    const user = useUser(uid ?? authId);

    const params = useParams<{ space_id: string }>();

    const path = generatePath(paths.chat, {
        space_id: space.id,
    });

    let selected = params.space_id == space.id;

    return (
        <Link
            to={path}
            className={clx(
                "flex flex-row items-center h-8 py-2 mx-4 px-4 rounded-lg group",
                selected ? "bg-primary-500" : "hover:bg-primary-600"
            )}>
            <img
                alt={user.username}
                src={user.avatar}
                className="rounded-full h-6 w-6 shadow"
            />
            <span
                className={clx(
                    "flex-grow px-3 font-bold text-sm overflow-hidden px-4 group-hover:text-white",
                    selected
                        ? "text-white"
                        : " dark:text-gray-200 text-gray-600"
                )}>
                <Text>{user.username}</Text>
            </span>
            <Counter id={space.thread_id} />
        </Link>
    );
});

export const GeneralSpace = React.memo<ISpace>(({ space }) => {
    const dialog = Dialog.useDialog();

    const authid = useAuthId();

    const menuRef = React.useRef<HTMLButtonElement | null>(null);

    const params = useParams<{ space_id: string }>();

    const permissions = useSpacePermissions(space.id);

    const [menu, setMenu] = useState<IMenuItem[]>([]);
    const [creators, setCreators] = useState<IMenuItem[]>([]);

    const catalogs = useSpaceCatalogsIndex(space.id);

    const topics = useSpaceTopicsIndex(space.id);

    const [expaned, setExpaned] = useState<boolean>(true);

    const [hovering, setHovering] = useState<boolean>(false);

    const inSpace = params.space_id === space.id;

    useEffect(() => {
        let menu: IMenuItem[] = [];
        let creators: IMenuItem[] = [];
        if (permissions.get("space.manage") || authid === space.admin_id) {
            menu.push({
                menu: "settings",
                name: "Settings",
                icon: <Icons.Settings />,
            });
        }
        if (
            permissions.get("invite.link.create") ||
            permissions.get("invite.mail.send")
        ) {
            menu.push({
                menu: "invite",
                name: "Invite",
                icon: <Icons.AddUser />,
            });
        }

        if (permissions.get("space.manage")) {
            menu.push({
                menu: "menu",
                name: "create",
                icon: <Icons.Plus />,
            });
            creators.push({
                menu: "catalog",
                name: "Catalog",
                icon: <Icons.Board />,
                action: <Icons.Plus />,
            });
            creators.push({
                menu: "topic",
                name: "Topic",
                icon: <Icons.Topic />,
                action: <Icons.Plus />,
            });
        }
        setMenu(menu);
        setCreators(creators);
    }, [permissions]);

    function handleToggleExpanded(e: React.MouseEvent) {
        e.stopPropagation();
        e.preventDefault();
        setExpaned((ex) => !ex);
    }

    function handleOpenMenu(e: React.MouseEvent) {
        let li = e.target as Node & Element;
        while (li.nodeName != "LI") {
            li = li.parentNode as Node & Element;
        }
        const menu = li.getAttribute("data-menu-name");
        dialog.open(menu);
    }

    function renderSpaceItems() {
        return catalogs
            .map((id: string) => ({ id, type: "catalog" }))
            .concat(topics.map((id: string) => ({ id, type: "topic" })))
            .sort(sortSpaceItems)
            .map((item: ISpaceItem) => {
                if (item.type === "catalog") {
                    return <Catalog key={item.id} id={item.id} />;
                } else {
                    return <Topic key={item.id} id={item.id} />;
                }
            });
    }

    return (
        <React.Fragment>
            <div
                className={
                    "group flex flex-row px-1 h-9 items-center rounded-lg overflow-hidden justify-between"
                }
                onMouseOver={() => setHovering(true)}
                onMouseLeave={() => setHovering(false)}>
                <div
                    className={
                        "flex flex-row items-center overflow-hidden px-4 dark:text-gray-200 text-gray-500"
                    }>
                    <p
                        role="button"
                        onClick={dialog.opener("space")}
                        className="text-sm font-bold truncate">
                        <Text>{space.name}</Text>
                    </p>
                </div>
                <div className="flex flex-row items-center space-x-1 hidden group-hover:flex pr-3">
                    {menu.map((item) => (
                        <button
                            ref={menuRef}
                            key={item.name}
                            className="flex justify-center items-center p-1 text-gray-500 w-6 h-6 dark:hover:text-white hover:text-gray-800 dark:hover:bg-slate-600 hover:bg-slate-300 rounded-md"
                            onClick={dialog.opener(item.menu)}>
                            {item.icon}
                        </button>
                    ))}
                </div>
            </div>
            {creators.length > 0 && (
                <Menu
                    options={creators}
                    open={dialog.menu}
                    onSelect={handleOpenMenu}
                    anchorEl={menuRef.current}
                    onClickAway={dialog.close}
                />
            )}
            {renderSpaceItems()}
            {permissions.get("space.manage") && (
                <React.Fragment>
                    <CreateCatalogDialog
                        space={space}
                        open={dialog.catalog}
                        onClose={dialog.close}
                    />
                    <TopicCreatorDialog
                        space={space}
                        open={dialog.topic}
                        onClose={dialog.close}
                    />
                </React.Fragment>
            )}
            {(permissions.get("space.manage") || authid === space.admin_id) && (
                <SpaceSettingsDialog
                    space={space}
                    open={dialog.settings}
                    onClose={dialog.close}
                />
            )}
            {(permissions.get("invite.mail.send") ||
                permissions.get("invite.link.create")) && (
                <InviteDialog
                    open={dialog.invite}
                    space={space}
                    onClose={dialog.close}
                />
            )}
            <SpaceDialog
                space={space}
                open={dialog.space}
                onClose={dialog.close}
            />
            <div className="h-4" />
        </React.Fragment>
    );
});

export default React.memo<ISpace>((props) => {
    if (props.space.is_direct) {
        return <DirectSpace {...props} />;
    } else {
        return <GeneralSpace {...props} />;
    }
});
