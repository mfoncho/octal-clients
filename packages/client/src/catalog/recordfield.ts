import { io } from "../types";
import BaseClient, { Params } from "../base";

interface DeleteRecordFieldValueRequest {
    record_id: string;
    field_id: string;
    value_id: string;
}

interface UnassignChecklistRequest {
    record_id: string;
    field_id: string;
    user_id: string;
}

interface AssignChecklistRequest {
    record_id: string;
    field_id: string;
    user_id: string;
}

interface MoveRecordFieldRequest {
    record_id: string;
    field_id: string;
    params: {
        index: number;
    };
}

interface CreateRecordFieldValueRequest<T = { [key: string]: any }> {
    record_id: string;
    field_id: string;
    params: T;
}

interface UpdateRecordFieldValueRequest<T = { [key: string]: any }> {
    record_id: string;
    field_id: string;
    value_id: string;
    params: T;
}

interface CreateRecordFieldRequest {
    record_id: string;
    params: {
        type: string;
        name: string;
        metadata?: { [key: string]: any };
    };
}

interface UpdateRecordFieldRequest {
    record_id: string;
    field_id: string;
    params: {
        name?: string;
        meta?: any;
    };
}

interface SetRecordFieldValueRequest {
    field_id: string;
    params: {
        value: any;
    };
}

interface DeleteRecordFieldRequest {
    record_id: string;
    field_id: string;
}

export default class RecordFieldClient extends BaseClient {
    async createRecordField(
        request: CreateRecordFieldRequest,
        params?: Params
    ): Promise<io.RecordField> {
        const path = `/records/${request.record_id}/fields`;
        const { data } = await this.endpoint.post(path, request.params, params);
        return data;
    }

    async moveRecordField(
        request: MoveRecordFieldRequest,
        params?: Params
    ): Promise<io.RecordField> {
        const path = `/records/${request.record_id}/fields/${request.field_id}/move`;
        const { data } = await this.endpoint.put(path, request.params, params);
        return data;
    }

    async updateRecordField(
        request: UpdateRecordFieldRequest,
        params?: Params
    ): Promise<io.RecordField> {
        const path = `/fields/${request.field_id}`;
        const { data } = await this.endpoint.patch(
            path,
            request.params,
            params
        );
        return data;
    }

    async setRecordFieldValue(
        request: SetRecordFieldValueRequest,
        params?: Params
    ): Promise<io.RecordField> {
        const path = `/fields/${request.field_id}`;
        const { data } = await this.endpoint.post(path, request.params, params);
        return data;
    }

    async deleteRecordField(
        request: DeleteRecordFieldRequest,
        params?: Params
    ): Promise<io.RecordField> {
        const path = `/fields/${request.field_id}`;
        const { data } = await this.endpoint.delete(path, params);
        return data;
    }

    async createRecordFieldValue(
        request: CreateRecordFieldValueRequest,
        params?: Params
    ): Promise<any> {
        const path = `/fields/${request.field_id}/values`;
        let findex = Object.values(request.params).findIndex((value) => {
            return value instanceof File;
        });
        if (findex < 0) {
            const { data } = await this.endpoint.post(
                path,
                request.params,
                params
            );
            return data;
        } else {
            let form = Object.keys(request.params).reduce((form, key) => {
                form.append(key, request.params[key]);
                return form;
            }, new FormData());

            const { data } = await this.endpoint.post(path, form, params);
            return data;
        }
    }

    async updateRecordFieldValue(
        request: UpdateRecordFieldValueRequest,
        params?: Params
    ): Promise<any> {
        const path = `/fields/${request.field_id}/values/${request.value_id}`;
        const { data } = await this.endpoint.patch(
            path,
            request.params,
            params
        );
        return data;
    }

    async assignChecklist(
        request: AssignChecklistRequest,
        params?: Params
    ): Promise<io.RecordField> {
        const path = `/fields/${request.field_id}/assign/${request.user_id}`;
        const { data } = await this.endpoint.put(path, {}, params);
        return data;
    }

    async unassignChecklist(
        request: UnassignChecklistRequest,
        params?: Params
    ): Promise<io.RecordField> {
        const path = `/fields/${request.field_id}/assign/${request.user_id}`;
        const { data } = await this.endpoint.delete(path, params);
        return data;
    }

    async deleteRecordFieldValue(
        request: DeleteRecordFieldValueRequest,
        params?: Params
    ): Promise<any> {
        const path = `/fields/${request.field_id}/values/${request.value_id}`;
        const { data } = await this.endpoint.delete(path, params);
        return data;
    }
}
