import { io } from "../types";
import BaseClient, { Params } from "../base";

export interface CreateCardTemplateRequest {
    board_id: string;
    params: {
        name: string;
        fields: { name: string; type: string }[];
    };
}

export interface DeleteCardTemplateRequest {
    board_id: string;
    template_id: string;
}

export interface CreateTrackerRequest {
    entity_id: string;
    params: { event: string };
}

export interface CompleteCardRequest {
    card_id: string;
    board_id: string;
}

export interface UncompleteCardRequest {
    card_id: string;
    board_id: string;
}
export interface MoveCardRequest {
    card_id: string;
    position?: number;
    column_id: string;
    board_id: string;
}

export interface DeleteCardRequest {
    card_id: string;
    board_id: string;
}

export interface CreateCardRequest {
    params: {
        name: string;
    };
    board_id: string;
    column_id: string;
    template_id?: string;
}

export interface FetchCardsRequest {
    board_id: string;
    column_id?: string;
}

export interface ArchiveCardRequest {
    card_id: string;
    board_id: string;
}

export interface UnarchiveCardRequest {
    card_id: string;
    column_id: string;
    board_id: string;
}

export interface UpdateCardRequest {
    params: {
        name?: string;
    };
    card_id: string;
    board_id: string;
}

export interface FetchArchivedCardsRequest {
    board_id: string;
}

export default class CardClient extends BaseClient {
    async fetchArchivedCards(
        request: FetchArchivedCardsRequest,
        params?: Params
    ): Promise<io.Card[]> {
        const path = `/boards/${request.board_id}/cards?archived`;
        const { data } = await this.endpoint.get(path, params);
        return data;
    }

    async fetchCards(
        request: FetchCardsRequest,
        params?: Params
    ): Promise<io.Card[]> {
        let url: string;
        if (request.column_id != null) {
            url = `/boards/${request.board_id}/columns/${request.column_id}/cards`;
        } else {
            url = `/boards/${request.board_id}/cards`;
        }
        const { data } = await this.endpoint.get(url, params);
        return data;
    }

    async createCard(
        request: CreateCardRequest,
        params?: Params
    ): Promise<io.Card> {
        const payload = {
            ...request.params,
            apply: request.template_id,
        };
        const url = `/boards/${request.board_id}/columns/${request.column_id}/cards`;
        const { data } = await this.endpoint.post(url, payload, params);
        return data;
    }

    async archiveCard(
        request: ArchiveCardRequest,
        params?: Params
    ): Promise<io.Card> {
        const url = `/boards/${request.board_id}/cards/${request.card_id}/archive`;
        const { data } = await this.endpoint.put(url, params);
        return data;
    }

    async unarchiveCard(request: UnarchiveCardRequest, params?: Params) {
        return await this.moveCard(request, params);
    }

    async moveCard(
        request: MoveCardRequest,
        params?: Params
    ): Promise<io.Card> {
        const payload = {
            position: request.position,
        };
        const path = `/boards/${request.board_id}/cards/${request.card_id}/move/${request.column_id}`;
        const { data } = await this.endpoint.put(path, payload, params);
        return data;
    }

    async completeCard(
        request: CompleteCardRequest,
        params?: Params
    ): Promise<io.Card> {
        const path = `/cards/${request.card_id}/complete`;
        const { data } = await this.endpoint.put(path, params);
        return data;
    }

    async deleteCard(
        request: DeleteCardRequest,
        params?: Params
    ): Promise<Partial<io.Card>> {
        const url = `/cards/${request.card_id}`;
        const { data } = await this.endpoint.delete(url, params);
        return data;
    }

    async uncompleteCard(
        request: UncompleteCardRequest,
        params?: Params
    ): Promise<io.Card> {
        const path = `/cards/${request.card_id}/uncomplete`;
        const { data } = await this.endpoint.put(path, params);
        return data;
    }

    async updateCard(
        request: UpdateCardRequest,
        params?: Params
    ): Promise<io.Card> {
        const path = `/cards/${request.card_id}`;
        const { data } = await this.endpoint.patch(
            path,
            request.params,
            params
        );
        return data;
    }

    async trackCard(
        request: CreateTrackerRequest,
        params?: Params
    ): Promise<any> {
        const path = `/cards/${request.entity_id}/trackers`;
        const { data } = await this.endpoint.put(path, request.params, params);
        return data;
    }

    async untrackCard(
        request: CreateTrackerRequest,
        params?: Params
    ): Promise<any> {
        const path = `/cards/${request.entity_id}/trackers/${request.params.event}`;
        const { data } = await this.endpoint.delete(path, params);
        return data;
    }

    async createCardTemplate(
        request: CreateCardTemplateRequest,
        params?: Params
    ): Promise<io.CardTemplate> {
        const path = `/boards/${request.board_id}/templates`;
        const { data } = await this.endpoint.post(path, request.params, params);
        return data;
    }

    async deleteCardTemplate(
        request: DeleteCardTemplateRequest,
        params?: Params
    ): Promise<any> {
        const path = `/boards/${request.board_id}/templates/${request.template_id}`;
        const { data } = await this.endpoint.delete(path, params);
        return data;
    }
}
