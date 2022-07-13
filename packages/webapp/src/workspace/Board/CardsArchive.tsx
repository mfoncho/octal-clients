import React, { useState, useEffect } from "react";
import { Actions } from "@octal/store";
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

    let cards = useColumnCards(board.id);

    useEffect(() => {
        if (cards.isEmpty()) {
            let action = Actions.Board.loadArchivedCards({
                board_id: board.id,
            });
            dispatch(action);
        }
    }, [cards.isEmpty()]);

    return (
        <div className="flex-1 flex flex-col overflow-hidden">
            <div className="flex border-b flex-none border-gray-200 flex-row items-center h-14 sm:h-20 bg-primary-50 px-4 space-x-2">
                <span className="font-black text-md text-gray-700">
                    Archived Cards
                </span>
            </div>
            <div className="flex-1 flex flex-col overflow-x-hidden overflow-y-auto px-1 space-y-2 pb-16">
                {cards
                    .map((card: CardRecord) => (
                        <div key={card.id} className="flex flex-col p-1">
                            <Card card={card} />
                        </div>
                    ))
                    .toList()}
            </div>
        </div>
    );
}
