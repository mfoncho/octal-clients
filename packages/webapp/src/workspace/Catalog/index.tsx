import React, { useEffect, useState } from "react";
import Main from "./Main";
import Catalog from "./Context";
import { useDispatch } from "react-redux";
import * as CatalogAction from "@colab/store/lib/actions/catalog";
import { useCatalog, useCatalogLoaded } from "@colab/store";
import { useParams } from "react-router-dom";
import { useNavigator } from "src/hooks";
export * from "./hooks";

export default React.memo(() => {
    const nav = useNavigator();
    const [init, setInit] = useState<boolean>(false);
    const [loading, setLoading] = React.useState<string[]>([]);
    const params = useParams<{ space_id: string; catalog_id: string }>();
    const dispatch = useDispatch();
    const catalog = useCatalog(params.catalog_id!);
    const loaded = useCatalogLoaded(params.catalog_id!);

    useEffect(() => {
        if (Boolean(catalog.id)) {
            setInit(true);
        }
        if (init && catalog.id !== params.catalog_id) {
            return nav.openSpace({ id: params.space_id! });
        }
    }, [catalog.id, init]);

    useEffect(() => {
        if (!init) {
            return;
        }
        if (init && catalog.id !== params.catalog_id) {
            return;
        }
        if (loaded.includes("collections")) {
            if (loading.includes("collections")) {
                setLoading((loading) =>
                    loading.filter((col) => col !== "collections")
                );
            }
        } else if (!loading.includes("collections")) {
            const action = CatalogAction.loadCatalogCollections(params as any);
            dispatch(action);
            setLoading((loading) => loading.concat(["collections"]));
        }

        if (loaded.includes("records")) {
            if (loading.includes("records")) {
                setLoading((loading) =>
                    loading.filter((col) => col !== "records")
                );
            }
        } else if (!loading.includes("records")) {
            const action = CatalogAction.loadCatalogRecords(params as any);
            dispatch(action);
            setLoading((loading) => loading.concat(["records"]));
        }
    }, [init, loaded]);

    if (catalog) {
        return (
            <Catalog.Provider value={catalog!}>
                <Main />
            </Catalog.Provider>
        );
    } else {
        return <div className="flex flex-1" />;
    }
});
