import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Header from "./Header";
import Thread from "../Thread";
import { useNavigator } from "src/hooks";
import { useTopic, useThread, ThreadRecord } from "@colab/store";

const defaultThread = new ThreadRecord({ id: "" });
export default React.memo(() => {
    const params = useParams<{ thread_id: string; space_id: string }>();
    const thread = useThread(params.thread_id!) ?? defaultThread;
    return (
        <div className="flex flex-grow flex-col">
            <Header />
            <Thread id={params.thread_id!} />
        </div>
    );
});
