import "@material-ui/core/styles/createPalette";
import React from "react";
import { State } from "./store";
import colors from "./colors";
import { Record } from "immutable";
import { Color } from "@material-ui/core";
import { BaseEditor } from "slate";
import { ReactEditor } from "slate-react";

type TextNode = { text: string };

type Paragraph = { type: "paragraph"; children: TextNode[] };

declare module "slate" {
    interface CustomTypes {
        Editor: BaseEditor & ReactEditor;
        Element: Paragraph;
        Text: TextNode;
    }
    type SlateElement = {
        type: string;
        children: TextNode[];
    };
}

declare module "*.svg" {
    export const ReactComponent: React.SFC<React.SVGProps<SVGSVGElement>>;
    const src: string;
    export default src;
}

declare module "*.css" {
    const content: Record<string, string>;
    export default content;
}

declare module "*.jpg" {
    const filename: string;
    export default filename;
}

declare module "*.png" {
    const filename: string;
    export default filename;
}

declare global {
    interface Window {
        Env: Record<{
            USER_REGISTRATION: boolean;
            ADMIN_API_VERSION: string;
            CLIENT_API_VERSION: string;
            ADMIN_API_ENDPOINT: string;
            CLIENT_API_ENDPOINT: string;
            AUTH_PROVIDERS: [[string, string]];
        }>;
        [key: string]: any;
    }
}

declare module "react-redux" {
    interface DefaultRootState extends State {}
}

declare module "@material-ui/core/styles/createPalette" {
    interface PaletteHues {
        "50": string;
        "100": string;
        "200": string;
        "300": string;
        "400": string;
        "500": string;
        "600": string;
        "700": string;
        "800": string;
        "900": string;
        A100: string;
        A200: string;
        A400: string;
        A700: string;
    }

    interface PaletteColor {
        main: string;
        dark: string;
        light: string;
        contrastText: string;
        [key: string]: string;
        "50": string;
        "100": string;
        "200": string;
        "300": string;
        "400": string;
        "500": string;
        "600": string;
        "700": string;
        "800": string;
        "900": string;
        A100: string;
        A200: string;
        A400: string;
        A700: string;
    }

    interface PaletteOptions {
        red: PaletteHues;
        blue: PaletteHues;
        grey?: Partial<Color>;
        pink: PaletteHues;
        teal: PaletteHues;
        brown: PaletteHues;
        green: PaletteHues;
        amber: PaletteHues;
        yellow: PaletteHues;
        orange: PaletteHues;
        purple: PaletteHues;
        indigo: PaletteHues;
        bluegrey: PaletteHues;
        deeppurple: PaletteHues;
        deeporange: PaletteHues;

        success?: PaletteColorOptions;
        warning?: PaletteColorOptions;
    }
}

export type ColumnType = "stack" | "queue";

export type SpaceType = "board" | "discuss" | "direct";

export type ThreadType = "topic" | "reply" | "card" | "email";

export type SpaceAccess = "public" | "private";

export type KeyboardInputEvent = React.KeyboardEvent<HTMLInputElement>;

export interface IColor {
    "50": string;
    "100": string;
    "200": string;
    "300": string;
    "400": string;
    "500": string;
    "600": string;
    "700": string;
    "800": string;
    "900": string;
    A100: string;
    A200: string;
    A400: string;
    A700: string;
}

export interface IPalette {
    red: IColor;
    blue: IColor;
    grey: IColor;
    pink: IColor;
    teal: IColor;
    brown: IColor;
    green: IColor;
    amber: IColor;
    yellow: IColor;
    orange: IColor;
    purple: IColor;
    indigo: IColor;
    bluegrey: IColor;
    deeppurple: IColor;
    deeporange: IColor;
}

export type Diff<T, U> = T extends U ? never : T;

export type Require<T, K extends keyof T> = T &
    Required<{ [P in K]: Diff<T[P], undefined> }>;

export type Optional<T, K extends keyof T> = {
    [P in K]?: Diff<T[P], undefined>;
} &
    Omit<T, K>;

export interface Thenable<T = any> {
    then<S, E>(
        onFullfill: (data: T) => S,
        onReject?: (reason: any) => E
    ): Promise<S | E>;
}

export type PartialTurtle<T> = {
    [P in keyof T]?: T[P] extends (infer U)[]
        ? PartialTurtle<U>[]
        : T[P] extends object
        ? PartialTurtle<T[P]>
        : T[P];
};

export interface Finalizable<T = any> {
    finally<F = never>(onFullfill: () => F): Promise<T | F>;
}

export interface Catchable<T = any> {
    catch<F = never>(onError: () => F): Promise<T | F>;
}

export interface Promiseable<T = any, E = any>
    extends Thenable<T>,
        Finalizable<T>,
        Catchable<E> {}

export interface RouteLocation {
    state: any;
    search: string;
    pathname: string;
    hash: string;
    key?: string;
}

export interface RouterParams {
    space_id?: string;
}

export interface Route extends RouteLocation {
    params: RouterParams;
}

export interface Route extends RouteLocation {
    params: RouterParams;
}

export interface Page<T> {
    data: T[];
    page_size: number;
    page_number: number;
    total_count: number;
    total_pages: number;
}

export type Id = string;

export interface Unique {
    id: Id;
}

export interface Timestamp extends String {}

export interface Timestamped {
    timestamp: Timestamp;
}

export interface Positioned {
    position: number;
}

export interface BelongsToUser {
    user_id: Id;
}

export interface BelongsToCard {
    card_id: Id;
}

export interface BelongsToBard {
    board_id: Id;
}

export interface BelongsToThread {
    thread_id: Id;
}

export interface BelongsToSpace {
    space_id: Id;
}

export interface BelongsToWorkspace {
    workspace_id: Id;
}
