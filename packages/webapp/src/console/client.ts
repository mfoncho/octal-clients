import Endpoint from "@octal/endpoint";
import { Page } from "src/types";
import { io } from "./types";

const endpoint = Endpoint.create({ baseURL: "http://192.168.1.2:8080/api" });

export interface FetchUsersRequest {
    page?: number | string;
    name?: string;
    email?: string;
    limit?: number | string;
    suspended?: boolean;
}

export interface FetchSpaceBoards {
    space_id: string;
}

export interface UpdateWorkspaceRequest {
    name?: string;
    icon?: string;
}

export interface DeleteSpaceRequest {
    space_id: string;
}

export interface RestoreSpaceRequest {
    space_id: string;
}

export interface GetRolesRequest {
    role_id: string;
}

export interface FetchRolePermissionsRequestst {
    role_id: string;
}

export interface MailInviteRequest {
    invite_id: string;
}

export interface DeleteInviteRequest {
    invite_id: string;
}

export interface UpdateRoleRequest {
    role_id: string;
    params: {
        name?: string;
        icon?: string;
    };
}

export interface FetchRolesUsersRequest {
    role_id: string;
}

export interface CreateRoleRequest {
    icon: string;
    name: string;
}

export interface UpdateRolesRequest {
    name: string;
}

export interface SetRolePermissionsRequest {
    role_id: string;
    permission: string;
    params: {
        value: any;
        overwrite: boolean;
    };
}

export interface DeleteRoleRequest {
    role_id: string;
}

export interface AddRoleUserRequest {
    role_id: string;
    user_id: string;
}

export interface RemoveRoleUserRequest {
    role_id: string;
    user_id: string;
}

export interface AddSpaceUserRequest {
    space_id: string;
    user_id: string;
}

export interface RemoveSpaceMemberRequest {
    space_id: string;
    member_id: string;
}

export interface CrownSpaceMemberRequest {
    space_id: string;
    member_id: string;
}

export interface FetchBoardsRequest {
    page?: number;
    name?: string;
    limit?: number | string;
    archived?: boolean;
}

export interface GetSpaceRequest {
    space_id: string;
}

export interface FetchSpaceTopicsRequest {
    space_id: string;
}

export interface FetchSpaceMembersRequest {
    space_id: string;
}

export interface FetchInvitesRequest {
    page?: number;
    limit?: number | string;
    user_id?: string;
    space_id?: string;
}

export interface FetchWorkspaceSpacesRequest {
    id: string;
    page?: number;
    name?: string;
    archived?: boolean;
    type?: "board" | "forum";
    access?: "public" | "private";
}

export interface FetchSpacesRequest {
    page?: number;
    name?: string;
    archived?: boolean;
    type?: "board" | "forum";
    access?: "public" | "private";
}

export interface GetUserRequest {
    user_id: string;
}

export interface GetUserStatsRequest {
    user_id: string;
}

export interface FetchUserSpacesRequest {
    user_id: string;
}

export interface FetchUserWorkspacesRequest {
    user_id: string;
}

export interface FetchUserMembersRequest {
    user_id: string;
}

class Client {
    async fetchUsers(params?: FetchUsersRequest): Promise<Page<io.User>> {
        const { data } = await endpoint.get("/users", { params });
        return data;
    }

    async fetchSpaces(params?: FetchBoardsRequest): Promise<Page<io.Space>> {
        const { data } = await endpoint.get("/spaces", { params });
        return data;
    }

    async fetchSpaceTopics({
        space_id,
        ...params
    }: FetchSpaceTopicsRequest): Promise<io.Topic[]> {
        const { data } = await endpoint.get(`/spaces/${space_id}/topics`, {
            params,
        });
        return data;
    }

    async fetchSpaceMembers({
        space_id,
        ...params
    }: FetchSpaceTopicsRequest): Promise<io.Member[]> {
        const { data } = await endpoint.get(`/spaces/${space_id}/members`, {
            params,
        });
        return data;
    }

    async addSpaceUser({
        space_id,
        user_id,
    }: AddSpaceUserRequest): Promise<io.Member> {
        const { data } = await endpoint.post(
            `/spaces/${space_id}/users/${user_id}`
        );
        return data;
    }

    async removeSpaceMember({
        space_id,
        member_id,
    }: RemoveSpaceMemberRequest): Promise<any> {
        const { data } = await endpoint.delete(
            `/spaces/${space_id}/members/${member_id}`
        );
        return data;
    }

    async crownSpaceMember({
        space_id,
        member_id,
    }: CrownSpaceMemberRequest): Promise<io.Member> {
        const { data } = await endpoint.post(
            `/spaces/${space_id}/admin/${member_id}`
        );
        return data;
    }

    async getSpace({ space_id }: GetSpaceRequest): Promise<io.ColabSpace> {
        const { data } = await endpoint.get(`/spaces/${space_id}`);
        return data;
    }

    async deleteSpace({ space_id }: DeleteSpaceRequest): Promise<any> {
        const { data } = await endpoint.delete(`/spaces/${space_id}`);
        return data;
    }

    async restoreSpace({ space_id }: DeleteSpaceRequest): Promise<any> {
        const { data } = await endpoint.post(`/spaces/${space_id}/restore`);
        return data;
    }

    async getWorkspace(): Promise<io.Workspace> {
        const { data } = await endpoint.get(`/workspace`);
        return data;
    }

    async updateWorkspace(
        params: UpdateWorkspaceRequest
    ): Promise<io.Workspace> {
        const { data } = await endpoint.patch(`/workspace`, params);
        return data;
    }

    async fetchInvites(params?: FetchInvitesRequest): Promise<Page<io.Invite>> {
        const { data } = await endpoint.get(`/invites`, { params });
        return data;
    }

    async mailInvite({ invite_id }: MailInviteRequest): Promise<io.Invite> {
        const { data } = await endpoint.post(`/invites/${invite_id}/mail`);
        return data;
    }

    async deleteInvite({ invite_id }: DeleteInviteRequest): Promise<any> {
        const { data } = await endpoint.delete(`/invites/${invite_id}`);
        return data;
    }

    async fetchWorkspaceUsersAvailable(id: string): Promise<io.RoleUser[]> {
        const { data } = await endpoint.get(
            `/workspaces/${id}/users/available`
        );
        return data;
    }

    async getAccount(params: GetUserRequest): Promise<io.Account> {
        const { data } = await endpoint.get(`/users/${params.user_id}`);
        return data;
    }

    async getUserStats(params: GetUserRequest): Promise<any> {
        const { data } = await endpoint.get(`/users/${params.user_id}/stats`);
        return data;
    }

    async fetchUserSpaces(params: FetchUserSpacesRequest): Promise<io.Space[]> {
        const { data } = await endpoint.get(`/users/${params.user_id}/spaces`);
        return data;
    }

    async fetchWorkspace(): Promise<io.Workspace> {
        const { data } = await endpoint.get("/workspace");
        return data;
    }

    async updateSiteInfo(params: Partial<io.SiteInfo>): Promise<io.SiteInfo> {
        const { data } = await endpoint.patch("/site/info", params);
        return data;
    }

    async getSiteConfig(): Promise<io.SiteConfig> {
        const { data } = await endpoint.get("/site/config");
        return data;
    }

    async updateSiteConfig(
        params: Partial<io.SiteConfig>
    ): Promise<io.SiteConfig> {
        const { data } = await endpoint.patch("/site/config", params);
        return data;
    }

    async fetchRoles(): Promise<io.Role[]> {
        const { data } = await endpoint.get("/roles");
        return data;
    }

    async fetchRolePermissions({
        role_id,
    }: FetchRolePermissionsRequestst): Promise<io.Permission[]> {
        const { data } = await endpoint.get(`/roles/${role_id}/permissions`);
        return data;
    }

    async createRole(params: CreateRoleRequest): Promise<io.Role> {
        const { data } = await endpoint.post(`/roles`, params);
        return data;
    }

    async addRoleUser({
        user_id,
        role_id,
    }: AddRoleUserRequest): Promise<io.RoleUser> {
        const { data } = await endpoint.post(
            `/roles/${role_id}/users/${user_id}`
        );
        return data;
    }

    async updateRole({ role_id, params }: UpdateRoleRequest): Promise<io.Role> {
        const { data } = await endpoint.patch(`/roles/${role_id}`, params);
        return data;
    }

    async removeRoleUser({
        user_id,
        role_id,
    }: RemoveRoleUserRequest): Promise<any> {
        const { data } = await endpoint.delete(
            `/roles/${role_id}/users/${user_id}`
        );
        return data;
    }

    async fetchRoleUsers({
        role_id,
    }: FetchRolesUsersRequest): Promise<io.RoleUser[]> {
        const { data } = await endpoint.get(`/roles/${role_id}/users`);
        return data;
    }

    async getRole({ role_id }: GetRolesRequest): Promise<io.Role> {
        const { data } = await endpoint.get(`/roles/${role_id}`);
        return data;
    }

    async deleteRole({ role_id }: DeleteRoleRequest): Promise<any> {
        const { data } = await endpoint.delete(`/roles/${role_id}`);
        return data;
    }

    async setRolePermissions(
        request: SetRolePermissionsRequest
    ): Promise<io.Permission[]> {
        const { data } = await endpoint.post(
            `/roles/${request.role_id}/permissions/${request.permission}`,
            request.params
        );
        return data;
    }

    async fetchSpaceBoards({
        space_id,
    }: FetchSpaceBoards): Promise<io.Board[]> {
        const { data } = await endpoint.get(`/spaces/${space_id}/boards`);
        return data;
    }

    async getRoomCounters(): Promise<io.RoomCounters> {
        const { data } = await endpoint.get(`/counters/rooms`);
        return data;
    }

    async getBoardCounters(): Promise<io.BoardCounters> {
        const { data } = await endpoint.get(`/counters/boards`);
        return data;
    }

    async getWorkspaceCounters(): Promise<io.WorkspaceCounters> {
        const { data } = await endpoint.get(`/counters`);
        return data;
    }
}

export default new Client();
