import { io } from "../types";
import BaseClient, { Params } from "../base";

export interface ClaimAccountRequest {
    email: string;
    password: string;
}

export interface LoginRequest {
    email: string;
    password: string;
    remember_me?: boolean;
}

export interface PasswordResetRequest {
    email: string;
}

export interface ResetPasswordRequest {
    request_id: string;
    params: {
        code: string;
    };
}

export default class AuthClient extends BaseClient {
    async getAuth(params?: Params): Promise<io.Auth> {
        const { data } = await this.endpoint.get("/auth", params);
        return data;
    }

    async claimAuth(
        request: ClaimAccountRequest,
        params?: Params
    ): Promise<io.Auth> {
        const { data } = await this.endpoint.post(
            "/auth/claim",
            request,
            params
        );
        return data;
    }

    async login(request: LoginRequest, params?: Params): Promise<io.Auth> {
        const { data } = await this.endpoint.post(
            "/auth/login",
            request,
            params
        );
        return data;
    }

    async requestPasswordReset(
        request: PasswordResetRequest,
        params?: Params
    ): Promise<{ id: string; timestamp: string }> {
        const { data } = await this.endpoint.post(
            "/auth/reset",
            request,
            params
        );
        return data;
    }

    async resetPassword(
        request: ResetPasswordRequest,
        params?: Params
    ): Promise<any> {
        const { data } = await this.endpoint.post(
            `/auth/reset/${request.request_id}`,
            request.params,
            params
        );
        return data;
    }

    async logout(params?: Params): Promise<any> {
        const { data } = await this.endpoint.post("/auth/logout", {}, params);
        return data;
    }
}
