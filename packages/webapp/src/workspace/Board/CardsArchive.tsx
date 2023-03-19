import React, { useState, useEffect } from "react";
import { List } from "immutable";
import * as Icons from "@colab/icons";
import BoardCard from "./Card/Card";
import client, { io, Page } from "@colab/client";
import Pagination from "@mui/material/Pagination";
import { useDebouncedEffect } from "@colab/hooks";
import { useNavigator, useInput } from "src/hooks";
import { useCard, useSpaceChannel } from "@colab/store";

interface ICardsArchive {
    space: { id: string };
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
        <div key={card.id} onClick={onClick} role="button">
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

export default function CardsArchive({ space }: ICardsArchive) {
    const nav = useNavigator();
    const input = useInput("");
    const channel = useSpaceChannel(space.id);
    const [name, setName] = useState(input.value);
    const [page, setPage] = useState<number>(1);
    const [results, setResults] = useState<Page<io.Card>>(defaultPage);
    function fetchPageCards(page: number, name: string) {
        const params: any = { page };
        if (Boolean(name.trim())) params.name = name.trim();
        client
            .fetchArchivedCards({ space_id: space.id }, { params })
            .then(setResults);
    }

    function handleOpenCard(card: io.Card) {
        nav.openCard(card);
    }

    useEffect(() => {
        if (channel) {
            let ref = channel.on("card.deleted", ({ id }: any) => {
                setResults((results) => ({
                    ...results,
                    entries: results.entries.filter((card) => card.id !== id),
                }));
            });
            return () => {
                channel.off(ref);
            };
        }
    }, [channel]);

    useDebouncedEffect(
        () => {
            setName(input.value);
        },
        700,
        [input.value]
    );

    useEffect(() => {
        if (page !== results.page_number) {
            fetchPageCards(page, name);
        } else if (page !== 1) {
            setPage(1);
        } else {
            fetchPageCards(page, name);
        }
    }, [page, name]);

    return (
        <div className="flex-1 flex flex-col overflow-hidden">
            <div className="flex flex-col border-b flex-none border-gray-200 flex-row h-14 sm:h-20 bg-primary-50 px-4 justify-center">
                <div className="relative hidden sm:flex items-center">
                    <input
                        {...input.props}
                        placeholder="Search archive"
                        className="pl-8 bg-white font-semibold outline-none placeholder:text-gray-400 text-gray-700 focus:ring-primary-500 border-gray-400 ring rounded py-1 px-2 focus:shadow"
                    />
                    <div className="px-2 absolute">
                        <Icons.Archive className="text-gray-500" />
                    </div>
                </div>
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
            <div className="flex flex-row justify-center py-2">
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
