import { io } from "../types";
import BaseClient, { Params } from "../base";

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

    async fetchTrackers(): Promise<io.Trackers> {
        const { data } = await this.endpoint.get("/trackers");
        return data;
    }
}
