import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Textarea } from "@octal/ui";
import Chat from "../Chat";
import Board from "../Board";
import Topic from "../Topic";
import { useSpace, useSuggestable } from "./hooks";
import { purgeSpace } from "@octal/store/lib/actions/space";
import { useNavigator, useUnmount } from "src/hooks";

function Redirect() {
    const nav = useNavigator();

    const space = useSpace();

    useEffect(() => {
        nav.openTopic({ space_id: space.id, id: space.topic_id! });
    }, []);
    return <></>;
}

export default React.memo(() => {
    const space = useSpace();

    const dispatch = useDispatch();

    const mentionable = useSuggestable();

    useUnmount(() => {
        if (space.is_archived) {
            dispatch(purgeSpace(space.toJS() as any));
        }
    }, [space.is_archived]);

    if (space.is_direct) return <Chat space={space} />;

    return (
        <Textarea.Suggestions.Context.Provider value={mentionable as any}>
            <Routes>
                <Route path="/topics/:topic_id" element={<Topic />} />
                <Route path="/boards/:board_id" element={<Board />}>
                    <Route path=":card_id" element={<Board />} />
                </Route>
                <Route path="/" element={<Redirect />} />
            </Routes>
        </Textarea.Suggestions.Context.Provider>
    );
});
