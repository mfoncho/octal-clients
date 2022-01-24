export interface Params {
    [key: string]:
        | string
        | string[]
        | number
        | number[]
        | Params
        | Params[]
        | null;
}
