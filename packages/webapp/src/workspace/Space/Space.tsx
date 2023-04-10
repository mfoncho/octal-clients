import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { Textarea } from "@colab/ui";
import Chat from "../Chat";
import Catalog from "../Catalog";
import Topic from "../Topic";
import { useSpace, useSuggestable } from "./hooks";
import { useNavigator } from "src/hooks";

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

    const mentionable = useSuggestable();

    if (space.is_direct) return <Chat space={space} />;

    return (
        <Textarea.Suggestions.Context.Provider value={mentionable as any}>
            <Routes>
                <Route path="/topics/:topic_id" element={<Topic />} />
                <Route path="/catalogs/:catalog_id" element={<Catalog />}>
                    <Route path=":record_id" element={<Catalog />} />
                </Route>
                <Route path="/" element={<Redirect />} />
            </Routes>
        </Textarea.Suggestions.Context.Provider>
    );
});
