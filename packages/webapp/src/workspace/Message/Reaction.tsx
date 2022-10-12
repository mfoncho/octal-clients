import React from "react";
import clx from "classnames";
import emoji from "@colab/emoji";

interface IReaction {
    name: string;
    count?: number;
    highlight?: boolean;
    onClick?: (event: React.MouseEvent) => void;
}

export default React.memo(({ name, count, onClick, highlight }: IReaction) => {
    return (
        <button
            className={clx(
                "flex rounded-xl m-1 p-0.5 hover:bg-gray-200 border border-gray-300 flex-row items-center",
                highlight && "bg-gray-300"
            )}
            onClick={onClick}>
            <img
                alt={name}
                className="w-5 h-5 rounded-full"
                src={emoji.image(name)}
            />
            <span className="px-1 font-bold text-xs">{count}</span>
        </button>
    );
});
