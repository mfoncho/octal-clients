import { io } from "../types";
import BaseClient, { Params } from "../base";

export interface CreateSpaceRoleRequest {
    role_id: string;
    space_id: string;
}

export interface SetSpaceRolePermissionRequest {
    role_id: string;
    space_id: string;
    params: {
        permission: string;
        value: string | number | boolean;
        overwrite?: boolean;
    };
}

export interface DeleteSpaceRoleRequest {
    role_id: string;
    space_id: string;
}

export interface DeleteSpaceRolePermissionRequest {
    role_id: string;
    space_id: string;
    permission: string;
}

export interface FetchSpaceRolesRequest {
    space_id: string;
}

export default class RoleClient extends BaseClient {
    async fetchSpaceRoles(
        request: FetchSpaceRolesRequest,
        params?: Params
    ): Promise<io.SpaceRole[]> {
        const path = `/spaces/${request.space_id}/roles`;
        const { data } = await this.endpoint.get(path, params);
        return data;
    }

    async createSpaceRole(
        request: CreateSpaceRoleRequest,
        params?: Params
    ): Promise<io.SpaceRole> {
        const path = `/spaces/${request.space_id}/roles/${request.role_id}`;
        const { data } = await this.endpoint.post(path, {}, params);
        return data;
    }

    async setSpaceRolePermission(
        request: SetSpaceRolePermissionRequest,
        params?: Params
    ): Promise<io.Permission> {
        const path = `/spaces/${request.space_id}/roles/${request.role_id}/permissions`;
        const { data } = await this.endpoint.post(path, request.params, params);
        return data;
    }

    async deleteSpaceRolePermission(
        request: DeleteSpaceRolePermissionRequest,
        params?: Params
    ): Promise<any> {
        const path = `/spaces/${request.space_id}/roles/${request.role_id}/permissions/${request.permission}`;
        const { data } = await this.endpoint.delete(path, params);
        return data;
    }

    async deleteSpaceRole(
        request: DeleteSpaceRoleRequest,
        params?: Params
    ): Promise<any> {
        const path = `/spaces/${request.space_id}/roles/${request.role_id}`;
        const { data } = await this.endpoint.delete(path, params);
        return data;
    }
}
