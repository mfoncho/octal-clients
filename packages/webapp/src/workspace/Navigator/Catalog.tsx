import React from "react";
import clx from "classnames";
import { Link, generatePath, useParams } from "react-router-dom";
import { Text } from "@colab/ui";
import paths from "src/paths/workspace";
import * as Icons from "@colab/icons";
import { useCatalog } from "@colab/store";

interface ICatalog {
    id: string;
}

export default React.memo<ICatalog>(({ id }) => {
    const catalog = useCatalog(id);

    const params = useParams<{ catalog_id: string }>();

    const path = generatePath(paths.catalog, {
        space_id: catalog?.space_id,
        catalog_id: catalog?.id,
    });

    const selected = params.catalog_id == id;

    if (catalog.is_archived && !selected) {
        return <React.Fragment />;
    }
    return (
        <Link
            to={path}
            className={clx(
                "flex px-2 py-1 flex-row items-center mx-4 rounded-lg",
                selected
                    ? "bg-primary-500 text-white"
                    : "text-gray-700 dark:text-primary-100 hover:text-white hover:bg-primary-500 dark:hover:bg-primary-800"
            )}>
            <div className="px-2">
                <Icons.Board className="w-5 h-5" />
            </div>
            <span className="pl-1 font-semibold text-sm flex-inline flex-grow overflow-x-hidden">
                <Text>{catalog!.name}</Text>
            </span>
        </Link>
    );
});
