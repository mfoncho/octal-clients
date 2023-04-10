export interface CreateCatalogRequest {
    space_id: string;
    params: {
        name: string;
    };
}

export interface UpdateCatalogRequest {
    catalog_id: string;
    space_id: string;
    params: {
        name?: string;
    };
}

export interface CatalogRequest {
    catalog_id: string;
    space_id: string;
}
