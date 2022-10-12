import React from "react";
import Header from "./Header";
import Thread from "../Thread";
import { SpaceRecord } from "@colab/store";

interface IChat {
    space: SpaceRecord;
}

export default React.memo<IChat>(({ space }) => {
    return (
        <div className="flex flex-grow flex-col">
            <Header space={space} />
            <Thread id={space.thread_id} />
        </div>
    );
});
