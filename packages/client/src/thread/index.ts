import { io } from "../types";
import BaseClient, { Params } from "../base";

export interface FetchMessagesRequest {
    thread_id: string;
    params?: {
        after?: string;
        last?: number;
        before?: string;
        first?: number;
    };
}

export interface ReactMessageRequest {
    thread_id: string;
    message_id: string;
    reaction: string;
}

export interface UnreactMessageRequest {
    thread_id: string;
    message_id: string;
    reaction: string;
}

export interface PostMessageRequest {
    content: string;
    attachemnt?: File;
    embeds: any;
    reply_id?: string;
    thread_id: string;
}

export interface DeleteMessageRequest {
    thread_id: string;
    message_id: string;
}

export interface PinMessageRequest {
    thread_id: string;
    message_id: string;
}

export interface UnpinMessageRequest {
    thread_id: string;
    message_id: string;
}

export interface FlagMessageRequest {
    thread_id: string;
    message_id: string;
}

export interface UnflagMessageRequest {
    thread_id: string;
    message_id: string;
}

export interface UpdateMessageRequest {
    message_id: string;
    thread_id: string;
    content: string;
    markdown?: boolean;
}

export interface LoadThreadRequest {
    thread_id: string;
}

export default class ThreadClient extends BaseClient {
    async postMessage(
        request: PostMessageRequest,
        params?: Params
    ): Promise<io.Message> {
        const path = request.reply_id
            ? `/threads/${request.thread_id}/messages/${request.reply_id}/reply`
            : `/threads/${request.thread_id}/messages`;
        const form = new FormData();
        form.append("content", request.content);
        if (request.attachemnt) {
            form.append("attachment", request.attachemnt);
        }
        const { data } = await this.endpoint.post(path, form, params);
        return data;
    }

    async fetchThreads(params?: Params): Promise<io.Thread[]> {
        const path = `/threads`;
        const { data } = await this.endpoint.get(path, params);
        return data;
    }

    async fetchMessages(
        request: FetchMessagesRequest,
        params?: Params
    ): Promise<io.Message[]> {
        const path = `/threads/${request.thread_id}/messages`;
        const { data } = await this.endpoint.get(path, {
            params: request.params,
            ...params,
        });
        return data;
    }

    async loadThread(
        request: LoadThreadRequest,
        params?: Params
    ): Promise<io.Thread> {
        const path = `/threads/${request.thread_id}`;
        const { data } = await this.endpoint.get(path, params);
        return data;
    }

    async pinMessage(
        request: PinMessageRequest,
        params?: Params
    ): Promise<io.Message> {
        const path = `/threads/${request.thread_id}/messages/${request.message_id}/pin`;
        const { data } = await this.endpoint.put(path, params);
        return data;
    }

    async unpinMessage(
        request: UnpinMessageRequest,
        params?: Params
    ): Promise<io.Message> {
        const path = `/threads/${request.thread_id}/messages/${request.message_id}/pin`;
        const { data } = await this.endpoint.delete(path, params);
        return data;
    }

    async flagMessage(
        request: FlagMessageRequest,
        params?: Params
    ): Promise<io.Message> {
        const path = `/threads/${request.thread_id}/messages/${request.message_id}/flag`;
        const { data } = await this.endpoint.put(path, params);
        return data;
    }

    async unflagMessage(
        request: UnflagMessageRequest,
        params?: Params
    ): Promise<io.Message> {
        const path = `/threads/${request.thread_id}/messages/${request.message_id}/flag`;
        const { data } = await this.endpoint.delete(path, params);
        return data;
    }

    async deleteMessage(
        request: DeleteMessageRequest,
        params?: Params
    ): Promise<any> {
        const path = `/threads/${request.thread_id}/messages/${request.message_id}`;
        const { data } = await this.endpoint.delete(path, params);
        return data;
    }

    async updateMessage(
        request: UpdateMessageRequest,
        params?: Params
    ): Promise<io.Message> {
        const path = `/threads/${request.thread_id}/messages/${request.message_id}`;
        const payload = {
            content: request.content,
        };
        const { data } = await this.endpoint.patch(path, payload, params);
        return data;
    }

    reactMessage(
        request: ReactMessageRequest,
        params?: Params
    ): Promise<io.Message> {
        const path = `/threads/${request.thread_id}/messages/${request.message_id}/react/${request.reaction}`;
        return this.endpoint.post(path, {}, params);
    }

    unreactMessage(
        request: UnreactMessageRequest,
        params?: Params
    ): Promise<io.Message> {
        const path = `/threads/${request.thread_id}/messages/${request.message_id}/react/${request.reaction}`;
        return this.endpoint.delete(path, params);
    }
}
