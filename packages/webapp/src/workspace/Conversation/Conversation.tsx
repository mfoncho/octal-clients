import React, { useState, useEffect, useRef } from "react";
import moment from "moment";
import { useDispatch } from "react-redux";
import Message from "../Message";
import PerfectScrollbar from "react-perfect-scrollbar";
import { OrderedMap } from "immutable";
import * as ThreadActionFactory from "@octal/store/lib/actions/thread";
import { ThreadRecord, useAuthId, useMessage } from "@octal/store";
import { useDebouncedEffect, useCurPrev } from "@octal/hooks";

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

function orderedMapValueAt<T>(
    map: OrderedMap<string, T>,
    index: number
): T | undefined {
    if (map.size > 0) {
        const msg = (map as any)._list.get(index);
        if (msg) {
            return msg[1];
        }
    }
}

function orderedMapAtIndex<T>(
    map: OrderedMap<string, T>,
    index: string
): number | undefined {
    if (map.size > 0) {
        return (map as any)._map.get(index);
    }
}

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
                    <div className="bg-slate-300 h-px flex-grow rounded" />
                    <span className="text-gray-800 bg-slate-200 text-xs font-bold px-4 rounded-xl">
                        {date.format("ll")}
                    </span>
                    <div className="bg-slate-300 h-px flex-grow rounded" />
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

function usePageHistory(thread: ThreadRecord) {
    return React.useMemo(() => {
        return thread.historyFrom(
            thread.page.start,
            thread.page.autoScroll ? "" : thread.page.end
        );
    }, [thread.history, thread.page.start, thread.page.end]);
}

export default React.memo<IThread>(function ({ thread }) {
    const dispatch = useDispatch();

    const authid = useAuthId();

    const [page, setPage] = useState(thread.page);

    const [, prevScrollPercentage] = useCurPrev(page.scrollPercentage);

    const [loading, setLoading] = useState(loadingState);

    const pageHistory = usePageHistory(thread);

    const [container, setContainer] = useState<HTMLElement | null>(null);

    const header = useRef<HTMLDivElement | null>(null);
    const footer = useRef<HTMLDivElement | null>(null);

    function getIdByIndex(index: number): string {
        if (pageHistory.size > 0) {
            const msg = orderedMapValueAt(pageHistory, index);
            if (msg) {
                return msg.id;
            } else {
                // Should never happed but hey shit happens
                // and somehow someone will hit this.
                return "";
            }
        } else {
            return "";
        }
    }

    function messageRect(id: string) {
        let element = document.getElementById(`message:${id}`);
        return element?.getBoundingClientRect();
    }

    function track(id: string) {
        let element = document.getElementById(`message:${id}`);
        if (element) {
            let top = element.getBoundingClientRect().top;
            setPage((page) =>
                page.merge({
                    pivot: id,
                    pivotTop: top,
                })
            );
        }
    }

    function logPagePosition() {
        if (page.pivotTop > 0) {
            const action = ThreadActionFactory.updateThreadPage(
                thread.id,
                page.toObject()
            );
            dispatch(action);
        }
    }

    //useUnmount(logPagePosition, [page]);

    useDebouncedEffect(logPagePosition, 500, [page]);

    // Trim message when thread
    // messages out of view
    // when max reached
    useEffect(() => {
        if (thread.history.size > 75) {
            if (page.scrollPercentage > 70) {
                const action = ThreadActionFactory.updateThreadPage(thread.id, {
                    start: thread.history.first()!.timestamp,
                    end: thread.history.take(70)!.last()!.timestamp,
                });
                dispatch(action);
            } else {
                const action = ThreadActionFactory.updateThreadPage(thread.id, {
                    start: thread.history.takeLast(70)!.first()!.timestamp,
                    end: thread.history.last()!.timestamp,
                });
                dispatch(action);
            }
        }
    }, [thread.history]);

    /**
     * Init conversation  if
     * conversation has not yet been
     * initialized
     */
    useEffect(() => {
        {
            let action = ThreadActionFactory.threadActivity({
                type: "viewing",
                thread_id: thread.id,
                space_id: thread.space_id,
            });
            dispatch(action);
        }
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

    /**
     * Component init conversation
     * thread view position
     */
    useEffect(() => {
        if (container && pageHistory.size > 0) {
            if (page.pivotTop < 0) {
                container.scrollTop = container.scrollHeight;
                const id = getIdByIndex(pageHistory.size - 1);
                track(id);
            } else if (page.autoScroll && page.scrollPercentage > 80) {
                footer.current?.scrollIntoView();
            } else {
                let element = document.getElementById(`message:${page.pivot}`);

                if (element) {
                    container.scrollTop =
                        element.offsetTop -
                        (page.pivotTop - container.getBoundingClientRect().top);
                } else {
                    container.scrollTop = 100;
                }
            }
        }
    }, [pageHistory, container]);

    /**
     * handle save thread
     * scroll position
     */
    function handleScrollY(container: HTMLElement) {
        const percentage =
            (container.scrollTop * 100) /
            (container.scrollHeight - container.clientHeight);

        let updatedPage = page.set("scrollPercentage", percentage);

        if (!pageHistory.isEmpty()) {
            const index = Math.floor((percentage * pageHistory.size) / 100);
            const pivot = getIdByIndex(index - 1);
            let rect = messageRect(pivot)!;
            updatedPage = updatedPage
                .set("pivot", pivot)
                .set("pivotTop", rect.top);
        }

        const direction =
            page.scrollPercentage < prevScrollPercentage
                ? Scroll.Up
                : Scroll.Down;

        if (footer.current) {
            let rect = footer.current.getBoundingClientRect();
            let containerRect = container.getBoundingClientRect();
            if (containerRect.bottom - rect.top > -8) {
                if (!page.autoScroll && !thread.hasMoreBottom && Scroll.Down) {
                    updatedPage = updatedPage
                        .set("end", "")
                        .set("autoScroll", true);
                }
            } else if (page.autoScroll === true) {
                updatedPage = updatedPage.set("autoScroll", false);
            }
        }

        if (percentage <= 5) {
            if (!loading.top && direction == Scroll.Up && thread.hasMoreTop) {
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
                thread.hasMoreBottom
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
        setPage(updatedPage);
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
