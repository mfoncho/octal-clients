import { io, Page } from "../types";
import BaseClient, { Params } from "../base";

export interface CreateRecordTemplateRequest {
    catalog_id: string;
    params: {
        name: string;
        description: string;
        fields: { name: string; type: string }[];
    };
}

export interface DeleteRecordTemplateRequest {
    catalog_id: string;
    template_id: string;
}

export interface CreateTrackerRequest {
    entity_id: string;
    params: { event: string };
}

export interface CompleteRecordRequest {
    record_id: string;
    catalog_id: string;
}

export interface UncompleteRecordRequest {
    record_id: string;
    catalog_id: string;
}
export interface MoveRecordRequest {
    record_id: string;
    index?: number;
    collection_id: string;
    catalog_id: string;
}

export interface DeleteRecordRequest {
    record_id: string;
    catalog_id: string;
}

export interface CreateRecordRequest {
    params: {
        name: string;
    };
    catalog_id: string;
    collection_id: string;
    template_id?: string;
}

export interface FetchRecordsRequest {
    catalog_id: string;
    collection_id?: string;
}

export interface ArchiveRecordRequest {
    record_id: string;
    catalog_id: string;
}

export interface UnarchiveRecordRequest {
    record_id: string;
    collection_id: string;
    catalog_id: string;
}

export interface UpdateRecordRequest {
    params: {
        name?: string;
    };
    record_id: string;
    catalog_id: string;
}

export interface FetchArchivedRecordsRequest {
    catalog_id: string;
}

export interface GetRecordRequest {
    record_id: string;
}

export default class RecordClient extends BaseClient {
    async fetchArchivedRecords(
        request: FetchArchivedRecordsRequest,
        params?: Params
    ): Promise<Page<io.Record>> {
        const path = `/catalogs/${request.catalog_id}/archive`;
        const { data } = await this.endpoint.get(path, params);
        return data;
    }

    async fetchRecords(
        request: FetchRecordsRequest,
        params?: Params
    ): Promise<io.Record[]> {
        let url: string;
        if (request.collection_id != null) {
            url = `/catalogs/${request.catalog_id}/collections/${request.collection_id}/records`;
        } else {
            url = `/catalogs/${request.catalog_id}/records`;
        }
        const { data } = await this.endpoint.get(url, params);
        return data;
    }

    async createRecord(
        request: CreateRecordRequest,
        params?: Params
    ): Promise<io.Record> {
        const payload = {
            ...request.params,
            template_id: request.template_id,
        };
        const url = `/catalogs/${request.catalog_id}/collections/${request.collection_id}/records`;
        const { data } = await this.endpoint.post(url, payload, params);
        return data;
    }

    async archiveRecord(
        request: ArchiveRecordRequest,
        params?: Params
    ): Promise<io.Record> {
        const url = `/catalogs/${request.catalog_id}/records/${request.record_id}/archive`;
        const { data } = await this.endpoint.put(url, params);
        return data;
    }

    async unarchiveRecord(request: UnarchiveRecordRequest, params?: Params) {
        return await this.moveRecord(request, params);
    }

    async moveRecord(
        request: MoveRecordRequest,
        params?: Params
    ): Promise<io.Record> {
        const payload = {
            index: request.index,
        };
        const path = `/catalogs/${request.catalog_id}/records/${request.record_id}/move/${request.collection_id}`;
        const { data } = await this.endpoint.put(path, payload, params);
        return data;
    }

    async getRecord(request: GetRecordRequest, params?: Params): Promise<io.Record> {
        const path = `/records/${request.record_id}`;
        const { data } = await this.endpoint.get(path, params);
        return data;
    }

    async completeRecord(
        request: CompleteRecordRequest,
        params?: Params
    ): Promise<io.Record> {
        const path = `/records/${request.record_id}/complete`;
        const { data } = await this.endpoint.put(path, params);
        return data;
    }

    async deleteRecord(
        request: DeleteRecordRequest,
        params?: Params
    ): Promise<Partial<io.Record>> {
        const url = `/records/${request.record_id}`;
        const { data } = await this.endpoint.delete(url, params);
        return data;
    }

    async uncompleteRecord(
        request: UncompleteRecordRequest,
        params?: Params
    ): Promise<io.Record> {
        const path = `/records/${request.record_id}/uncomplete`;
        const { data } = await this.endpoint.put(path, params);
        return data;
    }

    async updateRecord(
        request: UpdateRecordRequest,
        params?: Params
    ): Promise<io.Record> {
        const path = `/records/${request.record_id}`;
        const { data } = await this.endpoint.patch(
            path,
            request.params,
            params
        );
        return data;
    }

    async trackRecord(
        request: CreateTrackerRequest,
        params?: Params
    ): Promise<any> {
        const path = `/records/${request.entity_id}/trackers`;
        const { data } = await this.endpoint.put(path, request.params, params);
        return data;
    }

    async untrackRecord(
        request: CreateTrackerRequest,
        params?: Params
    ): Promise<any> {
        const path = `/records/${request.entity_id}/trackers/${request.params.event}`;
        const { data } = await this.endpoint.delete(path, params);
        return data;
    }

    async createRecordTemplate(
        request: CreateRecordTemplateRequest,
        params?: Params
    ): Promise<io.RecordTemplate> {
        const path = `/catalogs/${request.catalog_id}/templates`;
        const { data } = await this.endpoint.post(path, request.params, params);
        return data;
    }

    async deleteRecordTemplate(
        request: DeleteRecordTemplateRequest,
        params?: Params
    ): Promise<any> {
        const path = `/catalogs/${request.catalog_id}/templates/${request.template_id}`;
        const { data } = await this.endpoint.delete(path, params);
        return data;
    }
}
