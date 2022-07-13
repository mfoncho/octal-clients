import React, { useState, useEffect, useRef } from "react";
import immutable from "immutable";
import moment from "moment";
import { useDispatch } from "react-redux";
import Message from "../Message";
import PerfectScrollbar from "react-perfect-scrollbar";
import { OrderedMap } from "immutable";
import * as ThreadActionFactory from "@octal/store/lib/actions/thread";
import { ThreadRecord, useAuthId, useMessage } from "@octal/store";
import { useCurPrev } from "@octal/hooks";

window.Immutable = immutable;

interface IChatMsg {
    id: string;
    user_id: string;
    reply_id: string;
    timestamp: string;
}

interface IConversation {
    authid: string;
    messages: OrderedMap<string, IChatMsg>;
}

interface IThread {
    thread: ThreadRecord;
}

type Writeable<T> = { -readonly [P in keyof T]: T[P] };

enum Scroll {
    Down,
    Up,
}

/*
 * Element scroll position in container
 * container scrollTop
 *      = element.offsetTop - (element.getBoundingClientRect().top - container.getBoundingClientRect().top)
 *
 */

const scrollerOptions = {
    suppressScrollX: true,
    suppressScrollY: false,
};

const Msg = React.memo<{ id: string; extra: boolean; authid: string }>(
    ({ id, extra, authid }) => {
        const message = useMessage(id);
        if (message) {
            return (
                <Message
                    message={message}
                    authid={authid}
                    menu={true}
                    tsformat="h:mm A"
                    extra={extra}
                />
            );
        } else {
            return <></>;
        }
    }
);

Msg.displayName = "Msg";

export const Messages = React.memo<IConversation>(({ messages, authid }) => {
    let sameday = false;
    let sameauthor = false;

    let previous: IChatMsg;

    function renderMessage(message: IChatMsg) {
        let block: JSX.Element[] = [];
        const timestamp = moment(message.timestamp);

        if (previous) {
            const prevtimestamp = moment(previous.timestamp);
            sameday = timestamp.format("l") === prevtimestamp.format("l");
            sameauthor = previous.user_id === message.user_id;
        }

        previous = message;

        const extra = !sameday || !sameauthor || Boolean(message.reply_id);

        let id = `message:${message.id}`;

        if (!sameday) {
            let date = moment(message.timestamp);
            block.push(
                <div
                    id={date.format("DD-MM-YYYY")}
                    key="divider"
                    className="pt-2 flex flex-row justify-between items-center px-2">
                    <div className="bg-slate-200 h-px flex-grow rounded" />
                    <span className="text-gray-800 bg-slate-200 text-xs font-bold px-4 rounded-xl">
                        {date.format("ll")}
                    </span>
                    <div className="bg-slate-200 h-px flex-grow rounded" />
                </div>
            );
        }

        if (extra) {
            block.push(
                <div key={id} id={id} className="pt-2">
                    <Msg authid={authid} extra={extra} id={message.id} />
                </div>
            );
        } else {
            block.push(
                <div key={id} id={id}>
                    <Msg
                        authid={authid}
                        extra={false}
                        id={message.id}
                        key={message.id}
                    />
                </div>
            );
        }

        return <React.Fragment key={message.id}>{block}</React.Fragment>;
    }

    return (
        <React.Fragment>{messages.map(renderMessage).toList()}</React.Fragment>
    );
});

Messages.displayName = "Messages";

const perPage = 50;

const loadingState = {
    top: false,
    bottom: false,
};

export default React.memo<IThread>(function ({ thread }) {
    const dispatch = useDispatch();

    const authid = useAuthId();

    const [page, setPage] = useState(thread.page);

    const pageRef = React.useRef<typeof page>(page);
    pageRef.current = page;

    const [loading, setLoading] = useState(loadingState);

    const [, prevLastMessage] = useCurPrev(thread.history.last());
    const [, prevScrollPercentage] = useCurPrev(page.scrollPercentage);

    const pageHistory = React.useMemo(() => {
        if (thread.page.pivot) {
            return thread.historyAround(thread.page.pivot, perPage);
        }

        return thread.history.takeLast(41);
    }, [thread.history, thread.page.pivot]);

    const [container, setContainer] = useState<HTMLElement | null>(null);

    const header = useRef<HTMLDivElement | null>(null);
    const footer = useRef<HTMLDivElement | null>(null);

    const [init, setInit] = useState(false);

    function isScrollable() {
        const viewHeight = container?.clientHeight ?? 0;
        const headerTop =
            header.current?.getBoundingClientRect().top ?? viewHeight;
        const footerTop =
            footer.current?.getBoundingClientRect().top ?? viewHeight;

        const topInView = headerTop > 0 && headerTop < viewHeight;
        const bottomInView = footerTop > 0 && footerTop - 80.6 < viewHeight;

        return !topInView || !bottomInView;
    }

    function messageRect(id: string) {
        let element = document.getElementById(`message:${id}`);
        return element?.getBoundingClientRect();
    }

    useEffect(() => {
        if (!thread.history.isEmpty()) {
            let lastPageId = pageHistory.last()?.id;
            let firstPageId = pageHistory.first()?.id;
            let lastThreadId = thread.history.last()?.id;
            let firstThreadId = thread.history.first()?.id;
            let reachedThreadLast = lastPageId === lastThreadId;
            let reachedThreadFirst = firstPageId === firstThreadId;

            if (page.scrollPercentage > 80 && !reachedThreadLast) {
                const action = ThreadActionFactory.updateThreadPage(
                    thread.id,
                    page.toObject()
                );
                dispatch(action);
            } else if (page.scrollPercentage < 30 && !reachedThreadFirst) {
                const action = ThreadActionFactory.updateThreadPage(
                    thread.id,
                    page.toObject()
                );
                dispatch(action);
            }
        }
    }, [thread.history, page.pivot]);

    // Disable autoScroll
    // onUnmount
    useEffect(() => {
        let action = ThreadActionFactory.threadActivity({
            type: "view",
            thread_id: thread.id,
            timestamp: new Date().toISOString(),
        });
        dispatch(action);
        return () => {
            const action = ThreadActionFactory.updateThreadPage(thread.id, {
                ...pageRef.current.toObject(),
                autoScroll: false,
            });
            dispatch(action);
        };
    }, [thread.id]);

    /**
     * Init conversation  if
     * conversation has not yet been
     * initialized
     */
    useEffect(() => {
        if (thread.history.size === 0) {
            setLoading((loading) => ({ ...loading, buttom: true, top: true }));
            const action = ThreadActionFactory.loadConversation(thread.id, {
                first: perPage,
            });
            dispatch(action).finally(() => {
                setLoading((loading) => ({
                    ...loading,
                    buttom: false,
                    top: false,
                }));
            });
        }
    }, []);

    // Auto read last message and
    // mentain scroll position
    // or scroll to new thread message
    useEffect(() => {
        if (container && init && !thread.history.isEmpty()) {
            // Scroll to bottom on
            // new message and autoScroll
            if (page.autoScroll) {
                let lastMessage = thread.history.last()!;
                if (lastMessage.timestamp > thread.last_read) {
                    let action = ThreadActionFactory.threadActivity({
                        type: "read",
                        thread_id: thread.id,
                        timestamp: lastMessage.timestamp,
                    } as any);
                    dispatch(action);
                }

                if (lastMessage.timestamp > prevLastMessage?.timestamp) {
                    return footer.current?.scrollIntoView();
                }
                return;
            }

            // Mentiain scroll position
            let message = thread.getMessageByTimestamp(page.pivot);
            if (message) {
                let element = document.getElementById(`message:${message.id}`);
                if (element) {
                    container.scrollTop =
                        element.offsetTop -
                        (page.pivotTop - container.getBoundingClientRect().top);
                }
            }
        }
    }, [pageHistory, page.autoScroll]);

    /**
     * Component init conversation
     * thread view position
     */
    useEffect(() => {
        if (container && !pageHistory.isEmpty() && !init) {
            if (Boolean(page.pivot)) {
                // Restore user page scroll location
                // when autoScroll disabled
                let msg = thread.getMessageByTimestamp(page.pivot);

                if (msg && page.pivotTop >= 0) {
                    let element = document.getElementById(`message:${msg.id}`)!;

                    container.scrollTop =
                        element.offsetTop -
                        (page.pivotTop - container.getBoundingClientRect().top);
                } else {
                    container.scrollTop = container.getBoundingClientRect().top;
                }
            } else {
                // Page init for scrollable page
                // Try to retore position around last read
                let message = thread.getMessageByTimestamp(
                    thread.last_read ?? thread.history.last()!.timestamp
                )!;
                let element = document.getElementById(`message:${message.id}`);
                if (message) {
                    setPage((page) => page.set("pivot", message.timestamp));
                }
                if (element) {
                    element.scrollIntoView();
                }
            }

            setInit(true);
        }
    }, [thread.history.isEmpty(), container]);

    /**
     * handle save thread
     * scroll position
     */
    function handleScrollY(container: HTMLElement) {
        const percentage =
            (container.scrollTop * 100) /
            (container.scrollHeight - container.clientHeight);

        let updatedPage: Partial<Writeable<typeof page>> = {
            scrollPercentage: percentage,
        };

        if (!pageHistory.isEmpty()) {
            const index = Math.floor(
                (percentage * (pageHistory.size - 1)) / 100
            );
            const message = ThreadRecord.messageAtIndex(pageHistory, index)!;
            if (message) {
                let rect = messageRect(message.id)!;
                updatedPage.pivot = message.timestamp;
                updatedPage.pivotTop = rect.top;
            }
        } else {
            updatedPage.pivotTop = 0;
        }

        const direction =
            page.scrollPercentage < prevScrollPercentage
                ? Scroll.Up
                : Scroll.Down;

        if (footer.current) {
            let rect = footer.current.getBoundingClientRect();
            let containerRect = container.getBoundingClientRect();
            if (containerRect.bottom - rect.top > -8) {
                if (!thread.hasMoreBottom) {
                    updatedPage.autoScroll = true;
                }
            } else if (page.autoScroll === true) {
                updatedPage.autoScroll = false;
            }
        }

        if (percentage <= 5) {
            if (
                !loading.top &&
                direction == Scroll.Up &&
                thread.hasMoreTop &&
                thread.history.size > 0 &&
                pageHistory.size > 0 &&
                pageHistory.first()!.timestamp <=
                    thread.history.first()!.timestamp
            ) {
                setLoading((loading) => ({ ...loading, top: true }));
                const action = ThreadActionFactory.loadConversation(thread.id, {
                    first: perPage,
                    before: thread.history.first()?.id,
                });
                dispatch(action).finally(() => {
                    setLoading((loading) => ({ ...loading, top: false }));
                });
            }
        } else if (percentage > 80) {
            if (
                !loading.bottom &&
                direction == Scroll.Down &&
                thread.hasMoreBottom &&
                thread.history.size > 0 &&
                pageHistory.size > 0 &&
                pageHistory.last()!.timestamp >=
                    thread.history.last()!.timestamp
            ) {
                setLoading((loading) => ({ ...loading, buttom: true }));
                const action = ThreadActionFactory.loadConversation(thread.id, {
                    first: perPage,
                    after: thread.history.last()?.id,
                });
                dispatch(action).finally(() => {
                    setLoading((loading) => ({ ...loading, buttom: false }));
                });
            }
        }

        setPage((page) => page.merge(updatedPage));
    }

    function renderConversation() {
        return <Messages authid={authid} messages={pageHistory} />;
    }

    return (
        <div className="flex-1 flex flex-col overflow-hidden">
            <PerfectScrollbar
                options={scrollerOptions}
                onScrollY={handleScrollY}
                containerRef={setContainer}
                className="h-full w-full">
                <div className="flex flex-col min-h-full justify-end">
                    <div className="header h-6" ref={header} />
                    {renderConversation()}
                    <div className="footer h-12" ref={footer} />
                </div>
            </PerfectScrollbar>
        </div>
    );
});
