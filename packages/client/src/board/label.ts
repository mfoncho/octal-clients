import { io } from "../types";
import BaseClient, { Params } from "../base";

export interface CreateLabelRequest {
    space_id: string;
    params: {
        name: string;
        color: string;
    };
}

export interface DeleteLabelRequest {
    space_id: string;
    label_id: string;
}

export interface UpdateLabelRequest {
    space_id: string;
    label_id: string;
    params: {
        name?: string;
        color?: string;
    };
}

export default class LabelClient extends BaseClient {
    async createLabel(
        request: CreateLabelRequest,
        params?: Params
    ): Promise<io.Label> {
        const path = `/spaces/${request.space_id}/labels`;
        const { data } = await this.endpoint.post(path, request.params, params);
        return data;
    }

    async updateLabel(
        request: UpdateLabelRequest,
        params?: Params
    ): Promise<io.Label> {
        const path = `/spaces/${request.space_id}/labels/${request.label_id}`;
        const { data } = await this.endpoint.patch(
            path,
            request.params,
            params
        );
        return data;
    }

    async deleteLabel(
        request: DeleteLabelRequest,
        params?: Params
    ): Promise<io.Label> {
        const path = `/spaces/${request.space_id}/labels/${request.label_id}`;
        const { data } = await this.endpoint.delete(path, params);
        return data;
    }
}
