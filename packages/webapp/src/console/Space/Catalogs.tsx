import React from "react";
import { io } from "@console/types";
import moment from "moment";
import client from "@console/client";
import { Text } from "@colab/ui";

export interface ICatalogs {
    space: io.Space;
}

export default function Catalogs({ space }: ICatalogs) {
    const [catalogs, setCatalogs] = React.useState<io.Catalog[]>([]);

    React.useEffect(() => {
        if (space) {
            loadCatalogs();
        }
    }, [space.id]);

    async function loadCatalogs() {
        return client
            .fetchSpaceCatalogs({ space_id: space.id })
            .then((data) => setCatalogs(data))
            .catch(() => {});
    }

    function renderTopic(catalog: io.Catalog) {
        return (
            <div
                key={catalog.id}
                className="flex justify-between text-gray-500 flex-row px-4 py-2 items-center hover:bg-primary-50">
                <div className="flex flex-row items-center">
                    <span className="text-gray-800 font-semibold text-base">
                        <Text>{catalog.name}</Text>
                    </span>
                </div>
                <div>
                    <span className="font-semibold text-sm">
                        {moment(catalog.created_at).format("ll")}
                    </span>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col shadow rounded-md bg-white overflow-hidden">
            <div className="py-4 bg-gray-100 flex flex-row justify-between">
                <span className="font-bold px-4 text-gray-800">Catalogs</span>
            </div>
            <div className="flex flex-col divide-y divide-slate-200">
                {catalogs.map(renderTopic)}
            </div>
        </div>
    );
}
