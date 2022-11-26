import React from "react";
import Board from "./Board";
import Header from "./Header";
import Filters from "./Filters";
import Drawer from "./Drawer";
import CardDialog from "@workspace/CardDialog";
import { useParams, useNavigate } from "react-router-dom";

const Dialog = React.memo<{ id: string }>((props) => {
    const navigate = useNavigate();
    const params =
        useParams<{ board_id: string; space_id: string; card_id: string }>();

    function handleCloseDialog() {
        if (history.length > 0) {
            navigate(`/spaces/${params.space_id}/boards/${params.board_id}`);
        }
    }

    return (
        <CardDialog
            id={props.id}
            onClose={handleCloseDialog}
            open={Boolean(params.card_id)}
        />
    );
});

export default function Main() {
    const params = useParams<{ board_id: string; card_id?: string }>();
    return (
        <div className="flex flex-row flex-grow overflow-hidden">
            <div className="flex flex-col flex-1 overflow-hidden">
                <Header />
                <Filters />
                <Board />
            </div>
            <Drawer id={params.board_id!} />
            {params.card_id && <Dialog id={params.card_id!} />}
        </div>
    );
}
