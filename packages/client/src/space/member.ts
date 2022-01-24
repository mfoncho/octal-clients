import { io } from "../types";
import BaseClient, { Params } from "../base";

export interface DeleteMemberRequest {
    member_id: string;
    space_id: string;
}

export interface CreateMemberRequest {
    space_id: string;
    user_id: string;
}

export default class MemberClient extends BaseClient {
    async createSpaceMember(
        request: CreateMemberRequest,
        params?: Params
    ): Promise<io.Member> {
        const path = `/spaces/${request.space_id}/users/${request.user_id}`;
        const { data } = await this.endpoint.post(path, {}, params);
        return data;
    }

    async deleteSpaceMember(
        request: DeleteMemberRequest,
        params?: Params
    ): Promise<any> {
        const path = `/spaces/${request.space_id}/members/${request.member_id}`;
        const { data } = await this.endpoint.delete(path, params);
        return data;
    }

    async fetchSpaceMembers(
        request: string,
        params?: Params
    ): Promise<io.Member[]> {
        const path = `/spaces/${request}/members`;
        const { data } = await this.endpoint.get(path, params);
        return data;
    }
}
