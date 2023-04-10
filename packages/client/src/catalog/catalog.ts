import { io } from "../types";
import BaseClient, { Params } from "../base";
import * as Requests from "./types";

export default class CatalogClient extends BaseClient {
    async fetchCatalogs(request: string, params?: Params): Promise<io.Catalog[]> {
        const path = `/spaces/${request}/catalogs`;
        let { data } = await this.endpoint.get(path, params);
        return data;
    }

    async createCatalog(
        request: Requests.CreateCatalogRequest,
        params?: Params
    ): Promise<io.Catalog> {
        const path = `/spaces/${request.space_id}/catalogs`;
        let { data } = await this.endpoint.post(path, request.params, params);
        return data;
    }

    async archiveCatalog(
        request: Requests.CatalogRequest,
        params?: Params
    ): Promise<io.Catalog> {
        const path = `/catalogs/${request.catalog_id}/archive`;
        let { data } = await this.endpoint.post(path, {}, params);
        return data;
    }

    async unarchiveCatalog(
        request: Requests.CatalogRequest,
        params?: Params
    ): Promise<io.Catalog> {
        const path = `/catalogs/${request.catalog_id}/unarchive`;
        let { data } = await this.endpoint.post(path, {}, params);
        return data;
    }

    async updateCatalog(
        request: Requests.UpdateCatalogRequest,
        params?: Params
    ): Promise<io.Catalog> {
        const path = `/catalogs/${request.catalog_id}`;
        const { data } = await this.endpoint.patch(
            path,
            request.params,
            params
        );
        return data;
    }
    async deleteCatalog(
        request: Requests.CatalogRequest,
        params?: Params
    ): Promise<any> {
        const path = `/catalogs/${request.catalog_id}`;
        const { data } = await this.endpoint.delete(path, params);
        return data;
    }
}
