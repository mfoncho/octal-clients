import React from "react";
import { Text, Button } from "@colab/ui";
import * as Icons from "@colab/icons";
import { useUser, useAuthId, SpaceRecord } from "@colab/store";
import { useNavigatorDrawer } from "src/hooks";

export default React.memo<{ space: SpaceRecord }>(({ space }) => {
    const [, navigator] = useNavigatorDrawer();
    const authId = useAuthId();
    const user = useUser(space.users.find((id) => id !== authId) ?? authId);
    return (
        <header className="flex flex-none border-b border-gray-200 flex-row items-center h-14 sm:h-20 justify-between">
            <div className="flex flex-row items-center pl-1 sm:pl-8 pr-2">
                <Button
                    variant="icon"
                    color="clear"
                    onClick={() => navigator.toggle({})}
                    className="visible sm:hidden">
                    <Icons.Menu />
                </Button>
                <div className="flex flex-row items-center px-2 overflow-hidden space-x-2">
                    <img
                        alt={user.username}
                        src={user.avatar}
                        className="rounded-full h-8 w-8 shadow"
                    />
                    <span className="truncate text-lg font-bold">
                        <Text>{user.username}</Text>
                    </span>
                </div>
            </div>
        </header>
    );
});
