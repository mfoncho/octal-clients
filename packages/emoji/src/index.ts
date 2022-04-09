import { emoji as pattern } from "@octal/patterns";
import data from "emoji-mart/data/all.json";
import { getEmojiDataFromNative, NimbleEmojiIndex } from "emoji-mart";

export const index = new NimbleEmojiIndex(data);

export const host = "http://192.168.1.2:4000/images";

export function path(unified: string) {
    return `${host}/emoji/${unified}.png`;
}

export function search(query: string) {
    return index.search(query) ?? [];
}

export function query(native: string, set: string = "twitter") {
    return getEmojiDataFromNative(native, set as any, data);
}

export function image(native: string) {
    const data = query(native);
    if (data) {
        return path(data.unified);
    }
    return "";
}

export function suggest(term: string) {
    term = term.trim();
    term = term.startsWith(":") ? term.substring(1) : term;
    term = term.endsWith(":") ? term.substring(0, term.length - 1) : term;
    return term.length > 1 ? search(term) : [];
}

export function test(emoticon: string) {
    if (emoticon.length <= 4)
        return new RegExp(`^${pattern}$`, "g").test(emoticon);
    return false;
}

export const suggestable = {
    type: "emoji",
    pattern: ":\\w+",
    suggest: (query: string) =>
        new Promise<ReturnType<typeof suggest>>((resolve) =>
            resolve(suggest(query))
        ),
};

export default {
    index,
    host,
    path,
    search,
    query,
    image,
    suggest,
    test,
    suggestable,
};
