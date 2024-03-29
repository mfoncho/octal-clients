import { io } from "../types";
import BaseClient, { Params } from "../base";

interface ArchiveTopicRequest {
    space_id: string;
    topic_id: string;
}

interface SearchTopicRequest {
    topic_id: string;
    space_id: string;
    params: {
        page?: number;
        query: string;
        users?: string[];
        after?: string;
        before?: string;
    };
}

interface UnarchiveTopicRequest {
    space_id: string;
    topic_id: string;
}

interface FetchSpaceTopicsRequest {
    space_id: string;
}

interface CreateTopicRequest {
    space_id: string;
    name: string;
    type: string;
    subject?: string;
}

interface UpdateTopicRequest {
    space_id: string;
    topic_id: string;
    name: string;
}

interface DeleteTopicRequest {
    topic_id: string;
}

export default class TopicClient extends BaseClient {
    async fetchTopics(request: string, params?: Params): Promise<io.Topic[]> {
        const path = `/spaces/${request}/topics`;
        let { data } = await this.endpoint.get(path, params);
        return data;
    }

    async fetchSpaceTopics(
        request: FetchSpaceTopicsRequest,
        params?: Params
    ): Promise<io.Thread[]> {
        const path = `/spaces/${request.space_id}/topics`;
        const { data } = await this.endpoint.get(path, params);
        return data;
    }

    async createTopic(
        request: CreateTopicRequest,
        params?: Params
    ): Promise<io.Topic> {
        const path = `/spaces/${request.space_id}/topics`;
        const payload = {
            name: request.name,
            type: request.type,
            subject: request.subject,
        };
        const { data } = await this.endpoint.post(path, payload, params);
        return data;
    }

    async updateTopic(
        request: UpdateTopicRequest,
        params?: Params
    ): Promise<io.Topic> {
        const path = `/topics/${request.topic_id}`;
        const payload = {
            name: request.name,
        };
        const { data } = await this.endpoint.patch(path, payload, params);
        return data;
    }

    async archiveTopic(
        request: ArchiveTopicRequest,
        params?: Params
    ): Promise<io.Topic> {
        const path = `/topics/${request.topic_id}/archive`;
        const { data } = await this.endpoint.post(path, {}, params);
        return data;
    }

    async unarchiveTopic(
        request: UnarchiveTopicRequest,
        params?: Params
    ): Promise<io.Topic> {
        const path = `/topics/${request.topic_id}/unarchive`;
        const { data } = await this.endpoint.post(path, {}, params);
        return data;
    }

    async searchTopic(
        request: SearchTopicRequest,
        params?: Params
    ): Promise<io.TopicSearchResult> {
        const path = `/topics/${request.topic_id}/search`;
        const rparams: { [key: string]: any } = {};
        for (let key of Object.keys(request.params)) {
            //@ts-ignore
            const val = request.params[key];
            if (val) {
                if (Array.isArray(val) && val.length == 0) continue;
                if (typeof val === "string" && val.trim().length === 0)
                    continue;
                rparams[key] = val;
            }
        }
        const { data } = await this.endpoint.get(
            path,
            { params: rparams },
            params
        );
        return data;
    }

    async deleteTopic(
        request: DeleteTopicRequest,
        params?: Params
    ): Promise<any> {
        const path = `/topics/${request.topic_id}`;
        const { data } = await this.endpoint.delete(path, params);
        return data;
    }
}
