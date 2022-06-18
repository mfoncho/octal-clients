import { io } from "../types";
import BaseClient, { Params } from "../base";

export type UpdatePreferencesRequest = Partial<io.Preferences>;

export interface UpdateUserProfileRequest {
    name?: string;
    about?: string;
    avatar?: File | string;
    username?: string;
}

export interface UpdatePasswordRequest {
    password: string;
    new_password: string;
}

export interface SetUserStatusRequest {
    user_id: string;
    params: {
        status: string;
        timeout?: string;
    };
}

export interface FetchBookmarksRequest {
    type?: string;
}

export interface CreateBookmarkRequest {
    entity: string;
    type: string;
    notes?: string;
}

export interface UpdateBookmarkRequest {
    bookmark_id: string;
    params: {
        notes: string;
    };
}

export interface DeleteBookmarkRequest {
    bookmark_id: string;
}

export default class UserClient extends BaseClient {
    async fetchUsers(params?: Params): Promise<io.User[]> {
        const { data } = await this.endpoint.get(`/users`, params);
        return data;
    }

    async getUser(request: string, params?: Params): Promise<io.User> {
        const { data } = await this.endpoint.get(`/users/${request}`, params);
        return data;
    }

    async updateUserProfile(
        request: UpdateUserProfileRequest,
        params?: Params
    ): Promise<io.User> {
        const { data } = await this.endpoint.patch(`/user`, request, {
            params,
        });
        return data;
    }

    async updatePassword(request: UpdatePasswordRequest, params?: Params) {
        const { data } = await this.endpoint.post(`/password`, request, {
            params,
        });
        return data;
    }

    async setUserPresence(
        presence: io.Presence,
        params?: Params
    ): Promise<any> {
        const path = `/user/presence/${presence}`;
        const { data } = await this.endpoint.post(path, params);
        return data;
    }

    async setUserStatus(
        request: SetUserStatusRequest,
        params?: Params
    ): Promise<io.UserStatus> {
        const path = `/status`;
        const { data } = await this.endpoint.post(path, request.params, params);
        return data;
    }

    async getPreferences(params?: Params): Promise<io.Preferences> {
        const { data } = await this.endpoint.get("/preferences", params);
        return data;
    }

    async updatePreferences(
        payload: UpdatePreferencesRequest,
        params?: Params
    ): Promise<io.Preferences> {
        const { data } = await this.endpoint.patch(
            "/preferences",
            payload,
            params
        );
        return data;
    }

    async fetchBookmarks(
        req: FetchBookmarksRequest,
        params?: Params
    ): Promise<io.Bookmark[]> {
        const { data } = await this.endpoint.get(`/bookmarks`, req, params);
        return data;
    }

    async createBookmark(
        req: CreateBookmarkRequest,
        params?: Params
    ): Promise<io.Bookmark> {
        const { data } = await this.endpoint.post(`/bookmarks`, req, params);
        return data;
    }

    async updateBookmark(
        req: UpdateBookmarkRequest,
        params?: Params
    ): Promise<io.Bookmark> {
        const { data } = await this.endpoint.patch(
            `/bookmarks/${req.bookmark_id}`,
            req.params,
            params
        );
        return data;
    }

    async deleteBookmark(id: string, params?: Params): Promise<any> {
        const { data } = await this.endpoint.delete(`/bookmarks/${id}`, params);
        return data;
    }
}
