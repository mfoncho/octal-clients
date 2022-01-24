import {
    RequestMethod,
    IConfigPartial,
    IParams,
    IRequest,
    Data,
    Json,
    IEndpoint,
} from "./types";
import Response from "./response";

export default class Endpoint<EndRes = Json> implements IEndpoint {
    config: IConfigPartial;

    constructor(config: IConfigPartial = { base: "" }) {
        this.config = config;
    }

    uri(path: string, query: IParams = {}) {
        return Endpoint.uri(this.config.base ?? "", path, query);
    }

    //@ts-ignore
    async head<Res = EndRes>(path: string, req: IRequest = {}) {
        return this.fetch<Res>(path, "HEAD", req);
    }

    //@ts-ignore
    async get<Res = EndRes>(path: string, req: IRequest = {}) {
        return this.fetch<Res>(path, "GET", req);
    }

    //@ts-ignore
    async delete<Res = EndRes>(path: string, req: IRequest = {}) {
        return this.fetch<Res>(path, "DELETE", req);
    }

    //@ts-ignore
    async put<Res = EndRes>(path: string, data: Data, req: IRequest = {}) {
        return this.fetch<Res>(path, "PUT", { ...req, data });
    }

    //@ts-ignore
    async post<Res = EndRes>(path: string, data: Data, req: IRequest = {}) {
        return this.fetch<Res>(path, "POST", { ...req, data });
    }

    //@ts-ignore
    async patch<Res = EndRes>(path: string, data: Data, req: IRequest = {}) {
        return this.fetch<Res>(path, "PATCH", { ...req, data });
    }

    async fetch<Res = EndRes>(
        path: string,
        method: RequestMethod,
        request: IRequest
    ) {
        const uri = this.uri(path, request.params);
        const body = Endpoint.body(request);
        const init = Endpoint.init(method, this.config, request);
        let response = new Response<Res>(await fetch(uri, { ...init, body }));
        if (response.ok) {
            return response;
        }
        throw response;
    }

    static body({ data }: IRequest) {
        if (data instanceof File) {
            return data;
        }
        if (data instanceof FormData) {
            return data;
        }
        if (data instanceof Blob) {
            return data;
        }
        if (data instanceof ArrayBuffer) {
            return data;
        }
        if (data === null || data === undefined) {
            return "";
        }
        return JSON.stringify(data);
    }

    static uri(base: string, path: string, query: IParams = {}) {
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

    static init(
        method: RequestMethod,
        base: IConfigPartial,
        request: IRequest
    ): RequestInit {
        const headers = base.headers ?? {};
        return {
            ...base,
            ...request,
            method: method,
            headers: { ...headers, ...request.headers },
            referrerPolicy: request.referrer ?? base.referrer ?? undefined,
        };
    }
}
