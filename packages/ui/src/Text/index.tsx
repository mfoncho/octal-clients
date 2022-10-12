import React from "react";
import emoji from "@colab/emoji";
import { emoji as pattern } from "@colab/patterns";

interface IText {
    size?: number;
    children: string;
}

export default React.memo<IText>(({ children }) => {
    if (children == null || children === "") {
        return <React.Fragment>{children}</React.Fragment>;
    }

    const src = children as string;

    const parsed = [];

    let prev = null;
    let match = null;

    const regex = new RegExp(pattern, "g");

    while ((match = regex.exec(src))) {
        if (match.index !== 0) {
            if (prev) {
                parsed.push(
                    src.substring(prev.index + prev[0].length, match.index)
                );
            } else {
                parsed.push(src.substring(0, match.index));
            }
        }

        let image = emoji.image(match[0]);

        if (image) {
            parsed.push(
                <span
                    className="inline-emoji"
                    style={{ backgroundImage: `url(${image})` }}
                    key={`emoji-${match.index}`}>
                    {match[0]}
                </span>
            );
        } else {
            parsed.push(<span key={`emoji-${match.index}`}>{match[0]}</span>);
        }

        prev = match;
    }

    if (prev && prev.index + prev[0].length < src.length - 1) {
        parsed.push(src.substring(prev.index + prev[0].length, src.length));
    }

    if (parsed.length > 0) {
        return <React.Fragment>{parsed}</React.Fragment>;
    } else {
        return <React.Fragment>{children}</React.Fragment>;
    }
});
