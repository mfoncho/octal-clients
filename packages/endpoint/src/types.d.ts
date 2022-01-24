export interface IHeaders {
    [key: string]: string;
}

export interface IPayload {
    [key: string]:
        | string
        | null
        | number
        | IPayload
        | string[]
        | number[]
        | IPayload[];
}

export interface IParams {
    [key: string]: string;
}

export type Data =
    | IPayload
    | FormData
    | File
    | Blob
    | ArrayBuffer
    | string
    | number;

export type Json = string[] | number[] | IPayload | IPayload[];

export type ResponseData = Json | ArrayBuffer | Blob | string;

export interface IConfig
    extends Omit<
        Partial<RequestInit>,
        "referrerPolicy" | "headers" | "method" | "body"
    > {
    base: string;
    headers: IHeaders;
    referrer: RequestInit["referrerPolicy"];
}

export type IConfigPartial = Partial<IConfig>;

export interface IRequest extends Omit<IConfigPartial, "base"> {
    id?: string;
    data?: Data;
    params?: IParams;
}

export type RequestMethod =
    | "POST"
    | "GET"
    | "OPTIONS"
    | "PUT"
    | "PATCH"
    | "DELETE"
    | "HEAD";

export interface IResponse<Res = ResponseData> extends Response {
    data<T = Res>(): Promise<T>;
    is(type: string): booolean;
    content: string;
    json(): Promise<Json>;
    data<T = Res>(): Promise<T>;
}

export interface IEndpoint<EndRes = ResponseData> {
    head<Res = EndRes>(
        path: string,
        req: IRequest = {}
    ): Promise<IResponse<Res>>;

    get<Res = EndRes>(
        path: string,
        req: IRequest = {}
    ): Promise<IResponse<Res>>;

    delete<Res = EndRes>(
        path: string,
        req: IRequest = {}
    ): Promise<IResponse<Res>>;

    put<Res = EndRes>(
        path: string,
        data: Data,
        req: IRequest = {}
    ): Promise<IResponse<Res>>;

    post<Res = EndRes>(
        path: string,
        data: Data,
        req: IRequest = {}
    ): Promise<IResponse<Res>>;

    patch<Res = EndRes>(
        path: string,
        data: Data,
        req: IRequest = {}
    ): Promise<IResponse<Res>>;
}
