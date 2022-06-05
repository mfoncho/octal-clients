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
    status: string;
    timeout?: string;
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
    ): Promise<io.User> {
        const path = `/user/status/${request.status}`;
        const payload = {
            timeout: request.timeout,
        };
        const { data } = await this.endpoint.post(path, payload, params);
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
}
