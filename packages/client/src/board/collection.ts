import { io } from "../types";
import BaseClient, { Params } from "../base";

export interface ArchiveCollectionRequest {
    board_id: string;
    collection_id: string;
}

export interface CreateCollectionRequest {
    name: string;
    type: "stack" | "queue";
    origin: boolean;
    capacity: number;
    board_id: string;
}

export interface UpdateCollectionRequest {
    name?: string;
    type?: "stack" | "queue";
    origin?: boolean;
    capacity?: number;
    collection_id: string;
    board_id?: string;
}

export interface MoveCollectionRequest {
    index: number;
    collection_id: string;
    board_id: string;
}

export interface DeleteCollectionRequest {
    collection_id: string;
    board_id: string;
}

export interface FetchCollectionsRequest {
    board_id: string;
}

export interface FetchArchivedCollectionsRequest {
    board_id: string;
}

export default class CollectionClient extends BaseClient {
    async fetchArchivedCollections(
        request: FetchArchivedCollectionsRequest,
        params?: Params
    ): Promise<io.Collection[]> {
        const path = `/boards/${request.board_id}/collections?archived`;
        const { data } = await this.endpoint.get(path, params);
        return data;
    }

    async fetchCollections(
        request: FetchCollectionsRequest,
        params?: Params
    ): Promise<io.Collection[]> {
        const path = `/boards/${request.board_id}/collections`;
        const { data } = await this.endpoint.get(path, params);
        return data;
    }

    async createCollection(
        request: CreateCollectionRequest,
        params?: Params
    ): Promise<io.Collection> {
        const path = `/boards/${request.board_id}/collections`;
        const payload = {
            name: request.name,
            type: request.type,
            origin: request.origin,
            capacity: request.capacity,
        };
        const { data } = await this.endpoint.post(path, payload, params);
        return data;
    }

    async archiveCollection(
        request: ArchiveCollectionRequest,
        params?: Params
    ): Promise<io.Collection> {
        const path = `/collections/${request.collection_id}/archive`;
        const { data } = await this.endpoint.put(path, params);
        return data;
    }

    async unarchiveCollection(
        request: ArchiveCollectionRequest,
        params?: Params
    ): Promise<io.Collection> {
        const path = `/collections/${request.collection_id}/unarchive`;
        const { data } = await this.endpoint.put(path, params);
        return data;
    }

    async updateCollection(
        request: UpdateCollectionRequest,
        params?: Params
    ): Promise<io.Collection> {
        const path = `/collections/${request.collection_id}`;
        const payload = {
            name: request.name,
            type: request.type,
            origin: request.origin,
            capacity: request.capacity,
        };
        const { data } = await this.endpoint.patch(path, payload, params);
        return data;
    }

    async moveCollection(
        request: MoveCollectionRequest,
        params?: Params
    ): Promise<io.Collection> {
        const path = `/collections/${request.collection_id}/move`;
        const payload = {
            index: request.index,
        };
        const { data } = await this.endpoint.put(path, payload, params);
        return data;
    }

    async deleteCollection(
        request: DeleteCollectionRequest,
        params?: Params
    ): Promise<any> {
        const path = `/collections/${request.collection_id}`;
        const { data } = await this.endpoint.delete(path, params);
        return data;
    }
}
