import { emoji as pattern } from "@octal/patterns";
import data from "emoji-mart/data/all.json";
import { getEmojiDataFromNative, NimbleEmojiIndex } from "emoji-mart";

export const index: NimbleEmojiIndex = new (NimbleEmojiIndex as any)(
    data,
    "apple"
);

//export const host = "http://192.168.1.2:4000/images";

export const host =
    "https://cdn.jsdelivr.net/npm/emoji-datasource-apple@14.0.0/img/apple/64";

export function path(unified: string) {
    //return `${host}/emoji/${unified}.png`;
    return `${host}/${unified}.png`;
}

export function search(query: string, params?: { maxResults?: number }) {
    let term = query.trim();
    term = term.startsWith(":") ? term.substring(1) : term;
    term = term.endsWith(":") ? term.substring(0, term.length - 1) : term;
    //let results = (index as any).search(term) ?? [];
    return (index as any).search(term) ?? [];
    //return results.filter((result: any) => result.skin === null);
}

export function query(native: string, set: string = "apple") {
    return getEmojiDataFromNative(native, set as any, data);
}

export function image(native: string) {
    const data = query(native);
    if (data) {
        return path(data.unified);
    }
    return "";
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
        new Promise<ReturnType<typeof search>>((resolve) =>
            resolve(search(query))
        ),
};

export default {
    index,
    host,
    path,
    search,
    query,
    image,
    test,
    suggestable,
};
