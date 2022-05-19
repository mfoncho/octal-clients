import React, { useState } from "react";
import clx from "classnames";
import { Link, generatePath, useParams } from "react-router-dom";
import { Text, Collapse, Dialog, Popper } from "@octal/ui";
import TopicCreatorDialog from "../Space/CreateTopic";
import CreateBoardDialog from "../Space/CreateBoardDialog";
import paths from "src/paths/workspace";
import Counter from "./Counter";
import Topic from "./Topic";
import Board from "./Board";
import { BsThreeDots as MenuIcon } from "react-icons/bs";
import SpaceSettingsDialog from "../SpaceSettingsDialog";
import {
    SpaceRecord,
    useUser,
    useAuthId,
    useSpaceBoardsIndex,
    useSpaceTopicsIndex,
} from "@octal/store";

export interface ISpace {
    space: SpaceRecord;
}

export interface IMenu {
    onSelect: (e: React.MouseEvent) => void;
}

const options = [
    {
        menu: "topic",
        name: "Topic",
    },
    {
        menu: "board",
        name: "Board",
    },
    {
        menu: "settings",
        name: "Settings",
    },
];

const Menu = Popper.create<HTMLUListElement, IMenu>((props) => {
    return (
        <Popper
            as="ul"
            role="select"
            open={props.open}
            tabIndex={-1}
            distance={10}
            anchorEl={props.anchorEl}
            placement="bottom-start"
            onClickAway={props.onClickAway}
            className="focus:outline-none flex w-56 flex-col rounded-md ring-1 ring-gray-800 ring-opacity-5 max-h-52 p-2 bg-white shadow-md overflow-x-hidden">
            {options.map((item, index) => (
                <li
                    key={String(index)}
                    data-menu-name={item.menu}
                    className="flex group p-1.5 rounded-md flex-row items-center hover:bg-primary-500 hover:text-white"
                    onClick={props.onSelect}>
                    <span className="px-1 font-semibold text-sm group-hover:text-white">
                        {item.name}
                    </span>
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
                "flex flex-row pl-2 px-2 items-center h-8",
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

    const menuRef = React.useRef<HTMLButtonElement | null>(null);

    const params = useParams<{ space_id: string }>();

    const boards = useSpaceBoardsIndex(space.id);

    const topics = useSpaceTopicsIndex(space.id);

    const [expaned, setExpaned] = useState<boolean>(true);

    const [hovering, setHovering] = useState<boolean>(false);

    const highlight = params.space_id == space.id && !expaned;

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
                <button
                    ref={menuRef}
                    className={clx(
                        "flex justify-center items-center p-1 bg-gray-200 text-gray-500 rounded-md w-6 h-6",
                        !hovering && "invisible"
                    )}
                    onClick={dialog.opener("menu")}>
                    <MenuIcon />
                </button>
            </div>
            <Menu
                open={dialog.menu}
                onSelect={handleOpenMenu}
                anchorEl={menuRef.current}
                onClickAway={dialog.close}
            />
            <Collapse unmountOnExit={false} in={expaned}>
                {renderBoards()}
                {renderTopics()}
            </Collapse>
            <SpaceSettingsDialog
                space={space}
                open={dialog.settings}
                onClose={dialog.close}
            />
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
    );
});

export default React.memo<ISpace>((props) => {
    if (props.space.is_direct) {
        return <DirectSpace {...props} />;
    } else {
        return <GeneralSpace {...props} />;
    }
});
