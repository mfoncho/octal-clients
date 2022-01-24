import { io } from "../types";
import BaseClient, { Params } from "../base";

interface DeleteCardFieldValueRequest {
    card_id: string;
    field_id: string;
    value_id: string;
}

interface UnassignChecklistRequest {
    card_id: string;
    field_id: string;
    user_id: string;
}

interface AssignChecklistRequest {
    card_id: string;
    field_id: string;
    user_id: string;
}

interface MoveCardFieldRequest {
    card_id: string;
    field_id: string;
    params: {
        position: number;
    };
}

interface CreateCardFieldValueRequest<T = { [key: string]: any }> {
    card_id: string;
    field_id: string;
    params: T;
}

interface UpdateCardFieldValueRequest<T = { [key: string]: any }> {
    card_id: string;
    field_id: string;
    value_id: string;
    params: T;
}

interface CreateCardFieldRequest {
    card_id: string;
    params: {
        type: string;
        name: string;
        metadata?: { [key: string]: any };
    };
}

interface UpdateCardFieldRequest {
    card_id: string;
    field_id: string;
    params: {
        name?: string;
        meta?: any;
    };
}

interface SetCardFieldValueRequest {
    field_id: string;
    params: {
        value: any;
    };
}

interface DeleteCardFieldRequest {
    card_id: string;
    field_id: string;
}

export default class CardFieldClient extends BaseClient {
    async createCardField(
        request: CreateCardFieldRequest,
        params?: Params
    ): Promise<io.CardField> {
        const path = `/cards/${request.card_id}/fields`;
        const { data } = await this.endpoint.post(path, request.params, params);
        return data;
    }

    async moveCardField(
        request: MoveCardFieldRequest,
        params?: Params
    ): Promise<io.CardField> {
        const path = `/cards/${request.card_id}/fields/${request.field_id}/move`;
        const { data } = await this.endpoint.put(path, request.params, params);
        return data;
    }

    async updateCardField(
        request: UpdateCardFieldRequest,
        params?: Params
    ): Promise<io.CardField> {
        const path = `/fields/${request.field_id}`;
        const { data } = await this.endpoint.patch(
            path,
            request.params,
            params
        );
        return data;
    }

    async setCardFieldValue(
        request: SetCardFieldValueRequest,
        params?: Params
    ): Promise<io.CardField> {
        const path = `/fields/${request.field_id}`;
        const { data } = await this.endpoint.post(path, request.params, params);
        return data;
    }

    async deleteCardField(
        request: DeleteCardFieldRequest,
        params?: Params
    ): Promise<io.CardField> {
        const path = `/fields/${request.field_id}`;
        const { data } = await this.endpoint.delete(path, params);
        return data;
    }

    async createCardFieldValue(
        request: CreateCardFieldValueRequest,
        params?: Params
    ): Promise<any> {
        const path = `/fields/${request.field_id}/values`;
        const { data } = await this.endpoint.post(path, request.params, params);
        return data;
    }

    async updateCardFieldValue(
        request: UpdateCardFieldValueRequest,
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
    ): Promise<io.CardField> {
        const path = `/checklists/${request.field_id}/users/${request.user_id}`;
        const { data } = await this.endpoint.put(path, {}, params);
        return data;
    }

    async unassignChecklist(
        request: UnassignChecklistRequest,
        params?: Params
    ): Promise<io.CardField> {
        const path = `/checklists/${request.field_id}/users/${request.user_id}`;
        const { data } = await this.endpoint.delete(path, params);
        return data;
    }

    async deleteCardFieldValue(
        request: DeleteCardFieldValueRequest,
        params?: Params
    ): Promise<any> {
        const path = `/fields/${request.field_id}/values/${request.value_id}`;
        const { data } = await this.endpoint.delete(path, params);
        return data;
    }
}
