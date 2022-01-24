import { Record } from "immutable";
import { Unique, BelongsToSpace } from "@octal/client";
export class MemberRecord
    extends Record({
        id: "",
        role_id: "",
        user_id: "",
        joined_at: "",
        space_id: "",
        membership_id: "",
    })
    implements Unique, BelongsToSpace {}
