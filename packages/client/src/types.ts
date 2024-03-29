export interface Timestamp extends String {}

export type CollectionType = "stack" | "queue";

export type ThreadType =
    | "main"
    | "reply"
    | "record"
    | "topic"
    | "comment"
    | "email";

export type SpaceType = "public" | "private" | "direct" | "common";

export type Id = string;

export type PreferenceValue = string | number | boolean;

export interface Unique {
    id: Id;
}

export interface Timestamped {
    timestamp: Timestamp;
}

export interface Positioned {
    index: number;
}

export interface BelongsToUser {
    user_id: Id;
}

export interface BelongsToRecord {
    record_id: Id;
}

export interface HasThread {
    thread_id: Id;
}

export interface BelongsToCatalog {
    catalog_id: Id;
}

export interface BelongsToSpace {
    space_id: Id;
}

export interface Page<Entry = any> {
    entries: Entry[];
    page_size: number;
    page_number: number;
    total_pages: number;
    total_entries: number;
}

export namespace io {
    export type PresenceState =
        | "invisible"
        | "offline"
        | "online"
        | "away"
        | "busy"
        | "dnd";

    export interface Bookmark {
        id: string;
        type: string;
        notes: string;
        user_id: string;
        entity_id: string;
        created_at: string;
        updated_at: string;
    }

    export interface Tracker {
        id: string;
        event: string;
        target: string;
        entity_id: string;
        created_at: string;
    }

    export interface Name {
        name: string;
        type: string;
        metadata: string;
        entity_id: string;
    }

    export interface RecordFieldTemplate {
        name: string;
        type: string;
    }

    export interface RecordTemplate {
        id: string;
        name: string;
        catalog_id: string;
        fields: RecordFieldTemplate[];
    }

    export interface Calendar {
        records: Record[];
    }

    export interface Site {
        name: string;
        icon: string;
        title: string;
        about: string;
    }

    export interface Permission {
        permission: string;
        overwrite?: boolean;
        value: boolean | string | number;
    }

    export interface Config {
        locale: string;
        lpack: { [key: string]: string };
        user_invitation: boolean;
        user_registration: boolean;
        admin_api_version: string;
        client_api_version: string;
        socket_api_version: string;
        admin_api_endpoint: string;
        client_api_endpoint: string;
        socket_api_endpoint: string;
        socket_api_protocol: string;
        auth_providers: [[string, string]];
    }

    export interface Invitation extends Unique {
        user: Author;
        sent: boolean;
        email: string;
        approved: boolean;
        timestamp: string;
        space_id: string;
        invitee?: Author;
        resolver?: Author;
        resolved_at?: string;
    }

    export interface Preference {
        preference: string;
        value: PreferenceValue | PreferenceValue[];
    }

    export interface Presence {
        state: PresenceState;
        timestamp: string;
        phx_ref?: string;
        phx_ref_prev?: string;
    }

    export interface PresenceSync {
        metas: Presence[];
    }

    export interface UserStatus {
        icon?: string;
        text: string;
        timeout: string;
    }

    export interface Author extends Unique {
        name: string;
        username: string;
        avatar: string;
    }

    export interface User extends Author {
        bio: string;
        roles: string[];
        status: UserStatus;
        created_at: Timestamp;
    }

    export interface SpaceInvite {
        id: string;
        user: Author;
        link: string;
        email: string;
        space_id: string;
        expire_at: string;
        created_at: string;
    }

    export interface Reaction {
        user: Author;
        reaction: string;
        message_id: string;
        created_at: Timestamp;
    }

    export interface Task extends Unique {
        name: string;
        checked: boolean;
        checklist_id: string;
    }

    export interface Checklist extends Unique, BelongsToRecord {
        name: string;
        tasks: Task[];
        user: Author;
        timestamp: string;
    }

    export interface Label extends Unique, BelongsToCatalog {
        name: string;
        color: string;
    }

    export interface RecordFieldValue {
        id: string;
        record_id: string;
        field_id: string;
    }

    export interface RecordTextValue extends RecordFieldValue {
        text: string;
    }

    export interface RecordUserValue extends RecordFieldValue {
        user: Author;
    }

    export interface RecordLabelValue extends RecordFieldValue {
        label: Label;
    }

    export interface RecordField {
        id: string;
        type: string;
        name: string;
        record_id: string;
        index: number;
        created_at: string;
        values: (RecordTextValue | RecordUserValue | RecordLabelValue)[];
    }

    export interface RecordLabel extends BelongsToRecord {
        label_id: string;
        labeled_at: string;
    }

    export interface Record extends Unique, BelongsToCatalog {
        name: string;
        user: Author;
        fields: RecordField[];
        checked: boolean;
        index: number;
        collection_id: string;
        created_at: string;
        archived_at?: string | null;
    }

    export interface Collection extends Unique, BelongsToCatalog {
        name: string;
        type: CollectionType;
        origin: boolean;
        capacity: number;
        index: number;
        archived_at: string | null;
    }

    export interface UsersReaction {
        reaction: string;
        users: Author[];
    }

    export interface Workspace {
        name: string;
        logo: string;
        admin_id: string;
        description: string;
    }

    export interface Role extends Unique {
        name: string;
        icon: string;
    }

    export interface UserRole extends Role {
        permissions: Permission[];
    }

    export interface Auth {
        user: User;
        roles: UserRole[];
        token: string;
        preferences: Preference[];
    }

    export interface SpaceRole extends BelongsToSpace {
        role_id: string;
        permissions: Permission[];
    }

    export interface Labels extends Unique, BelongsToCatalog {
        name: string;
        color: string;
        created_at: Timestamp;
    }

    export interface Catalog extends Unique, BelongsToSpace {
        name: string;
        is_archived: boolean;
        created_at: Timestamp;
        archived_at: Timestamp;
    }

    export interface Topic extends Unique, BelongsToSpace {
        name: string;
        is_main: boolean;
        thread_id: string;
        is_archived: boolean;
        created_at: Timestamp;
        archived_at: Timestamp;
    }

    export interface TopicSearchResult extends Page<Message> {}

    export interface Space extends Unique {
        name: string;
        purpose: string;
        admin_id: string;
        type: SpaceType;
        created_at: Timestamp;
    }

    export interface Member extends Unique, BelongsToSpace {
        user: Author;
        joined_at: string;
        last_seen_at: Timestamp;
    }

    export interface Thread extends Unique, BelongsToSpace {
        type: string;
        name: string;
        message_count: number;
        last_message_id: string;
        first_message_id: string;
        unread_message_count: number;
        created_at: Timestamp;
    }

    export interface Message extends Unique, HasThread, Timestamped {
        author: Author;
        pinned: boolean;
        content: string;
        embeds: [];
        attachement: any;
        reply?: Message;
        reply_id?: string;
        reactions: UsersReaction[];
    }

    export interface UserMessage extends Message {
        flagged: boolean;
    }
}
