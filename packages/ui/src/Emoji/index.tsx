import React from "react";
import { Emoji } from "emoji-mart";
import { Picker } from "emoji-mart";
import { NimbleEmojiIndex } from "emoji-mart";
import Popper from "../Popper";

interface IPicker {
    onSelect?: (emoji: string) => void;
    placement?:
        | "top"
        | "bottom"
        | "right"
        | "left"
        | "top-start"
        | "top-end"
        | "bottom-start"
        | "bottom-end"
        | "right-start"
        | "right-end"
        | "left-start"
        | "left-end";
}

const PickerPopper = Popper.create<HTMLDivElement, IPicker>((props) => {
    function handleSelect(emoji: any) {
        if (props.onSelect) {
            props.onSelect(emoji.native);
        }
    }
    return (
        <Popper
            open={props.open}
            placement={props.placement ?? "bottom-start"}
            anchorEl={props.anchorEl}
            onHoverAway={props.onHoverAway}
            onClickAway={props.onClickAway}>
            <Picker set="apple" onSelect={handleSelect} />
        </Popper>
    );
}, 1);

type IEPicker = typeof Picker & {
    Popper: typeof PickerPopper;
};

type IEmoji = {
    Picker: IEPicker;
    NimbleEmojiIndex: typeof NimbleEmojiIndex;
};

(Picker as any).Popper = PickerPopper;
(Emoji as any).NimbleEmojiIndex = NimbleEmojiIndex;
(Emoji as any).Picker = Picker;

export default Emoji as any as IEmoji;
