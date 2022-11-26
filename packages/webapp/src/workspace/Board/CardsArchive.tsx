import React, { useState, useEffect } from "react";
import { List } from "immutable";
import BoardCard from "./Card/Card";
import { useNavigator } from "src/hooks";
import { useCard } from "@colab/store";
import client, { io, Page } from "@colab/client";
import Pagination from "@mui/material/Pagination";

interface ICardsArchive {
    board: { id: string };
}

interface IArchivedCard {
    card: io.Card;
    onClick: () => void;
}

const Card = React.memo<IArchivedCard>(({ card, onClick }) => {
    const scard = useCard(card.id);
    if (scard && scard.id === card.id && !scard.archived) {
        return <div />;
    }
    const labels = card.fields
        .filter((field) => field.type === "label")
        .map((field) => field.values)
        .flat()
        .reduce((acc, value: any) => {
            acc[value.label.id] = value.label;
            return acc;
        }, {} as { [key: string]: any });

    const checklists = card.fields
        .filter((field) => field.type === "checklist")
        .map((field) => field.name);

    const users = card.fields
        .filter((field) => field.type === "user")
        .map((field) => field.values)
        .flat()
        .reduce((acc, value: any) => {
            acc[value.user.id] = value.user;
            return acc;
        }, {} as { [key: string]: any });

    return (
        <div key={card.id} onClick={onClick}>
            <BoardCard
                name={card.name}
                labels={List(Object.values(labels))}
                users={List<string>(Object.values(users))}
                checklists={List(checklists)}
                complete={card.complete}
            />
        </div>
    );
});

const defaultPage: Page<io.Card> = {
    entries: [],
    page_size: 0,
    page_number: 0,
    total_pages: 0,
    total_entries: 0,
};

export default function CardsArchive({ board }: ICardsArchive) {
    const nav = useNavigator();
    const [page, setPage] = useState<number>(1);
    const [results, setResults] = useState<Page<io.Card>>(defaultPage);
    function fetchPageCards(page: number) {
        client
            .fetchArchivedCards({ board_id: board.id }, { params: { page } })
            .then(setResults);
    }

    function handleOpenCard(card: io.Card) {
        nav.openCard(card);
    }

    useEffect(() => {
        if (page !== results.page_number) {
            fetchPageCards(page);
        }
    }, [page, results.page_number]);

    return (
        <div className="flex-1 flex flex-col overflow-hidden">
            <div className="flex border-b flex-none border-gray-200 flex-row items-center h-14 sm:h-20 bg-primary-50 px-4 space-x-2">
                <span className="font-black text-md text-gray-700">
                    Archive
                </span>
            </div>
            <div className="flex-1 flex flex-col overflow-x-hidden overflow-y-auto px-1 space-y-2 pb-16">
                {results.entries.map((card: io.Card) => (
                    <div key={card.id} className="flex flex-col p-1">
                        <Card
                            key={card.id}
                            card={card}
                            onClick={() => handleOpenCard(card)}
                        />
                    </div>
                ))}
            </div>
            <div className="flex flex-row justify-center">
                {results.total_entries > 0 && (
                    <Pagination
                        variant="outlined"
                        page={results.page_number}
                        count={results.total_pages}
                        siblingCount={1}
                        boundaryCount={2}
                        onChange={(_e, page) => setPage(page)}
                    />
                )}
            </div>
        </div>
    );
}
