import React from "react";
import * as uuid from "uuid";
import clx from "classnames";
import moment from "moment";
import { io, Page } from "@colab/client";
import { useScreen, useInput } from "src/hooks";
import * as Icons from "@colab/icons";
import PerfectScrollbar from "react-perfect-scrollbar";
import UserAvatar from "@workspace/UserAvatar";
import SearchMessage from "@workspace/Message/SearchMessage";
import { useActions } from "./hooks";
import { Datepicker, Popper } from "@colab/ui";
import { useDebouncedEffect } from "@colab/hooks";
import { Dialog, Button, Textarea, UIEvent } from "@colab/ui";
import { ThreadRecord, MemberRecord, useThreadSearchFilter } from "@colab/store";
import MembersPopper from "@workspace/Space/MembersPopper";
import Pagination from "@mui/material/Pagination";

interface ISearch {
    thread: ThreadRecord;
}

interface Result extends Page<io.Message> {
    id: string;
    pending: boolean;
}

interface IDatePicker {
    value: string;
    onChange: (e: UIEvent) => void;
    onClear: (e: any) => void;
}

const scrollbarOptions = {
    suppressScrollX: true,
    suppressScrollY: false,
};

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

const defaultResult = {
    id: "",
    entries: [],
    page_size: 0,
    total_pages: 0,
    page_number: 0,
    total_entries: 0,
    pending: false,
};

export default Dialog.create<ISearch>((props) => {
    const actions = useActions(props.thread);
    const dialog = Dialog.useDialog();
    const screen = useScreen();
    const filter = useThreadSearchFilter(props.thread.id);
    const [page, setPage] = React.useState<number>(1);
    const input = useInput(filter.search);
    const [results, setResults] = React.useState<Result>(defaultResult);
    const usersRef = React.useRef<HTMLDivElement | null>(null);
    const fromRef = React.useRef<HTMLButtonElement | null>(null);
    const uptoRef = React.useRef<HTMLButtonElement | null>(null);

    function handleUserInput(member: MemberRecord) {
        const users = filter.users.includes(member.user_id)
            ? filter.users.filter((id) => id !== member.user_id)
            : filter.users.push(member.user_id);
        actions.updateFilter("users", users.toArray());
    }

    useDebouncedEffect(
        () => {
            actions.updateFilter("search", input.value);
        },
        700,
        [input.value]
    );

    React.useEffect(() => {
        if (filter.users.size > 0 || filter.search.trim().length > 0) {
            const id = uuid.v1();
            actions
                .searchThread({
                    page: page,
                    query: filter.search,
                    users: filter.users.toArray(),
                    before: moment(filter.until).add({ day: 1 }).toISOString(),
                    after: moment(filter.since)
                        .subtract({ day: 1 })
                        .toISOString(),
                })
                .then((data) =>
                    setResults((state) => {
                        if (id == state.id) {
                            return { ...state, ...data, pending: false };
                        }
                        return state;
                    })
                );
            setResults((state) => ({
                ...state,
                id,
                pending: true,
            }));
        }
    }, [
        page,
        filter.search.trim(),
        filter.users.toArray().sort().join(","),
        filter.since,
        filter.until,
    ]);

    function handleSinceClear(_event: UIEvent) {
        actions.updateFilter("since", "");
    }
    function handleSinceChange(event: UIEvent) {
        actions.updateFilter("since", event.target.value);
    }

    function handleUntilClear(_event: UIEvent) {
        actions.updateFilter("until", "");
    }
    function handleUntilChange(event: UIEvent) {
        actions.updateFilter("until", event.target.value);
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
                            placeholder="Quick search"
                            className="pl-9 w-full max-w-full font-semibold outline-none placeholder:text-gray-400 bg-transparent text-gray-700 focus:ring-primary-500 ring-gray-400 ring-2 rounded py-1 px-2 text-base"
                            {...input.props}
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
                            {filter.users.slice(0, 4).map((id, index) => (
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

                            {filter.users.size > 4 && (
                                <div className="inline-block w-8 h-8 rounded-full bg-slate-400 flex items-center justify-center z-0 ring-2 ring-white">
                                    <Icons.Plus className="text-white w-4 h-4" />
                                </div>
                            )}
                        </div>
                    </div>
                    <button
                        ref={fromRef}
                        onClick={dialog.opener("since")}
                        className="flex flex-row items-center rounded-md bg-slate-100 hover:bg-slate-200 px-2 text-gray-500 space-x-2">
                        <Icons.Calendar.Day className="" />
                        {Boolean(filter.since) ? (
                            <span className="text-sm font-bold">
                                {moment(filter.since).format("ll")}
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
                        onClick={dialog.opener("until")}
                        className="flex flex-row items-center text-gray-500 rounded-md bg-slate-100 hover:bg-slate-200 px-2 space-x-2">
                        <Icons.Calendar.Day className="" />
                        {Boolean(filter.until) ? (
                            <span className="text-sm font-bold">
                                {moment(filter.until).format("ll")}
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
            <div className="flex-1 flex flex-col flex-grow overflow-hidden px-4">
                <PerfectScrollbar
                    options={scrollbarOptions}
                    className="flex-1 flex flex-col  space-y-2 pb-16 overflow-y-hidden">
                    {results.entries.map((message) => (
                        <SearchMessage key={message.id} message={message} />
                    ))}
                </PerfectScrollbar>
                <div className="flex flex-row justify-end p-4 justify-center">
                    {results.total_entries > 0 && (
                        <Pagination
                            variant="outlined"
                            page={results.page_number}
                            count={results.total_pages}
                            onChange={(_e, page) => setPage(page)}
                        />
                    )}
                </div>
            </div>
            <MembersPopper
                selected={filter.users.toArray()}
                open={dialog.users}
                onSelect={handleUserInput}
                anchorEl={usersRef.current}
                onClickAway={dialog.close}
            />
            <DatePopper
                value={filter.since}
                anchorEl={fromRef.current}
                onChange={handleSinceChange}
                open={dialog.since}
                onClickAway={dialog.close}
                onClear={handleSinceClear}
            />
            <DatePopper
                value={filter.until}
                anchorEl={uptoRef.current}
                onChange={handleUntilChange}
                open={dialog.until}
                onClickAway={dialog.close}
                onClear={handleUntilClear}
            />
        </Dialog.Base>
    );
});
