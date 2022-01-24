import { Record } from "immutable";
import { Unique } from "@octal/client";

export class BooleanPermission extends Record({
    name: "",
    value: true,
    base: "static",
}) {
    constructor(value = true, base = "static") {
        super({ value, base });
    }
}

export class NumberPermission extends Record({
    name: "",
    value: 0,
    base: "static",
}) {
    constructor(value = 0, base = "static") {
        super({ value, base });
    }
}

export class ListPermission extends Record({
    name: "",
    value: [] as any[],
    base: "static",
}) {
    constructor(value = [], base = "static") {
        super({ value, base });
    }
}

export class StringPermission extends Record({
    name: "",
    value: "",
    base: "static",
}) {
    constructor(value = "", base = "static") {
        super({ value, base });
    }
}

const booleanPermission = new BooleanPermission();

const numberPermission = new NumberPermission();

//const listPermission = new ListPermission();

const stringPermission = new StringPermission();

export const permissions = {
    upload_limit: numberPermission,
    upload_types: stringPermission,
    create_card: booleanPermission,
    embed_links: booleanPermission,
    pin_message: booleanPermission,
    edit_message: booleanPermission,
    post_reply: booleanPermission,
    manage_board: booleanPermission,
    manage_topics: booleanPermission,
    use_markdown: booleanPermission,
    post_message: booleanPermission,
    leave_space: booleanPermission,
    delete_message: booleanPermission,
    manage_space: booleanPermission,
    send_invitation: booleanPermission,
    manage_messages: booleanPermission,
};

export class PermissionsRecord extends Record(permissions) {}

export class RoleRecord
    extends Record({
        id: "",
        name: "",
        icon: "",
    })
    implements Unique {}

export class AuthRecord
    extends Record(
        {
            id: "",
            token: "",
        },
        "auth"
    )
    implements Unique {}
