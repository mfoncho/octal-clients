import React, { useState, useRef, useEffect } from "react";
import { Popper } from "@octal/ui";
import { useNavigator } from "src/hooks";
import { ColumnRecord } from "@octal/store/lib/records";
import { useInput } from "src/utils";
import { useColumnActions } from "@workspace/Board/hooks";
import { useUser } from "@octal/store";

interface ICreateCardPopper {
    column: ColumnRecord;
    onClose: (event: any, reason: string) => void;
}

const flip = { flipVariations: false };

export default Popper.create<HTMLDivElement, ICreateCardPopper>(
    ({ column, ...props }) => {
        const user = useUser();

        const inputRef = useRef<HTMLInputElement | null>(null);

        const actions = useColumnActions(column);

        const navigator = useNavigator();

        const [loading, setLoading] = useState<boolean>(false);

        const name = useInput("", (val) => val.length >= 3);

        useEffect(() => {
            if (inputRef.current) {
                // setTimout because for some reason
                // it won't auto focus just immediately
                // after popper parent focus
                setTimeout(() => {
                    inputRef.current?.focus();
                }, 10);
            }
        }, [inputRef]);

        function handleKeyPress(e: React.KeyboardEvent<HTMLInputElement>) {
            if (e.key == "Enter") {
                actions
                    .createCard(name.value)
                    .then((data) => {
                        props.onClose(data, "created");
                        navigator.openCard(data);
                    })
                    .catch(() => {
                        setLoading(false);
                    });
                setLoading(true);
            }
        }

        return (
            <Popper
                as="div"
                flip={flip}
                open={props.open}
                tabIndex={-1}
                anchorEl={props.anchorEl}
                placement="bottom-end"
                onClickAway={loading ? undefined : props.onClickAway}
                className="focus:outline-none flex flex-col rounded-md ring-1 ring-gray-800 ring-opacity-5 max-h-56 py-2 bg-white shadow-md overflow-x-hidden">
                <div className="flex flex-row p-2 items-center">
                    <img
                        className="inline-block h-8 w-8 rounded-full"
                        alt={user.name}
                        src={user.avatar}
                    />
                    <input
                        autoFocus
                        ref={inputRef}
                        disabled={loading}
                        {...name.props}
                        placeholder="Card name"
                        className="form-input rounded-md mx-2 font-semibold text-sm text-gray-800"
                        onKeyPress={handleKeyPress}
                    />
                </div>
            </Popper>
        );
    }
);
