import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Textarea } from "@octal/ui";
import Board from "../Board";
import Topic from "../Topic";
import { useSpace, useMentionable } from "./hooks";
import { clearSpace } from "@octal/store/lib/actions/space";
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

    const mentionable = useMentionable();

    useUnmount(() => {
        if (space.is_archived) {
            dispatch(clearSpace(space.toJS() as any));
        }
    }, [space.is_archived]);

    return (
        <Textarea.Mention.Context.Provider value={mentionable as any}>
            <Routes>
                <Route path="/topics/:topic_id" element={<Topic />} />
                <Route path="/boards/:board_id" element={<Board />}>
                    <Route path=":card_id" element={<Board />} />
                </Route>
                <Route path="/" element={<Redirect />} />
            </Routes>
        </Textarea.Mention.Context.Provider>
    );
});
