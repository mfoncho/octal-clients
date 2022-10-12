import React, { useEffect, useState } from "react";
import { Dialog } from "@colab/ui";
import { makeStyles } from "@material-ui/core/styles";
import DialogContent from "@material-ui/core/DialogContent";
import PerfectScrollbar from "react-perfect-scrollbar";
import Client from "@colab/client";

const useStyles = makeStyles((theme) => ({
    root: {
        height: "80%",
    },
    main: {
        display: "flex",
        padding: theme.spacing(1, 0),
        overflow: "hidden",
        flexDirection: "column",
    },
    appBar: {
        position: "relative",
    },
    title: {
        flex: 1,
        marginLeft: theme.spacing(2),
    },
    container: {
        flex: 1,
        display: "flex",
        padding: theme.spacing(0, 4, 2, 4),
        flexDirection: "column",
    },
    icon: {},
    item: {
        borderRadius: theme.spacing(1),
    },
}));

interface IDialog {
    open: boolean;
    onClose: () => void;
}

export default React.memo<IDialog>((props) => {
    let classes = useStyles();

    useEffect(() => {
        if (props.open) {
            Client.fetchArchivedSpaces()
                .then(({}) => {})
                .catch(() => {});
        }
    }, [props.open]);

    return (
        <Dialog
            open={props.open}
            title="Archived spaces"
            onClose={props.onClose}>
            <DialogContent className={classes.main}>
                <PerfectScrollbar className={classes.container}>
                    <div>archived spaces</div>
                </PerfectScrollbar>
            </DialogContent>
        </Dialog>
    );
});
