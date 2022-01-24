import React from "react";
import Header from "../Header";
import Controls from "./Controls";
import { Text } from "@octal/ui";

const calendarEmoji = "📅";

export default React.memo(() => {
    return (
        <Header className="flex-1 flex flex-row px-8 items-center justify-between">
            <div className="flex-1 flex flex-row items-center">
                <span className="text-xl">
                    <Text>{calendarEmoji}</Text>
                </span>
                <div className="px-3 flex flex-col items-center">
                    <span className="font-bold text-base sm:font-black sm:text-lg text-gray-700">
                        Calendar
                    </span>
                </div>
            </div>
            <div className="flex flex-row justify-end items-center space-x-2">
                <Controls calendar="calendar" />
            </div>
        </Header>
    );
});
