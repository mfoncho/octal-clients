import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Header from "./Header";
import Thread from "../Thread";
import { useNavigator } from "src/hooks";
import { useTopic } from "@octal/store";

export default React.memo(() => {
    const nav = useNavigator();
    const [init, setInit] = useState<boolean>(false);
    const params = useParams<{ topic_id: string; space_id: string }>();
    const topic = useTopic(params.topic_id!);

    useEffect(() => {
        if (!init && !Boolean(topic.id)) {
            setInit(true);
        }
        if (init && topic.id !== params.topic_id) {
            nav.openSpace({ id: params.space_id! });
        }
    }, [topic.id, params.topic_id]);

    return (
        <div className="flex flex-grow flex-col">
            <Header />
            {Boolean(topic.id) && Boolean(topic.thread_id) && (
                <Thread id={topic.thread_id} />
            )}
        </div>
    );
});
