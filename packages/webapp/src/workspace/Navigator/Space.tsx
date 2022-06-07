import React, { useState, useEffect } from "react";
import clx from "classnames";
import { Link, generatePath, useParams } from "react-router-dom";
import { Text, Collapse, Dialog, Popper } from "@octal/ui";
import TopicCreatorDialog from "../Space/CreateTopic";
import CreateBoardDialog from "../Space/CreateBoardDialog";
import paths from "src/paths/workspace";
import Counter from "./Counter";
import * as Icons from "@octal/icons";
import Topic from "./Topic";
import Board from "./Board";
import { BsThreeDots as MenuIcon } from "react-icons/bs";
import SpaceSettingsDialog from "../SpaceSettingsDialog";
import InviteDialog from "../InviteDialog";
import {
    SpaceRecord,
    useUser,
    useAuthId,
    useSpacePermissions,
    useSpaceBoardsIndex,
    useSpaceTopicsIndex,
} from "@octal/store";

export interface ISpace {
    space: SpaceRecord;
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
    const notification = 0;

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
                "flex flex-row pl-2 px-2 items-center h-8 py-2",
                selected ? "bg-primary-500" : "hover:bg-slate-200"
            )}>
            <img
                alt={user.username}
                src={user.avatar}
                className="rounded-full h-7 w-7 shadow"
            />
            <span
                className={clx(
                    "flex-grow px-2 font-bold text-sm",
                    selected ? "text-white" : "text-gray-500"
                )}>
                <Text>{user.username}</Text>
            </span>
            <Counter value={notification} />
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

    const boards = useSpaceBoardsIndex(space.id);

    const topics = useSpaceTopicsIndex(space.id);

    const [expaned, setExpaned] = useState<boolean>(true);

    const [hovering, setHovering] = useState<boolean>(false);

    const highlight = params.space_id == space.id && !expaned;

    useEffect(() => {
        let menu: IMenuItem[] = [];
        if (permissions.get("space.manage")) {
            menu.push({
                icon: <Icons.Board />,
                menu: "board",
                name: "Board",
                action: <Icons.Plus />,
            });
        }
        if (permissions.get("space.manage")) {
            menu.push({
                menu: "topic",
                icon: <Icons.Topic />,
                name: "Topic",
                action: <Icons.Plus />,
            });
        }

        if (permissions.get("invitation.send")) {
            menu.push({
                icon: <Icons.AddUser />,
                menu: "invite",
                name: "Invite",
            });
        }

        if (permissions.get("space.manage") || authid === space.admin_id) {
            menu.push({
                icon: <Icons.Settings />,
                menu: "settings",
                name: "Settings",
            });
        }
        setMenu(menu);
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

    function renderBoards() {
        return boards
            .map((id) => {
                return <Board key={id} id={id} />;
            })
            .toList();
    }

    function renderTopics() {
        return topics.map((id) => {
            return <Topic key={id} id={id} />;
        });
    }

    return (
        <React.Fragment>
            <div
                className={clx(
                    "flex flex-row pt-1 mt-5 pb-1 px-2 items-center rounded cursor-pointer",
                    highlight && " bg-primary-500"
                )}
                onMouseOver={() => setHovering(true)}
                onMouseLeave={() => setHovering(false)}>
                <span
                    onClick={handleToggleExpanded}
                    className={clx(
                        "flex-grow text-xs font-semibold",
                        highlight ? "text-white" : "text-gray-500"
                    )}>
                    <Text>{space.name.toUpperCase()}</Text>
                </span>
                {menu.length > 0 && (
                    <button
                        ref={menuRef}
                        className={clx(
                            "flex justify-center items-center p-1 bg-gray-200 text-gray-500 rounded-md w-6 h-6",
                            !hovering && "invisible"
                        )}
                        onClick={dialog.opener("menu")}>
                        <MenuIcon />
                    </button>
                )}
            </div>
            {menu.length > 0 && (
                <Menu
                    options={menu}
                    open={dialog.menu}
                    onSelect={handleOpenMenu}
                    anchorEl={menuRef.current}
                    onClickAway={dialog.close}
                />
            )}
            <Collapse unmountOnExit={false} in={expaned}>
                {renderBoards()}
                {renderTopics()}
            </Collapse>
            {permissions.get("space.manage") && (
                <React.Fragment>
                    <CreateBoardDialog
                        space={space}
                        open={dialog.board}
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
            {permissions.get("invitation.send") && (
                <InviteDialog
                    open={dialog.invite}
                    space={space}
                    onClose={dialog.close}
                />
            )}
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
