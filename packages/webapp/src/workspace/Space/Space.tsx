import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { Textarea } from "@colab/ui";
import Chat from "../Chat";
import Board from "../Board";
import Topic from "../Topic";
import { useSpace, useSuggestable } from "./hooks";
import { useNavigator } from "src/hooks";

function Redirect() {
    const nav = useNavigator();

    const space = useSpace();

    useEffect(() => {
        nav.openThread({ space_id: space.id, id: space.thread_id! });
    }, []);
    return <></>;
}

export default React.memo(() => {
    const space = useSpace();

    const mentionable = useSuggestable();

    if (space.is_direct) return <Chat space={space} />;

    return (
        <Textarea.Suggestions.Context.Provider value={mentionable as any}>
            <Routes>
                <Route path="/threads/:thread_id" element={<Topic />} />
                <Route path="/boards/:board_id" element={<Board />}>
                    <Route path=":card_id" element={<Board />} />
                </Route>
                <Route path="/" element={<Redirect />} />
            </Routes>
        </Textarea.Suggestions.Context.Provider>
    );
});
