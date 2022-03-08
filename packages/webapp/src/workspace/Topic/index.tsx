import React from "react";
import { useParams } from "react-router-dom";
import Header from "./Header";
import Thread from "../Thread";
import { useTopic } from "@octal/store";

export default React.memo(() => {
    const params = useParams<{ topic_id: string }>();
    const topic = useTopic(params.topic_id!);
    return (
        <div className="flex flex-grow flex-col">
            <Header />
            {Boolean(topic.id) && Boolean(topic.thread_id) && (
                <Thread id={topic.thread_id} />
            )}
        </div>
    );
});
