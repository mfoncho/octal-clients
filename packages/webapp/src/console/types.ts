export const route = {
    general: "General",
    workspace: "Workspace",
};
export type PresenceState = "online" | "offline" | "busy" | "dnd" | "away";

export namespace io {
    export interface SiteInfo {
        name: string;
        icon: string;
    }

    export interface WorkspaceCounters {
        users: number;
        topics: number;
        spaces: number;
        messages: number;
        tasks: number;
        cards: number;
        done_tasks: number;
        complete_cards: number;
    }

    export interface Invite {
        id: string;
        user: User;
        link: string;
        email: string;
        space: Space;
        mailed: boolean;
        expire_at: string;
        created_at: string;
    }

    export interface RoomCounters {
        topics: number;
        spaces: number;
        messages: number;
    }

    export interface BoardCounters {
        tasks: number;
        cards: number;
        done_tasks: number;
        complete_cards: number;
    }

    export interface SiteConfig {
        allow_invitation: boolean;
        allow_registration: boolean;
        allow_unverified_login: boolean;
    }

    export interface Topic {
        id: string;
        name: string;
        type: string;
        subject?: string;
        is_main?: boolean;
        thread_id: string;
        is_active: boolean;
        space_id: string;
        created_at: string;
    }

    export interface Board {
        id: string;
        name: string;
        space_id: string;
        created_at: string;
    }

    export interface Space {
        id: string;
        name: string;
        type: string;
        admin: User;
        access: string;
        created_at: string;
        is_shutdown: boolean;
    }

    export interface BoardSpace extends Space {
        topics: Topic[];
        board: Board;
    }

    export interface DiscussSpace extends Space {
        topics: Topic[];
        topic_id: string;
    }

    export type ColabSpace = BoardSpace | DiscussSpace;

    export interface Thread {
        id: string;
        topic: string;
        is_main: boolean;
        space_id: string;
        is_active: boolean;
        created_at: string;
        is_default: boolean;
        message_count: number;
    }

    export interface User {
        id: string;
        name: string;
        email: string;
        avatar: string;
        username: string;
        verified: boolean;
        suspended: boolean;
    }

    export interface SpaceRole {
        id: string;
        name: string;
    }

    export interface RoleUser {
        user: User;
        created_at: string;
    }

    export interface Member {
        id: string;
        user: User;
        space_id: string;
        joined_at: string;
    }

    export interface UserMember extends Member {
        space: Space;
    }

    export interface SpaceMember extends Member {
        user: User;
    }

    export interface Presence {
        id: string;
        state: string;
        update_at: string;
    }

    export interface Workspace {
        icon: string;
        name: string;
    }

    export interface Tag {
        id: string;
        name: string;
        color: string;
    }

    export interface Permission {
        name: string;
        type: string;
        value: string;
    }

    export interface Role {
        id: string;
        icon: string;
        name: string;
        is_default: boolean;
    }

    export interface Account extends User {
        status: string;
        about: string;
        roles: Role[];
        presence: Presence;
        created_at: string;
        suspended_at: string;
    }
}
