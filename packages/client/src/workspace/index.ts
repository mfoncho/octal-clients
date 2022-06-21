import { io } from "../types";
import BaseClient, { Params } from "../base";

export interface CreateTrackerReqeust {
    event: string;
    entity: string;
    target: string;
}

export default class WorkspaceClient extends BaseClient {
    async getConfig(params?: Params): Promise<io.Config> {
        const { data } = await this.endpoint.get(`/config`, params);
        return data;
    }

    async getSite(params?: Params): Promise<io.Site> {
        const { data } = await this.endpoint.get(`/site`, params);
        return data;
    }

    async getWorkspace(params?: Params): Promise<io.Workspace> {
        const { data } = await this.endpoint.get(`/workspace`, params);
        return data;
    }

    async createTracker(
        req: CreateTrackerReqeust,
        params?: Params
    ): Promise<io.Tracker> {
        const { data } = await this.endpoint.post(`/trackers`, req, params);
        return data;
    }

    async deleteTracker(id: string, params?: Params): Promise<io.Tracker> {
        const { data } = await this.endpoint.delete(`/trackers/${id}`, params);
        return data;
    }

    async fetchTrackers(): Promise<io.Tracker> {
        const { data } = await this.endpoint.get("/trackers");
        return data;
    }

    async fetchRoles(): Promise<io.Role[]> {
        const { data } = await this.endpoint.get("/roles");
        return data;
    }
}
