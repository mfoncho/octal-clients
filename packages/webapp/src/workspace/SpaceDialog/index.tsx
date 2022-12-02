import React, { useState } from "react";
//import * as Icons from "@colab/icons";
import { Scrollbars } from "react-custom-scrollbars";
import { useDispatch } from "react-redux";
import UserCard from "@workspace/UserCard";
import { Avatar, Dialog, Text } from "@colab/ui";
import {
    useMembers,
    Actions,
    MemberRecord,
    SpaceRecord,
    useUser,
} from "@colab/store";

interface IDialog {
    space: SpaceRecord;
}

interface IView {
    space: SpaceRecord;
}

interface IMember {
    member: MemberRecord;
}

interface ITab {
    children?: any;
    active: boolean;
    onClick?: () => void;
}

function Member(props: IMember) {
    const user = useUser(props.member.user_id);
    const [card, handleOpenCard] = UserCard.useCard(props.member.user_id);
    return (
        <div className="group flex flex-col my-1 p-1 rounded-md hover:bg-primary-500 justify-between">
            <div
                role="button"
                onClick={handleOpenCard}
                className="flex flex-row">
                <Avatar alt={user.username} src={user.avatar_url} />
                <div className="flex flex-col px-2">
                    <span className="font-bold group-hover:text-white text-gray-800 text-base">
                        {user.username}
                    </span>
                    <span className="group-hover:text-white font-semibold text-xs text-gray-500">
                        {user.name}
                    </span>
                </div>
            </div>
            {card}
        </div>
    );
}

function Members(props: IView) {
    const members = useMembers(props.space.id);
    return (
        <div className="flex flex-col overflow-hidden px-4 h-full w-full">
            <Scrollbars style={{ width: "100%", height: "100%" }}>
                {members
                    .map((member) => <Member key={member.id} member={member} />)
                    .toList()}
            </Scrollbars>
        </div>
    );
}

function About(props: IView) {
    const dispatch = useDispatch();
    const [leaving, setLeaving] = useState<boolean>(false);

    function handleLeave() {
        if (leaving) return;
        const action = Actions.Space.leaveSpace(props.space.id);
        dispatch(action).finally(() => setLeaving(false));
        setLeaving(true);
    }
    return (
        <div className="flex flex-col overflow-y-auto px-4 h-full w-full justify-between">
            <div className="p-2 bg-slate-100 rounded-md my-4">
                <Text>{props.space.purpose}</Text>
            </div>
            {props.space.is_public && (
                <div className="flex flex-row justify-end px-4 pb-8 pt-4">
                    <button
                        onClick={handleLeave}
                        disabled={leaving}
                        className="bg-red-500 font-bold px-4 py-2 rounded-lg text-white disabled:bg-red-200">
                        Leave
                    </button>
                </div>
            )}
        </div>
    );
}

const Tab = (props: ITab) =>
    props.active ? (
        <button
            onClick={props.onClick}
            className="bg-slate-300 font-bold text-gray-700 rounded-full py-1 px-4 justify-center text-sm focus:ring-4 ring-slate-200">
            {props.children}
        </button>
    ) : (
        <button
            onClick={props.onClick}
            className="font-bold text-gray-600 rounded-full py-1 px-4 justify-center text-sm hover:bg-slate-200 hover:text-gray-700">
            {props.children}
        </button>
    );

const tabs = [
    { name: "About", component: About },
    { name: "Members", component: Members },
];

export default Dialog.create<IDialog>((props) => {
    const [tab, setTab] = useState<string>("about");
    const View = tabs.find(
        (config) => config.name.toLowerCase() === tab
    )?.component;
    return (
        <Dialog
            title={props.space.name.toLocaleUpperCase()}
            maxWidth="xs"
            fullWidth={true}
            fullHeight={true}
            open={props.open}
            onClose={props.onClose}>
            <div className="flex flex-row bg-slate-100 px-5 py-3 overflow-x-auto space-x-2">
                {tabs.map((config) => (
                    <Tab
                        key={config.name}
                        active={tab == config.name.toLowerCase()}
                        onClick={() => setTab(config.name.toLowerCase())}>
                        {config.name}
                    </Tab>
                ))}
            </div>
            <div className="flex flex-1 flex-col overflow-hidden">
                {View && <View space={props.space} />}
            </div>
        </Dialog>
    );
});
