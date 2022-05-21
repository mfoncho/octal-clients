export interface Timestamp extends String {}

export type ColumnType = "stack" | "queue";

export type ThreadType =
    | "main"
    | "reply"
    | "card"
    | "topic"
    | "comment"
    | "email";

export type AccessType = "public" | "private" | "direct";

export type Id = string;

export interface Unique {
    id: Id;
}

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

export interface BelongsToThread {
    thread_id: Id;
}

export interface BelongsToBoard {
    board_id: Id;
}

export interface BelongsToSpace {
    space_id: Id;
}

export interface BelongsToWorkspace {
    workspace_id: Id;
}

export namespace io {
    export type PresenceState =
        | "invisible"
        | "offline"
        | "online"
        | "away"
        | "busy"
        | "dnd";

    export interface Trackers {
        [key: string]: string[];
    }
    export interface BoardTemplate {
        id: string;
        name: string;
        type: "board";
        author: {
            name: string;
            email: string;
        };
        board: {
            name: string;
            columns: any[];
        };
        topics: any[];
        description: string;
    }

    export interface Calendar {
        cards: Card[];
    }

    export interface DiscussTemplate {
        id: string;
        name: string;
        type: "board";
        author: {
            name: string;
            email: string;
        };
        topics: any[];
        description: string;
    }

    export interface Site {
        name: string;
        icon: string;
        title: string;
        about: string;
    }

    export interface Permission {
        name: string;
        base: string;
        value: boolean | string | number | number[] | string[] | boolean[];
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

    export interface Preferences {
        theme: string;
        locale: string;
        timezone: string;
        time_format: "12" | "24";
        message_type: "default" | "compact";
        theme_mode: "light" | "dark";
        notifications: boolean;
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

    export interface Status extends Unique {
        name: string;
        icon: string;
    }

    export interface Author extends Unique {
        name: string;
        avatar: string;
        username: string;
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

    export interface User extends Author {
        status_id: string;
    }

    export interface Task extends Unique {
        name: string;
        complete: boolean;
        checklist_id: string;
    }

    export interface Checklist extends Unique, BelongsToCard {
        name: string;
        tasks: Task[];
        user: Author;
        timestamp: string;
    }

    export interface Label extends Unique, BelongsToBoard {
        name: string;
        color: string;
    }

    export interface CardFieldValue {
        id: string;
        card_id: string;
        field_id: string;
    }

    export interface CardTextValue extends CardFieldValue {
        text: string;
    }

    export interface CardUserValue extends CardFieldValue {
        user: Author;
    }

    export interface CardLabelValue extends CardFieldValue {
        label: Label;
    }

    export interface CardField {
        id: string;
        type: string;
        name: string;
        card_id: string;
        position: number;
        created_at: string;
        values: (CardTextValue | CardUserValue | CardLabelValue)[];
    }

    export interface CardLabel extends BelongsToCard {
        label_id: string;
        labeled_at: string;
    }

    export interface Card extends Unique, BelongsToBoard {
        done: boolean;
        name: string;
        user: Author;
        fields: CardField[];
        position: number;
        deadline: string | null;
        timestamp: string;
        column_id: string;
        description: string;
        checklists: Checklist[];
        archived_at: string | null;
    }

    export interface Column extends Unique, BelongsToBoard {
        name: string;
        type: ColumnType;
        origin: boolean;
        capacity: number;
        position: number;
        archived_at: string | null;
    }

    export interface UsersReaction {
        reaction: string;
        users: Author[];
    }

    export interface Workspace extends Unique {
        name: string;
        icon: string;
        owner_id: string;
        timestamp: string;
        description: string;
    }

    export interface Permissions {
        add_reaction: boolean;
        create_card: boolean;
        delete_message: boolean;
        edit_message: boolean;
        embed_links: boolean;
        flag_message: boolean;
        leave_channel: boolean;
        manage_board: boolean;
        manage_channel: boolean;
        manage_messages: boolean;
        mention_members: boolean;
        pin_message: boolean;
        post_message: boolean;
        send_invitation: boolean;
        post_reply: boolean;
        upload_file: boolean;
        upload_limit: number;
        upload_types: string;
        use_markdown: boolean;
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
        preferences: Preferences;
    }

    export interface SpaceRole extends Unique, BelongsToSpace {
        role_id: string;
        permissions: Permission[];
    }

    export interface Labels extends Unique, BelongsToBoard {
        name: string;
        color: string;
        created_at: Timestamp;
    }

    export interface Board extends Unique, BelongsToSpace {
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

    export interface Space extends Unique, BelongsToWorkspace {
        icon: string;
        name: string;
        access: AccessType;
        topics: Topic[];
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

    export interface Message extends Unique, BelongsToThread, Timestamped {
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
