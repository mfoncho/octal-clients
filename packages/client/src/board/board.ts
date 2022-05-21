import { io } from "../types";
import BaseClient, { Params } from "../base";
import * as Requests from "./types";

export default class BoardClient extends BaseClient {
    async fetchBoards(request: string, params?: Params): Promise<io.Board[]> {
        const path = `/spaces/${request}/boards`;
        let { data } = await this.endpoint.get(path, params);
        return data;
    }

    async createBoard(
        request: Requests.CreateBoardRequest,
        params?: Params
    ): Promise<io.Board> {
        const path = `/spaces/${request.space_id}/boards`;
        let { data } = await this.endpoint.post(path, request.params, params);
        return data;
    }

    async archiveBoard(request: string, params?: Params): Promise<io.Board> {
        const path = `/boards/${request}`;
        let { data } = await this.endpoint.post(path, {}, params);
        return data;
    }

    async unarchiveBoard(request: string, params?: Params): Promise<io.Board> {
        const path = `/boards/${request}`;
        let { data } = await this.endpoint.post(path, {}, params);
        return data;
    }

    async updateBoard(
        request: Requests.UpdateBoardRequest,
        params?: Params
    ): Promise<io.Board> {
        const path = `/boards/${request.board_id}`;
        const { data } = await this.endpoint.patch(
            path,
            request.params,
            params
        );
        return data;
    }
    async deleteBoard(request: string, params?: Params): Promise<any> {
        const path = `/boards/${request}`;
        const { data } = await this.endpoint.delete(path, params);
        return data;
    }
}
