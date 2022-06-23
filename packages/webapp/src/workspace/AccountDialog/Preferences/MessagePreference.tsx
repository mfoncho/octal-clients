import React from "react";
import Message from "@workspace/Message";
import { noop, IPreference } from "./hooks";
import { MessageRecord, Preference } from "@octal/store";

const preference: Preference = "webapp.message.view";

export default React.memo<IPreference>((props) => {
    const { user, preferences, setPreference } = props;
    const sampleMessage = new MessageRecord({
        id: "0",
        user_id: user.id,
        timestamp: new Date().toISOString(),
        markdown: false,
        content:
            "Hello does this formating sout you? and hope this message will wrap around somehow please do",
    });

    function handleSetMessageType(type: string) {
        return (e: React.MouseEvent) => {
            e.stopPropagation();
            e.preventDefault();
            setPreference(preference, type);
        };
    }

    const options = [
        { name: "Default", value: "default" },
        { name: "Compact", value: "compact" },
    ];

    return (
        <div className="flex flex-col py-6">
            <div className="flex flex-col rounded-md my-1 p-2 bg-gray-100">
                {options.map((option) => (
                    <div
                        role="button"
                        key={option.value}
                        className="flex my-1 flex-row p-2 rounded hover:bg-gray-200 items-center cursor-pointer"
                        onClick={handleSetMessageType(option.value)}>
                        <input
                            type="checkbox"
                            className="form-checkbox rounded-full mx-2"
                            onChange={noop}
                            checked={
                                option.value == preferences.get(preference)
                            }
                        />
                        <span className="text-base text-gray-600 font-semibold">
                            {option.name}
                        </span>
                    </div>
                ))}
            </div>
            <div className="flex flex-col my-4 py-4 hover:bg-gray-100 rounded-md border-2 border-gray-100 overflow-hidden">
                <Message
                    authid=""
                    extra={true}
                    tsformat="LT"
                    message={sampleMessage}
                />
            </div>
        </div>
    );
});
