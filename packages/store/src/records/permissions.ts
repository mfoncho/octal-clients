import { Record } from "immutable";

export interface IPermissionInfo {
    permission: Permission;
    name: string;
    type: string;
    description: string;
}

export interface IBooleanPermission extends IPermissionInfo {
    type: "boolean";
}

export interface IBooleanPermission extends IPermissionInfo {
    type: "boolean";
}

export interface INumberPermission extends IPermissionInfo {
    type: "number";
    scale: string;
}

export interface IStringPermission extends IPermissionInfo {
    type: "string";
}

export type IPermission =
    | IBooleanPermission
    | IStringPermission
    | INumberPermission;

export interface IPermissionsGroup {
    key: string;
    name: string;
    permissions: Array<IPermission>;
}

export interface BasePermission<T = any> {
    readonly value: T;
    readonly overwrite: boolean;
    readonly name: string;
}

export class BooleanPermission
    extends Record({
        name: "",
        value: false,
        overwrite: false,
    })
    implements BasePermission<boolean> { }

export class NumberPermission
    extends Record({
        value: 0,
        overwrite: false,
        name: "",
    })
    implements BasePermission<number> { }

export class ListPermission extends Record({
    value: [] as any[],
    overwrite: false,
    name: "",
}) { }

export class StringPermission
    extends Record({
        value: "",
        overwrite: false,
        name: "",
    })
    implements BasePermission<string> { }

const booleanPermission = new BooleanPermission();

const numberPermission = new NumberPermission();

//const listPermission = new ListPermission();

const stringPermission = new StringPermission();

export const permissions = {
    ["space.create"]: booleanPermission,
    ["space.manage"]: booleanPermission,
    ["space.leave"]: booleanPermission,
    ["card.create"]: booleanPermission,
    ["card.move"]: booleanPermission,
    ["card.delete"]: booleanPermission,
    ["board.manage"]: booleanPermission,
    ["upload.limit"]: numberPermission,
    ["upload.types"]: stringPermission,
    ["message.embeds"]: booleanPermission,
    ["message.edit"]: booleanPermission,
    ["message.post"]: booleanPermission,
    ["thread.manage"]: booleanPermission,
    ["message.delete"]: booleanPermission,
    ["invite.mail.send"]: booleanPermission,
    ["invite.link.create"]: booleanPermission,
};

export type BasePermissionScheme = typeof permissions;

export type Permission = keyof BasePermissionScheme;

export class Permissions extends Record(permissions) { }

export const PermissionGroups: IPermissionsGroup[] = [
    {
        key: "system",
        name: "System",
        permissions: [
            {
                name: "Create Space",
                permission: "space.create",
                type: "boolean",
                description: "Create new space",
            },
        ],
    },
    {
        key: "general",
        name: "General",
        permissions: [
            {
                name: "Manage space",
                permission: "space.manage",
                type: "boolean",
                description: "User can adminster the space",
            },
            {
                name: "Leave space",
                permission: "space.leave",
                type: "boolean",
                description: "Users can leave any space at will",
            },
        ],
    },
    {
        key: "thread",
        name: "Thread",
        permissions: [
            {
                name: "Post message",
                permission: "message.post",
                type: "boolean",
                description:
                    "Post messages, participate in thread conversations",
            },
            {
                name: "Embed link",
                permission: "message.embeds",
                type: "boolean",
                description: "Embed links within message will be parsed",
            },
            {
                name: "Edit message",
                permission: "message.edit",
                type: "boolean",
                description: "Authors can edit their messages",
            },
            {
                name: "Delete message",
                permission: "message.delete",
                type: "boolean",
                description: "Authors can delete their message",
            },
            {
                name: "Thread moderator",
                permission: "thread.manage",
                type: "boolean",
                description:
                    "Thread moderators can delete and pin and unpin messages",
            },
        ],
    },
    {
        key: "upload",
        name: "File Uploads",
        permissions: [
            {
                name: "Max uploadable file size",
                permission: "upload.limit",
                type: "number",
                scale: "MB",
                description: "Max uploadable file size in MB",
            },
            {
                name: "Upload types",
                permission: "upload.types",
                type: "string",
                description:
                    "Types of file extensions the user is allowed to upload enter extension type seperated be commas like png image and word documents will be png,docx ",
            },
        ],
    },
    {
        key: "board",
        name: "Board",
        permissions: [
            {
                name: "Create card",
                permission: "card.create",
                type: "boolean",
                description: "Create cards",
            },
            {
                name: "Manage board",
                permission: "board.manage",
                type: "boolean",
                description:
                    "Create collections, Delete cards, move and reorder cards and collections",
            },
        ],
    },
    {
        key: "invitation",
        name: "Invitations",
        permissions: [
            {
                name: "Invitation link",
                permission: "invite.link.create",
                type: "boolean",
                description: "Create invitation link",
            },
            {
                name: "Send email invitations",
                permission: "invite.mail.send",
                type: "boolean",
                description: "Send email invitations",
            },
        ],
    },
];
