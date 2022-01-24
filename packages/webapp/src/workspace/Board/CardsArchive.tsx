import React, { useState, useEffect } from "react";
import * as BoardAction from "@octal/store/lib/actions/board";
import { useDispatch } from "react-redux";
import Client from "@octal/client";
import { io } from "@octal/client";
import BoardCard from "./Card";
import { useColumnCards } from "@octal/store";
import { CardRecord } from "@octal/store/lib/records";

interface ICardsArchive {
    board: { id: string };
}

const Card = React.memo<{ card: CardRecord }>(({ card }) => {
    return <BoardCard card={card} />;
});

export default function CardsArchive({ board }: ICardsArchive) {
    const dispatch = useDispatch();

    const [source, setSource] = useState<io.Card[]>([]);

    let cards = useColumnCards(board.id);

    useEffect(() => {
        Client.fetchArchivedCards({ board_id: board.id })
            .then((data) => {
                setSource(data);
            })
            .catch((e) => e);
    }, []);

    useEffect(() => {
        if (source.length > 0) {
            const action = BoardAction.storeCards(source);
            dispatch(action);
        }
    }, [source]);

    return (
        <div className="flex-1 flex flex-col overflow-x-hidden overflow-y-auto px-1">
            {cards
                .map((card: CardRecord) => (
                    <div key={card.id} className="flex flex-col p-1">
                        <Card card={card} />
                    </div>
                ))
                .toList()}
        </div>
    );
}
