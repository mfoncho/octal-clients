import React, { useState, useEffect } from "react";
import moment from "moment";
import { useDispatch } from "react-redux";
import Message from "../Message";
import { Context as MenuContext, ActionT } from "../Message/Menu";
import PerfectScrollbar from "react-perfect-scrollbar";
import LoadingRings from "../Animated/Rings";
import immutable, { Map, OrderedMap } from "immutable";
import * as ThreadActionFactory from "@octal/store/lib/actions/thread";
import { ThreadRecord, MessageRecord } from "@octal/store";
import { useUnmount, useCurPrev, useDebouncedCallback } from "src/hooks";

window.immutable = immutable;

interface IChatMsg {
    id: string;
    user_id: string;
    timestamp: string;
}

interface IConversation {
    messages: OrderedMap<string, IChatMsg>;
}

interface IThread {
    thread: ThreadRecord;
}

const Context = React.createContext(Map<string, MessageRecord>());

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

const Msg = React.memo<{ id: string; extra: boolean }>(({ id, extra }) => {
    const message = React.useContext(Context).get(id);
    if (message) {
        return <Message message={message} tsformat="h:mm A" extra={extra} />;
    } else {
        return <></>;
    }
});

export const Messages = React.memo<IConversation>(({ messages }) => {
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

        const extra = !sameday || !sameauthor;

        if (!sameday) {
            block.push(
                <div
                    key="datetime-divider"
                    className="pt-2 flex flex-row justify-between items-center px-2">
                    <div className="bg-gray-300 h-px flex-grow rounded" />
                    <span className="text-white bg-primary-500 text-xs font-bold px-4 rounded-xl">
                        {moment(message.timestamp).format("LL")}
                    </span>
                    <div className="bg-gray-300 h-px flex-grow rounded" />
                </div>
            );
        }

        if (extra) {
            block.push(
                <div key="extra-space" className="pt-2">
                    <Msg extra={extra} id={message.id} />
                </div>
            );
        } else {
            block.push(<Msg extra={false} id={message.id} key={message.id} />);
        }

        return <React.Fragment key={message.id}>{block}</React.Fragment>;
    }

    return (
        <React.Fragment>{messages.map(renderMessage).toList()}</React.Fragment>
    );
});

const actions: ActionT[] = ["react", "reply", "flag", "pin", "edit", "delete"];

const defaultPosition = {
    mid: "",
    top: 0,
    follow: true,
};

type PositionType = typeof defaultPosition;

export default React.memo<IThread>(function ({ thread }) {
    const dispatch = useDispatch();

    const [scrollPercentage, setScrollPercentage] = useState<number>(100);

    const [, prevScrollPercentage] = useCurPrev(scrollPercentage);

    const [menuContext] = useState({ actions });

    const [page, setPage] = useState<PositionType>(() => {
        return thread ? (thread.view.toJS() as PositionType) : defaultPosition;
    });

    const [container, setContainer] = useState<HTMLElement | null>(null);

    const hasMoreTop =
        thread && thread.history.size > 0
            ? thread.first_message_id < (thread.history.first() as any).id
            : false;

    const hasMoreBottom =
        thread && thread.history.size > 0
            ? thread.last_message_id > (thread.history.last() as any).id
            : false;

    function getIdByIndex(index: number): string {
        if (thread && thread.history.size > 0) {
            const msg = thread.getHistoryAtIndex(index);
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

    function track(id: string) {
        let element = document.getElementById(`message:${id}`);
        if (element) {
            let top = element.getBoundingClientRect().top;
            setPage((page) => ({
                mid: id,
                top: top,
                follow: page.follow as any,
            }));
        }
    }

    function logPagePosition() {
        if (thread) {
            const action = ThreadActionFactory.setConversationPage({
                ...page,
                thread_id: thread.id,
                space_id: thread.space_id,
            } as any);
            dispatch(action);
        }
    }

    useUnmount(logPagePosition, [page]);

    const deboundedLogPagePosition = useDebouncedCallback(
        logPagePosition,
        500,
        [page]
    );

    // Trim message when thread
    // messages out of view
    // when max reached
    useEffect(() => {
        if (thread) {
            if (thread.history.size > 75) {
                if (scrollPercentage > 50) {
                    const action = ThreadActionFactory.trimConversation({
                        thread_id: thread!.id,
                        amount: 50,
                        mode: "top",
                    });
                    dispatch(action);
                } else {
                    const action = ThreadActionFactory.trimConversation({
                        thread_id: thread!.id,
                        amount: 50,
                        mode: "bottom",
                    });
                    dispatch(action);
                }
            }
        }
    }, [thread?.history.size]);

    /**
     * Init conversation  if
     * conversation has not yet been
     * initialized
     */
    useEffect(() => {
        if (thread) {
            {
                let action = ThreadActionFactory.threadActivity({
                    type: "viewing",
                    thread_id: thread.id,
                    space_id: thread.space_id,
                });
                dispatch(action);
            }
            if (thread.history.size === 0) {
                const action = ThreadActionFactory.loadConversation({
                    space_id: thread.space_id,
                    thread_id: thread.id,
                    limit: 50,
                    more: "top",
                });
                dispatch(action);
            }
        } else {
            /**
             **/
        }
    }, [thread ? true : false]);

    /**
     * Component init conversation
     * thread page position
     */
    useEffect(() => {
        if (container && thread && thread.history.size > 0) {
            if (!Boolean(page.mid)) {
                container.scrollTop = container.scrollHeight;
                const id = getIdByIndex(thread.history.size - 1);
                track(id);
            } else {
                let element = document.getElementById(`message:${page.mid}`);

                if (element) {
                    container.scrollTop =
                        element.offsetTop -
                        (page.top - container.getBoundingClientRect().top);
                }
            }
        }
    }, [thread ? thread.history.size > 0 : false, container]);

    /**
     * Check for conversation chat change.
     * If thread is locked to bottom
     * scroll to end of the thread
     * set new position
     *
     */
    useEffect(() => {
        if (container && thread && thread.history.size > 0) {
            // Lock scroll to auto scroll
            // to most recent post
            if (page.follow) {
                container.scrollTop = container.scrollHeight + 64;
                //container.scrollTo({top: container.scrollHeight, behavior:'smooth'})
            } else {
                let prevElement = document.getElementById(
                    `message:${page.mid}`
                );

                if (prevElement) {
                    container.scrollTop =
                        1 + // Fixes scroll drift "Browser bug" cause by low level floating point rounding
                        prevElement.offsetTop -
                        (page.top - container.getBoundingClientRect().top);
                }
            }
        }
    }, [thread?.history]);

    /**
     * handle save thread
     * scroll position
     */
    function handleScrollY(container: HTMLElement) {
        if (thread) {
            const percentage =
                (container.scrollTop * 100) /
                (container.scrollHeight - container.clientHeight);

            const index = Math.floor((percentage * thread.history.size) / 100);

            if (Boolean(page.mid)) {
                const mid = getIdByIndex(index);
                track(mid);
            }

            setScrollPercentage(percentage);

            const direction =
                scrollPercentage < prevScrollPercentage ? "up" : "down";

            if (percentage > 96) {
                if (!page.follow) {
                    setPage((page) => ({ ...page, follow: true }));
                }
            } else {
                if (page.follow) {
                    setPage((page) => ({ ...page, follow: false }));
                }
            }

            if (percentage <= 5) {
                if (!thread.loading.top && direction == "up" && hasMoreTop) {
                    const action = ThreadActionFactory.loadConversation({
                        space_id: thread.space_id,
                        thread_id: thread.id,
                        more: "top",
                    });
                    dispatch(action);
                }
            } else if (percentage > 80) {
                if (
                    !thread.loading.bottom &&
                    direction == "down" &&
                    hasMoreBottom
                ) {
                    const action = ThreadActionFactory.loadConversation({
                        space_id: thread.space_id,
                        thread_id: thread.id,
                        more: "bottom",
                    });
                    dispatch(action);
                }
            }
            deboundedLogPagePosition();
        }
    }

    function renderConversation() {
        if (thread == null) return <LoadingRings size={32} />;

        /**
        if (conversation == null) return <LoadingBars />;
        **/

        return <Messages messages={thread.history} />;
    }

    return (
        <Context.Provider value={thread.messages}>
            <div className="flex-1 flex flex-col overflow-hidden">
                <PerfectScrollbar
                    options={scrollerOptions}
                    onScrollY={handleScrollY}
                    containerRef={setContainer}
                    className="h-full w-full">
                    <MenuContext.Provider value={menuContext}>
                        <div className="flex py-12 flex-col min-h-full justify-end">
                            {renderConversation()}
                        </div>
                    </MenuContext.Provider>
                </PerfectScrollbar>
            </div>
        </Context.Provider>
    );
});
