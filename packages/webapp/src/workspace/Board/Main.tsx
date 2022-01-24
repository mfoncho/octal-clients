import React from "react";
import Board from "./Board";
import Header from "./Header";
import Drawer from "./Drawer";
import CardDialog from "@workspace/CardDialog";
import { useCard } from "@octal/store";
import { useParams, useHistory } from "react-router-dom";

const Dialog = React.memo<{ id: string }>((props) => {
    const history = useHistory();
    const card = useCard(props.id);

    function handleCloseDialog() {
        if (history.length > 0) {
            history.goBack();
        } else {
            console.log("Oops where to?");
        }
    }

    if (card) {
        return (
            <CardDialog
                open={card.id == props.id}
                id={props.id}
                onClose={handleCloseDialog}
            />
        );
    }
    return <></>;
});

export default function Main() {
    const params = useParams<{ board_id: string; card_id?: string }>();
    return (
        <div className="flex flex-row flex-grow overflow-hidden">
            <div className="flex flex-col flex-1 overflow-hidden">
                <Header />
                <Board />
            </div>
            <Drawer id={params.board_id} />
            {params.card_id && <Dialog id={params.card_id} />}
        </div>
    );
}
