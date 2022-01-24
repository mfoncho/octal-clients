import EmojiJS from "emoji-js";
import { getEmojiDataFromNative } from "emoji-mart";
import data from "emoji-mart/data/all.json";

export function image(unified: string) {
    return `/emoji/img/${unified}.png`;
}

let Engine = EmojiJS as any;

export class Emoji extends Engine {
    data: any;

    inits: any;

    allow_native: boolean;

    replace_mode: string;

    variations_data: any;

    //rx_unified_tester: RegExp;

    constructor() {
        super();
        this.allow_native = true;
        this.replace_mode = "unified";
    }

    imagePath(unified: string) {
        return `/images/emoji/${unified}.png`;
    }

    fromNative(native: string) {
        const emojiset = "twitter";
        return getEmojiDataFromNative(native, emojiset, data);
    }

    imagePathFromNative(native: string) {
        const data = this.fromNative(native);
        if (data) {
            return this.imagePath(data.unified);
        }
        return "";
    }

    emoji_regex() {
        var a = [];

        for (let i in this.data) {
            for (let j = 0; j < this.data[i][0].length; j++) {
                a.push(this.data[i][0][j].replace("*", "\\*"));
            }
        }
        for (let i in this.variations_data) {
            // skip simple append-style skin tones
            if (this.variations_data[i]["1f3fb-1f3fb"]) continue;

            for (let k in this.variations_data[i]) {
                for (let j = 0; j < this.variations_data[i][k][4].length; j++) {
                    a.push(
                        this.variations_data[i][k][4][j].replace("*", "\\*")
                    );
                }
            }
        }

        a = a.sort(function (a, b) {
            return b.length - a.length;
        });

        return "((" + a.join("|") + ")(\uD83C[\uDFFB-\uDFFF])?)";
    }

    isEmoticon(emoticon: string) {
        return new RegExp(`^${this.emoji_regex()}$`, "g").test(emoticon);
    }
}

const emoji = new Emoji();

export default emoji;
