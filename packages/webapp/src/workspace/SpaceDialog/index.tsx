import React, { useState } from "react";
//import * as Icons from "@colab/icons";
import { Scrollbars } from "react-custom-scrollbars";
import { useDispatch } from "react-redux";
import UserRecord from "@workspace/UserCard";
import { Avatar, Dialog, Markdown, UIEvent } from "@colab/ui";
import {
    useMembers,
    Actions,
    useAuthId,
    MemberRecord,
    SpaceRecord,
    useUser,
} from "@colab/store";

interface IDialog {
    space: SpaceRecord;
}

interface ILeaveDialog {
    space: SpaceRecord;
    onConfirm: () => void;
    loading?: boolean;
}

interface IView {
    space: SpaceRecord;
}

interface IMember {
    member: MemberRecord;
}

interface ITab<T = string> {
    value: T;
    children?: any;
    active: boolean;
    onClick?: (e: UIEvent<{ value: T }>) => void;
}

const warning = (space: SpaceRecord) => `
You are about to leave space __${space.name}__
`;

export const LeaveWarning = Dialog.create<ILeaveDialog>(
    ({ space, ...props }) => {
        return (
            <Dialog.Warning
                open={props.open}
                title="Leave Space"
                onClose={props.loading ? undefined : props.onClose}
                disabled={props.loading}
                onConfirm={props.onConfirm}>
                {warning(space)}
            </Dialog.Warning>
        );
    }
);

function Member(props: IMember) {
    const user = useUser(props.member.user_id);
    const [record, handleOpenRecord] = UserRecord.useRecord(
        props.member.user_id
    );
    return (
        <div className="group flex flex-col my-1 p-1 rounded-md hover:bg-primary-500 justify-between">
            <div
                role="button"
                onClick={handleOpenRecord}
                className="flex flex-row">
                <Avatar alt={user.username} src={user.avatar} />
                <div className="flex flex-col px-2">
                    <span className="font-bold group-hover:text-white text-gray-800 text-base">
                        {user.username}
                    </span>
                    <span className="group-hover:text-white font-semibold text-xs text-gray-500">
                        {user.name}
                    </span>
                </div>
            </div>
            {record}
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
    const authid = useAuthId();
    const dispatch = useDispatch();
    const [warning, setWarning] = useState<boolean>(false);
    const [leaving, setLeaving] = useState<boolean>(false);

    const notLeavable = leaving || authid == props.space.admin_id;

    function handleLeave() {
        if (notLeavable) return;
        const action = Actions.Space.leaveSpace(props.space.id);
        dispatch(action).finally(() => setLeaving(false));
        setLeaving(true);
    }
    return (
        <div className="flex flex-col overflow-y-auto px-4 h-full w-full justify-between">
            <div className="p-2 bg-slate-100 rounded-md my-4 text-base">
                <Markdown>{props.space.purpose}</Markdown>
            </div>
            {props.space.is_public && (
                <div className="flex flex-row justify-end px-4 pb-8 pt-4">
                    <button
                        onClick={() => setWarning(true)}
                        disabled={notLeavable}
                        className="bg-red-500 font-bold px-4 py-2 rounded-lg text-white disabled:bg-red-200">
                        Leave
                    </button>
                    <LeaveWarning
                        space={props.space}
                        onConfirm={handleLeave}
                        loading={leaving}
                        open={warning}
                        onClose={() => setWarning(false)}
                    />
                </div>
            )}
        </div>
    );
}

export const Tab = (props: ITab) =>
    props.active ? (
        <button
            onClick={(e) =>
                props.onClick
                    ? props.onClick(UIEvent.create({ value: props.value }, e))
                    : null
            }
            className="bg-slate-300 font-bold text-gray-700 rounded-full py-1 px-4 justify-center text-sm focus:ring-4 ring-slate-200">
            {props.children}
        </button>
    ) : (
        <button
            onClick={(e) =>
                props.onClick
                    ? props.onClick(UIEvent.create({ value: props.value }, e))
                    : null
            }
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
    function handleTabClick(e: UIEvent<{ value: string }>) {
        setTab(e.target.value);
    }
    return (
        <Dialog
            title={props.space.name.toLocaleUpperCase()}
            maxWidth="xs"
            fullWidth={true}
            fullHeight={true}
            open={props.open}
            onClose={props.onClose}>
            <div className="flex flex-row bg-slate-100 px-5 py-3 overflow-x-auto space-x-4">
                {tabs.map((config) => (
                    <Tab
                        key={config.name}
                        value={config.name.toLowerCase()}
                        active={tab == config.name.toLowerCase()}
                        onClick={handleTabClick}>
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
