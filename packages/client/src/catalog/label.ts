import { io } from "../types";
import BaseClient, { Params } from "../base";

export interface CreateLabelRequest {
    catalog_id: string;
    params: {
        name: string;
        color: string;
    };
}

export interface DeleteLabelRequest {
    catalog_id: string;
    label_id: string;
}

export interface UpdateLabelRequest {
    catalog_id: string;
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
        const path = `/catalogs/${request.catalog_id}/labels`;
        const { data } = await this.endpoint.post(path, request.params, params);
        return data;
    }

    async updateLabel(
        request: UpdateLabelRequest,
        params?: Params
    ): Promise<io.Label> {
        const path = `/catalogs/${request.catalog_id}/labels/${request.label_id}`;
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
        const path = `/catalogs/${request.catalog_id}/labels/${request.label_id}`;
        const { data } = await this.endpoint.delete(path, params);
        return data;
    }
}
