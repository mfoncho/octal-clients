import React, { useState, useEffect } from "react";
import { io } from "@console/types";
import client from "@console/client";
import { Text } from "@colab/ui";
import * as Icons from "@colab/icons";
import { useNavigator } from "@console/hooks";

export default React.memo<{ id: string }>((props) => {
    const [spaces, setSpaces] = useState<io.Space[]>([]);
    const navigator = useNavigator();
    useEffect(() => {
        fetchWorkspaces();
    }, []);

    function handleOpenSpace(space: io.Space) {
        return () => {
            return navigator.openSpace(space);
        };
    }

    async function fetchWorkspaces() {
        return client
            .fetchUserSpaces({ user_id: props.id })
            .then((data) => setSpaces(data))
            .catch(() => {});
    }

    function renderSpace(space: io.Space) {
        return (
            <div
                role="button"
                key={space.id}
                className="flex flex-row px-4 py-2 items-center hover:bg-primary-50"
                onClick={handleOpenSpace(space)}>
                <div className="w-10 h-10 flex justify-center items-center text-white bg-primary-500 rounded-lg">
                    <Icons.Space />
                </div>
                <span className="px-4 font-semibold text-base">
                    <Text>{space.name}</Text>
                </span>
            </div>
        );
    }
    return (
        <div className="flex flex-col rounded-md bg-white shadow overflow-hidden">
            <div className="py-4 bg-gray-100">
                <span className="font-bold py-4 px-4 text-gray-800">
                    Spaces
                </span>
            </div>
            <div className="flex flex-col divide-y divide-slate-200">
                {spaces.map(renderSpace)}
            </div>
        </div>
    );
});
