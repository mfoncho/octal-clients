import React from "react";
import Catalog from "./Catalog";
import Header from "./Header";
import Filters from "./Filters";
import Drawer from "./Drawer";
import RecordDialog from "@workspace/RecordDialog";
import { useParams, useNavigate } from "react-router-dom";

const Dialog = React.memo<{ id: string }>((props) => {
    const navigate = useNavigate();
    const params =
        useParams<{
            catalog_id: string;
            space_id: string;
            record_id: string;
        }>();

    function handleCloseDialog() {
        if (history.length > 0) {
            navigate(
                `/spaces/${params.space_id}/catalogs/${params.catalog_id}`
            );
        }
    }

    return (
        <RecordDialog
            id={props.id}
            onClose={handleCloseDialog}
            open={Boolean(params.record_id)}
        />
    );
});

export default function Main() {
    const params = useParams<{ catalog_id: string; record_id?: string }>();
    return (
        <div className="flex flex-row flex-grow overflow-hidden">
            <div className="flex flex-col flex-1 overflow-hidden">
                <Header />
                <Filters />
                <Catalog />
            </div>
            <Drawer id={params.catalog_id!} />
            {params.record_id && <Dialog id={params.record_id!} />}
        </div>
    );
}
