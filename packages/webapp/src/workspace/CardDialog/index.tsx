import React, { useState, useCallback, useEffect } from "react";
import { Dialog } from "@colab/ui";
import PerfectScrollbar from "react-perfect-scrollbar";
import Drawer from "./Drawer";
import Header from "./Header";
import Fields from "./Fields";
import { useDispatch } from "react-redux";
import { useDrawer } from "./hooks";
import ActionsField from "./ActionsField";
import { Context } from "@workspace/Board/Card";
import { useAuthId, useCard, Actions } from "@colab/store";
import { useScreen } from "src/hooks";
import { CardRecord } from "@colab/store";

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

interface ILoadingDialog {
    open: boolean;
    onClose: (e: any, reason: string) => void;
}

const scrollerOptions = {
    suppressScrollX: true,
    suppressScrollY: false,
};

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
            maxWidth="md"
            fullWidth={true}
            className="h-5/6"
            fullScreen={screen.mobile}>
            <Header card={card} onClose={handleCloseDialog} />

            <div className="flex flex-row flex-grow overflow-hidden">
                <div className="flex flex-1 flex-col pb-8">
                    <PerfectScrollbar
                        options={scrollerOptions}
                        className="flex px-4 sm:px-8 flex-grow flex-col">
                        <ActionsField card={card} onClose={handleCloseDialog} />
                        <Fields key={card.id} card={card} />
                    </PerfectScrollbar>
                </div>
                <Drawer id={card.id} />
            </div>
        </Dialog.Base>
    );
});

function LoadDialog({ open, onClose }: ILoadingDialog) {
    const screen = useScreen();
    return (
        <Dialog
            title=""
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullHeight={true}
            fullWidth={true}
            fullScreen={screen.mobile}></Dialog>
    );
}

const CardLoader = React.memo<IPreCard>((props: IPreCard) => {
    const card = useCard(props.id);
    const dispatch = useDispatch();
    useEffect(() => {
        if (props.id !== card?.id) {
            const action = Actions.Board.loadCard({ card_id: props.id });
            dispatch(action);
        }
    }, [card?.id]);
    if (card && card?.id === props.id) {
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
    return <LoadDialog open={props.open} onClose={props.onClose} />;
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
