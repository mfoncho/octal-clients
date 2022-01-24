import { io } from "../types";
import BaseClient, { Params } from "../base";

export interface SendInvitesRequest {
    space_id: string;
    params: string[];
}

export interface FetchSpaceInvitesRequest {
    space_id: string;
}

export interface SpaceInviteRequest {
    space_id: string;
}

export interface DeleteInviteRequest {
    space_id: string;
    invite_id: string;
}

export default class InvitationClient extends BaseClient {
    async getSpaceInvite(
        request: string,
        params?: Params
    ): Promise<io.SpaceInvite> {
        const path = `/spaces/${request}/invite`;
        const { data } = await this.endpoint.get(path, {
            params,
        });
        return data;
    }

    async fetchSpaceInvites(
        request: string,
        params?: Params
    ): Promise<io.SpaceInvite[]> {
        const { data } = await this.endpoint.get(`/spaces/${request}/invites`, {
            params,
        });
        return data;
    }

    async deleteInvitation(
        request: DeleteInviteRequest,
        params?: Params
    ): Promise<any> {
        const { data } = await this.endpoint.delete(
            `/spaces/${request.space_id}/invites/${request.invite_id}`,
            params
        );
        return data;
    }

    async sendInvitations(
        request: SendInvitesRequest,
        params?: Params
    ): Promise<io.Invitation[]> {
        const { data } = await this.endpoint.post(
            `/spaces/${request.space_id}/invites`,
            {
                emails: request.params,
            },
            params
        );
        return data;
    }
}
