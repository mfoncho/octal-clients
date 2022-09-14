import { io } from "../types";
import BaseClient, { Params } from "../base";

export interface JoinSpaceRequest {
    space_id: string;
}

export interface CreateSpaceRequest {
    name: string;
    topic: string;
    type: "private" | "public";
}

export interface UpdateSpaceRequest {
    space_id: string;
    params: {
        name?: string;
        type?: "private" | "public";
    };
}

export interface ShutdownSpaceRequest {
    space_id: string;
}

export interface DestroySpaceRequest {
    space_id: string;
}

export interface GetSpaceRequest {
    space_id: string;
}

export default class SpaceClient extends BaseClient {
    async fetchArchivedSpaces(params?: Params): Promise<io.Space[]> {
        const path = `/archived`;
        const { data } = await this.endpoint.get(path, params);
        return data;
    }

    async fetchPublicSpaces(params?: Params): Promise<io.Space[]> {
        const path = `/joinable`;
        const { data } = await this.endpoint.get(path, params);
        return data;
    }

    async fetchSpaces(params?: Params): Promise<io.Space[]> {
        const { data } = await this.endpoint.get(`/spaces`, params);
        return data;
    }

    async getSpace(
        request: GetSpaceRequest,
        params?: Params
    ): Promise<io.Space> {
        const path = `/spaces/${request.space_id}`;
        const { data } = await this.endpoint.get(path, params);
        return data;
    }

    async shutdownSpace(
        request: ShutdownSpaceRequest,
        params?: Params
    ): Promise<io.Space> {
        const path = `/spaces/${request.space_id}/shutdown`;
        const { data } = await this.endpoint.post(path, {}, params);
        return data;
    }

    async createSpace(
        request: CreateSpaceRequest,
        params?: Params
    ): Promise<io.Space> {
        const path = `/spaces`;
        const { data } = await this.endpoint.post(path, request, params);
        return data;
    }

    async joinSpace(
        request: JoinSpaceRequest,
        params?: Params
    ): Promise<io.Space> {
        const path = `/spaces/${request.space_id}/join`;
        const { data } = await this.endpoint.post(path, params);
        return data;
    }

    async updateSpace(
        request: UpdateSpaceRequest,
        params?: Params
    ): Promise<io.Space> {
        const path = `/spaces/${request.space_id}`;
        const { data } = await this.endpoint.patch(
            path,
            request.params,
            params
        );
        return data;
    }

    async destroySpace(
        request: DestroySpaceRequest,
        params?: Params
    ): Promise<any> {
        const path = `/spaces/${request.space_id}`;
        const { data } = await this.endpoint.delete(path, params);
        return data;
    }
}
