import { Record } from "immutable";
import { Unique } from "@octal/client";

export interface IPermission<T = any> {
    readonly name: string;
    readonly value: T;
    readonly base?: string;
    equal(value: any): boolean;
    setValue(value: any): IPermission<T>;
}

export class BooleanPermission
    extends Record({
        name: "",
        value: true,
        base: "static",
    })
    implements IPermission<boolean>
{
    constructor(value = true, base = "static") {
        super({ value, base });
    }

    equal(value: boolean) {
        return value == this.value;
    }

    setValue(value: any) {
        return this.set("value", Boolean(value));
    }
}

export class NumberPermission
    extends Record({
        name: "",
        value: 0,
        base: "static",
    })
    implements IPermission<number>
{
    constructor(value = 0, base = "static") {
        super({ value, base });
    }

    equal(value: any) {
        return Number(value) === this.value;
    }

    setValue(value: any) {
        return this.set("value", Number(value));
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

export class StringPermission
    extends Record({
        name: "",
        value: "",
        base: "static",
    })
    implements IPermission<string>
{
    constructor(value = "", base = "static") {
        super({ value, base });
    }

    equal(value: any) {
        return String(value).trim() === this.value;
    }

    setValue(value: any) {
        return this.set("value", String(value).trim());
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
