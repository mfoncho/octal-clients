import { io } from "../types";
import BaseClient, { Params } from "../base";

export interface ArchiveColumnRequest {
    board_id: string;
    column_id: string;
}

export interface CreateColumnRequest {
    name: string;
    type: "stack" | "queue";
    origin: boolean;
    capacity: number;
    board_id: string;
}

export interface UpdateColumnRequest {
    name?: string;
    type?: "stack" | "queue";
    origin?: boolean;
    capacity?: number;
    column_id: string;
    board_id?: string;
}

export interface MoveColumnRequest {
    position: number;
    column_id: string;
    board_id: string;
}

export interface DeleteColumnRequest {
    column_id: string;
    board_id: string;
}

export interface FetchColumnsRequest {
    board_id: string;
}

export interface FetchArchivedColumnsRequest {
    board_id: string;
}

export default class ColumnClient extends BaseClient {
    async fetchArchivedColumns(
        request: FetchArchivedColumnsRequest,
        params?: Params
    ): Promise<io.Column[]> {
        const path = `/boards/${request.board_id}/columns?archived`;
        const { data } = await this.endpoint.get(path, params);
        return data;
    }

    async fetchColumns(
        request: FetchColumnsRequest,
        params?: Params
    ): Promise<io.Column[]> {
        const path = `/boards/${request.board_id}/columns`;
        const { data } = await this.endpoint.get(path, params);
        return data;
    }

    async createColumn(
        request: CreateColumnRequest,
        params?: Params
    ): Promise<io.Column> {
        const path = `/boards/${request.board_id}/columns`;
        const payload = {
            name: request.name,
            type: request.type,
            origin: request.origin,
            capacity: request.capacity,
        };
        const { data } = await this.endpoint.post(path, payload, params);
        return data;
    }

    async archiveColumn(
        request: ArchiveColumnRequest,
        params?: Params
    ): Promise<io.Column> {
        const path = `/columns/${request.column_id}/archive`;
        const { data } = await this.endpoint.put(path, params);
        return data;
    }

    async unarchiveColumn(
        request: ArchiveColumnRequest,
        params?: Params
    ): Promise<io.Column> {
        const path = `/columns/${request.column_id}/unarchive`;
        const { data } = await this.endpoint.put(path, params);
        return data;
    }

    async updateColumn(
        request: UpdateColumnRequest,
        params?: Params
    ): Promise<io.Column> {
        const path = `/columns/${request.column_id}`;
        const payload = {
            name: request.name,
            type: request.type,
            origin: request.origin,
            capacity: request.capacity,
        };
        const { data } = await this.endpoint.patch(path, payload, params);
        return data;
    }

    async moveColumn(
        request: MoveColumnRequest,
        params?: Params
    ): Promise<io.Column> {
        const path = `/columns/${request.column_id}/move`;
        const payload = {
            position: request.position,
        };
        const { data } = await this.endpoint.put(path, payload, params);
        return data;
    }

    async deleteColumn(
        request: DeleteColumnRequest,
        params?: Params
    ): Promise<any> {
        const path = `/columns/${request.column_id}`;
        const { data } = await this.endpoint.delete(path, params);
        return data;
    }
}
