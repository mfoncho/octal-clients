import { emoji as pattern } from "@octal/patterns";
import data from "emoji-mart/data/all.json";
import { getEmojiDataFromNative } from "emoji-mart";

export default {
    path(unified: string) {
        return `/images/emoji/${unified}.png`;
    },

    data(native: string, set: string = "twitter") {
        return getEmojiDataFromNative(native, set as any, data);
    },

    image(native: string) {
        const data = this.data(native);
        if (data) {
            return this.path(data.unified);
        }
        return "";
    },

    test(emoticon: string) {
        if (emoticon.length <= 4)
            return new RegExp(`^${pattern}$`, "g").test(emoticon);
        return false;
    },
};
