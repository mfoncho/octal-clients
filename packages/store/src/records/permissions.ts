import { Permission } from "./auth";

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

export const PermissionGroups: IPermissionsGroup[] = [
    {
        key: "general",
        name: "General",
        permissions: [
            {
                name: "Manage space",
                permission: "space.manage",
                type: "boolean",
                description: "Rename the space, change space type",
            },
            {
                name: "Leave space",
                permission: "space.leave",
                type: "boolean",
                description:
                    "Members with this permission can leave the space is they so please",
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
                description: "Post messages to all threads in this space",
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
                permission: "message.attachment.max",
                type: "number",
                scale: "MB",
                description: "Max uploadable file size in MB",
            },
            {
                name: "Upload types",
                permission: "message.attachment.types",
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
                    "Create columns, Delete cards, move and reorder cards and columns",
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
