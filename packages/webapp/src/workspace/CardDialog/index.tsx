import React, { useState, useCallback, useEffect } from "react";
import { Dialog } from "@octal/ui";
import PerfectScrollbar from "react-perfect-scrollbar";
import Drawer from "./Drawer";
import Header from "./Header";
import Fields from "./Fields";
import { useDrawer } from "./hooks";
import ActionsField from "./ActionsField";
import { Context } from "@workspace/Board/Card";
import { useAuthId, useCard } from "@octal/store";
import { useScreen } from "@octal/ui";
import { CardRecord } from "@octal/store";

export * from "./hooks";

interface ICard {
    id: string;
    open: boolean;
    onClose: (e: any) => void;
}

interface IPreCard {
    id: string;
    open: boolean;
    onClose: (e: any, reason: string) => void;
}

interface ICardDialog {
    open: boolean;
    card: CardRecord;
    onClose: (e: any, reason: string) => void;
}

export const CardDialog = React.memo<ICardDialog>(({ card, onClose, open }) => {
    const screen = useScreen();

    const [, drawerActions] = useDrawer(card.id);

    let editable = card.user_id == useAuthId();

    const archived = Boolean(card.archived_at);

    editable = editable && !archived;

    const handleCloseDialog = useCallback(() => {
        onClose({}, "closed dialog");
    }, [card.id]);

    useEffect(() => {
        // Show the card thread on
        // bigger screen by default
        if (card.id && card.thread_id && (screen.tablet || screen.desktop)) {
            drawerActions.open({
                id: card.id,
                type: "thread",
                thread_id: card.thread_id,
            });
        }
    }, [card.id, screen.tablet, screen.desktop]);

    useEffect(() => {
        if (card.id) {
            return () => {
                // Close card drawer on unmount
                drawerActions.close({ type: "", id: "" });
            };
        }
    }, [card.id]);

    return (
        <Dialog.Base
            open={open}
            onClose={onClose}
            maxWidth="lg"
            fullWidth={true}
            className="h-5/6"
            fullScreen={screen.mobile}>
            <Header card={card} onClose={handleCloseDialog} />

            <div className="flex flex-row flex-grow overflow-hidden">
                <div className="flex flex-1 flex-col pb-8">
                    <PerfectScrollbar className="flex px-4 sm:px-8 flex-grow flex-col">
                        <ActionsField card={card} onClose={handleCloseDialog} />
                        <Fields key={card.id} card={card} />
                    </PerfectScrollbar>
                </div>
                <Drawer id={card.id} />
            </div>
        </Dialog.Base>
    );
});

const CardLoader = React.memo<IPreCard>((props: IPreCard) => {
    const card = useCard(props.id);
    if (card) {
        return (
            <Context card={card}>
                <CardDialog
                    open={props.open}
                    card={card}
                    onClose={props.onClose}
                />
            </Context>
        );
    }
    return <div />;
});

export default React.memo<ICard>(({ id, onClose, ...props }) => {
    const [open, setOpen] = useState(props.open);

    const handleClose = useCallback(
        (e: any) => {
            setOpen(false);
            // Close after animation timeout
            setTimeout(() => onClose(e), 200);
        },
        [id]
    );

    useEffect(() => {
        if (props.open === false && open) {
            handleClose({});
        } else if (props.open && open === false) {
            setOpen(true);
        }
    }, [props.open]);

    if (props.open || open) {
        return (
            <CardLoader
                id={id}
                open={props.open && open}
                onClose={handleClose}
            />
        );
    } else {
        return <React.Fragment />;
    }
});
