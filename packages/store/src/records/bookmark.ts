import { Record } from "immutable";

export class BookmarkRecord extends Record({
    id: "",
    type: "",
    notes: "",
    user_id: "",
    entity: "",
    created_at: "",
    updated_at: "",
}) {}
