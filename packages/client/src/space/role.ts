import { io } from "../types";
import BaseClient, { Params } from "../base";

export interface CreateSpaceRoleRequest {
    space_id: string;
    role_id: string;
}

export interface UpdateSpaceRolePermissionsRequest {
    space_id: string;
    role_id: string;
    params: any;
}

export interface DeleteSpaceRoleRequest {
    space_id: string;
    role_id: string;
}

export interface FetchSpaceRolesRequest {
    space_id: string;
}

export default class RoleClient extends BaseClient {
    async fetchRoles(params?: Params): Promise<io.Role[]> {
        const path = `/roles`;
        const { data } = await this.endpoint.get(path, params);
        return data;
    }

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

    async updateSpaceRolePermissions(
        request: UpdateSpaceRolePermissionsRequest,
        params?: Params
    ): Promise<io.SpaceRole> {
        const path = `/spaces/${request.space_id}/roles/${request.role_id}/permissions`;
        const { data } = await this.endpoint.patch(
            path,
            request.params,
            params
        );
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
