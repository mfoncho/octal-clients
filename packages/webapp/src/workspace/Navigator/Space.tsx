import React, { useState, useEffect } from "react";
import clx from "classnames";
import { Link, generatePath, useParams } from "react-router-dom";
import { Text, Collapse, Dialog, Popper } from "@colab/ui";
import TopicCreatorDialog from "../Space/CreateTopic";
import CreateBoardDialog from "../Space/CreateBoardDialog";
import paths from "src/paths/workspace";
import Counter from "./Counter";
import * as Icons from "@colab/icons";
import Topic from "./Topic";
import Board from "./Board";
import SpaceSettingsDialog from "../SpaceSettingsDialog";
import InviteDialog from "../InviteDialog";
import store, {
    SpaceRecord,
    useUser,
    useAuthId,
    useSpacePermissions,
    useSpaceBoardsIndex,
    useSpaceTopicsIndex,
} from "@colab/store";

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

const sortTopics = (aid: string, bid: string) => {
    let a = store.getState().topics.getTopic(aid)!;
    let b = store.getState().topics.getTopic(bid)!;
    if (a.created_at > b.created_at) return 1;
    if (a.created_at < b.created_at) return -1;
    return 0;
};

const sortBoards = (aid: string, bid: string) => {
    let a = store.getState().boards.getBoard(aid)!;
    let b = store.getState().boards.getBoard(bid)!;
    if (a.created_at > b.created_at) return 1;
    if (a.created_at < b.created_at) return -1;
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
                "flex flex-row pl-2 px-2 items-center h-8 py-2",
                selected ? "bg-primary-500" : "hover:bg-primary-800"
            )}>
            <img
                alt={user.username}
                src={user.avatar_url}
                className="rounded-full h-7 w-7 shadow"
            />
            <span
                className={clx(
                    "flex-grow px-2 font-bold text-sm",
                    selected ? "text-white" : "text-primary-200"
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

    const boards = useSpaceBoardsIndex(space.id);

    const topics = useSpaceTopicsIndex(space.id);

    const [expaned, setExpaned] = useState<boolean>(true);

    const [hovering, setHovering] = useState<boolean>(false);

    const highlight = params.space_id == space.id && !expaned;

    useEffect(() => {
        let menu: IMenuItem[] = [];
        let creators: IMenuItem[] = [];
        if (permissions.get("space.manage")) {
            menu.push({
                menu: "menu",
                name: "create",
                icon: <Icons.Plus />,
            });
            creators.push({
                menu: "board",
                name: "Board",
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

        if (permissions.get("space.manage") || authid === space.admin_id) {
            menu.push({
                menu: "settings",
                name: "Settings",
                icon: <Icons.Settings />,
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

    function renderBoards() {
        return boards
            .sort(sortBoards)
            .map((id) => {
                return <Board key={id} id={id} />;
            })
            .toList();
    }

    function renderTopics() {
        return topics.sort(sortTopics).map((id) => {
            return <Topic key={id} id={id} />;
        });
    }

    return (
        <React.Fragment>
            <div
                className={clx(
                    "group flex flex-row pt-1 mt-5 pb-1 px-2 items-center rounded cursor-pointer overflow-hidden h-8 justify-between",
                    highlight && " bg-primary-500"
                )}
                onMouseOver={() => setHovering(true)}
                onMouseLeave={() => setHovering(false)}>
                <p
                    onClick={handleToggleExpanded}
                    className={clx(
                        "text-xs font-semibold truncate",
                        highlight ? "text-white" : "text-primary-200"
                    )}>
                    <Text>{space.name.toUpperCase()}</Text>
                </p>
                <div className="flex flex-row items-center hidden group-hover:flex">
                    {menu.map((item) => (
                        <button
                            key={item.name}
                            ref={menuRef}
                            className={clx(
                                "flex justify-center items-center p-1 text-white w-6 h-6"
                            )}
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
            {(permissions.get("invite.mail.send") ||
                permissions.get("invite.link.create")) && (
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
