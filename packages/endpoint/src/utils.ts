import { invariant } from "@octal/common";
import { IParams } from "./types";

export function typematch(type: string, ctypes: string[] | string) {
    const types = Array.isArray(ctypes) ? ctypes : [ctypes];
    const contenttype: string | undefined = type
        .split(" ")
        .find((val) => val.includes("/"));

    if (contenttype === undefined) {
        invariant(false, "Invalid content type");
    }
    let parts = contenttype.split("/");
    invariant(
        parts.length === 2,
        `Expect type of content-type format got ${type}`
    );
    let reg: { [key: string]: string[] } = types.reduce((acc, contenttype) => {
        let parts = contenttype.split("/");
        invariant(
            parts.length === 2,
            `Expect type of content-type format got ${contenttype}`
        );
        let content = parts[0];
        let type = parts[1];
        let types = acc[content] ?? [];
        if (types.includes(type)) {
            return acc;
        }
        types.push(type);
        acc[content] = types;
        return acc;
    }, {} as { [key: string]: string[] });

    let regstr = Object.keys(reg)
        .reduce((acc, content) => {
            let types = reg[content]!;
            if (types.includes("*")) {
                return `${acc}|(${content})\\/+(\\w+)`;
            }
            return `${acc}|((${content})\\/(${types.join("|")}))`;
        }, "")
        .replace(/^[|]+/, "");
    let [match] = type.match(regstr) ?? [null];
    return Boolean(match);
}

export function buildUrl(base: string, path: string, query: IParams = {}) {
    let url = `${base.replace(/[/]+$/, "")}/${path.replace(
        /^[/]+/,
        ""
    )}`.replace(/[/]+$/, "");
    let urlquery = new URLSearchParams(query).toString();
    if (urlquery === "") {
        return url;
    }
    return `${url}?${urlquery}`;
}
