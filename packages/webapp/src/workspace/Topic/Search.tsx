import React, { useState } from "react";
import clx from "classnames";
import { useScreen, useInput } from "src/hooks";
import * as Icons from "@octal/icons";
import UserAvatar from "@workspace/UserAvatar";
import { Datepicker, Popper } from "@octal/ui";
import { Dialog, Button, Textarea } from "@octal/ui";
import { TopicRecord, MemberRecord } from "@octal/store";
import moment from "moment";
import MembersPopper from "@workspace/Space/MembersPopper";

interface ISearch {
    topic: TopicRecord;
}

interface IDatePicker {
    value: string;
    onChange: (e: any, value: string) => void;
    onClear: (e: any) => void;
}

const DatePopper = Popper.create<HTMLDivElement, IDatePicker>((props) => {
    return (
        <Popper
            open={props.open}
            anchorEl={props.anchorEl}
            className="bg-white rounded-md shadow border border-gray-200"
            onClickAway={props.onClickAway}>
            <Datepicker
                onChange={props.onChange}
                onClear={props.onClear}
                value={props.value}
            />
        </Popper>
    );
});

export default Dialog.create<ISearch>((props) => {
    const dialog = Dialog.useDialog();
    const screen = useScreen();
    const input = useInput("");
    const [users, setUsers] = useState<string[]>([]);
    const [from, setFrom] = useState<string>();
    const [upto, setUpto] = useState<string>();
    const usersRef = React.useRef<HTMLDivElement | null>(null);
    const fromRef = React.useRef<HTMLButtonElement | null>(null);
    const uptoRef = React.useRef<HTMLButtonElement | null>(null);

    function handleUserInput(member: MemberRecord) {
        setUsers((users) =>
            users.includes(member.user_id)
                ? users.filter((id) => id !== member.user_id)
                : users.concat([member.user_id])
        );
    }

    return (
        <Dialog.Base
            open={props.open}
            onClose={props.onClose}
            maxWidth="md"
            fullWidth={true}
            className="h-5/6"
            fullScreen={screen.mobile}>
            <div className="flex p-4 flex-row justify-between overflow-hidden space-x-4">
                <div className="w-2/5 flex-row overflow-hidden">
                    <div className="relative border border-gray-400 items-center max-w-full overflow-hidden rounded-md shadow">
                        <Textarea
                            value=""
                            onChange={input.setValue}
                            placeholder="Quick search topic"
                            className="pl-9 w-full max-w-full font-semibold outline-none placeholder:text-gray-400 bg-transparent text-gray-700 focus:ring-primary-500 ring-gray-400 ring-2 rounded py-1 px-2 text-base"
                        />
                        <div className="px-2 absolute top-1 w-9 h-9">
                            <Icons.Search className="text-gray-500" />
                        </div>
                    </div>
                </div>
                <div className="flex-1 h-8 flex flex-row space-x-2 justify-end">
                    <div
                        role="button"
                        ref={usersRef}
                        className="flex flex-1 flex-row items-center space-x-2"
                        onClick={dialog.opener("users")}>
                        <div className="flex -space-x-2 overflow-hidden">
                            <div className="inline-block w-8 h-8 rounded-full bg-slate-400 flex items-center justify-center z-50 ring-2 ring-white">
                                <Icons.Users className="text-white w-4 h-4" />
                            </div>
                            {users.slice(0, 4).map((id, index) => (
                                <UserAvatar
                                    uid={id}
                                    key={id}
                                    tooltip={true}
                                    className={clx(
                                        "inline-block w-8 h-8 rounded-full ring-2 ring-white ",
                                        {
                                            "z-[49]": index == 0,
                                            "z-[48]": index == 1,
                                            "z-[47]": index == 2,
                                            "z-[46]": index == 3,
                                            "z-[45]": index == 4,
                                        }
                                    )}
                                />
                            ))}

                            {users.length > 4 && (
                                <div className="inline-block w-8 h-8 rounded-full bg-slate-400 flex items-center justify-center z-0 ring-2 ring-white">
                                    <Icons.Plus className="text-white w-4 h-4" />
                                </div>
                            )}
                        </div>
                    </div>
                    <button
                        ref={fromRef}
                        onClick={dialog.opener("from")}
                        className="flex flex-row items-center rounded-md bg-slate-100 hover:bg-slate-200 px-2 text-gray-500 space-x-2">
                        <Icons.Calendar.Day className="" />
                        {Boolean(from) ? (
                            <span className="text-sm font-bold">
                                {moment(from).format("ll")}
                            </span>
                        ) : (
                            <span className="invisible text-sm font-bold">
                                {moment().format("ll")}
                            </span>
                        )}
                    </button>
                    <div className="flex flex-col justify-center">
                        <div className="h-0.5 bg-slate-500 w-2 rounded-md" />
                    </div>
                    <button
                        ref={uptoRef}
                        onClick={dialog.opener("to")}
                        className="flex flex-row items-center text-gray-500 rounded-md bg-slate-100 hover:bg-slate-200 px-2 space-x-2">
                        <Icons.Calendar.Day className="" />
                        {Boolean(upto) ? (
                            <span className="text-sm font-bold">
                                {moment(upto).format("ll")}
                            </span>
                        ) : (
                            <span className="invisible text-sm font-bold">
                                {moment().format("ll")}
                            </span>
                        )}
                    </button>
                    <Button variant="icon" onClick={props.onClose}>
                        <Icons.Close className="text-gray-500" />
                    </Button>
                </div>
            </div>
            <div className="flex-1 flex flex-row flex-grow overflow-hidden px-4">
                <div className="bg-gray-400 w-5 h-[1000px]" />
            </div>
            <MembersPopper
                selected={users}
                open={dialog.users}
                onSelect={handleUserInput}
                anchorEl={usersRef.current}
                onClickAway={dialog.close}
            />
            <DatePopper
                value={from ?? ""}
                anchorEl={fromRef.current}
                onChange={(a: any, b: any) => setFrom(b)}
                open={dialog.from}
                onClickAway={dialog.close}
                onClear={() => setFrom("")}
            />
            <DatePopper
                value={upto ?? ""}
                anchorEl={uptoRef.current}
                onChange={(a: any, b: any) => setUpto(b)}
                open={dialog.to}
                onClickAway={dialog.close}
                onClear={() => setUpto("")}
            />
        </Dialog.Base>
    );
});
