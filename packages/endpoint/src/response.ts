import { typematch } from "./utils";
import { Json, ResponseData, IResponse } from "./types";

export default class EndResponse<Res = ResponseData> implements IResponse {
    response: Response;

    constructor(respose: Response) {
        this.response = respose;
    }

    get headers() {
        return this.response.headers;
    }

    get status() {
        return this.response.status;
    }

    get redirected() {
        return this.response.redirected;
    }

    get body() {
        return this.response.body;
    }

    get type() {
        return this.response.type;
    }

    get trailer() {
        //@ts-ignore
        return this.response.trailer;
    }

    get url() {
        return this.response.url;
    }

    get bodyUsed() {
        return this.response.bodyUsed;
    }

    get statusText() {
        return this.response.statusText;
    }

    get ok() {
        return this.response.ok;
    }

    get content() {
        return (
            this.response.headers.get("content-type") ??
            this.response.headers.get("Content-Type") ??
            ""
        );
    }

    //@ts-ignore
    clone<T = Res>() {
        return new EndResponse<T>(this.response.clone());
    }

    blob() {
        return this.response.blob();
    }

    formData() {
        return this.response.formData();
    }

    json(): Promise<Json> {
        return this.response.json();
    }

    text() {
        return this.response.text();
    }

    arrayBuffer() {
        return this.response.arrayBuffer();
    }

    is(type: string) {
        return typematch(this.content, type);
    }

    data<T = Res>(): Promise<T> {
        let type = this.content;
        if (typematch(type, "application/json")) {
            return this.json() as any;
        }
        if (typematch(type, ["text/*"])) {
            return this.text() as any;
        }
        if (typematch(type, "image/*")) {
            return this.blob() as any;
        }
        return this.arrayBuffer() as any;
    }
}
