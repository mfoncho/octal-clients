import { Permission } from "@octal/store";
export interface IPermissionConfig {
    permission: Permission;
    name: string;
    type: string;
    description: string;
}

export interface IBooleanPermission extends IPermissionConfig {
    type: "boolean";
}

export interface IBooleanPermission extends IPermissionConfig {
    type: "boolean";
}

export interface INumberPermission extends IPermissionConfig {
    type: "number";
    scale: string;
}

export interface IStringPermission extends IPermissionConfig {
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

const definitions: IPermissionsGroup[] = [
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
        key: "message",
        name: "Message",
        permissions: [
            {
                name: "Post message",
                permission: "message.create",
                type: "boolean",
                description: "Post messages to all threads in this space",
            },
            {
                name: "Edit message",
                permission: "message.edit",
                type: "boolean",
                description:
                    "Member can edit messages they posted in any of the spaces threads",
            },
            {
                name: "Delete message",
                permission: "message.delete",
                type: "boolean",
                description:
                    "Members can delete the messages they posted in any space thread",
            },
            {
                name: "Manage messages",
                permission: "message.manage",
                type: "boolean",
                description:
                    "Members to manage (delete)any message posted in any of the spaces threads",
            },
            {
                name: "Pin messages",
                permission: "message.pin",
                type: "boolean",
                description:
                    "Pin messages to the space, pinned messages will be visible to all members",
            },
            {
                name: "Embed link",
                permission: "message.embeds",
                type: "boolean",
                description: "Embed links within message will be parsed",
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
                name: "Send invitations",
                permission: "invitation.send",
                type: "boolean",
                description: "Send email invitations",
            },
        ],
    },
];

export default definitions;
