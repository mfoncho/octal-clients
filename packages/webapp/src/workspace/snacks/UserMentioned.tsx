import React from "react";
import PropTypes from "prop-types";
import { useSnackbar } from "notistack";
import { makeStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";
import Typography from "@material-ui/core/Typography";
import Avatar from "@material-ui/core/Avatar";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";

const useStyles = makeStyles((theme) => ({
    record: {
        maxWidth: 400,
        minWidth: 344,
    },
    avatar: {
        width: 45,
        height: 45,
        borderRadius: theme.spacing(2),
    },
    icons: {
        marginLeft: "auto",
    },
    title: {
        fontWeight: 600,
    },
    subheader: {
        color: "#616161",
    },
    author: {
        color: theme.palette.primary["A700"],
        marginRight: theme.spacing(0.5),
    },
}));

export default React.forwardRef((props: any, ref) => {
    const classes = useStyles();

    const { closeSnackbar } = useSnackbar();

    function handleDismiss(...e: any) {
        closeSnackbar(props.id);
    }

    return (
        <Card onClick={handleDismiss} className={classes.record} ref={ref}>
            <CardHeader
                avatar={
                    <Avatar
                        src={props.icon}
                        aria-label="space-icon"
                        className={classes.avatar}>
                        M
                    </Avatar>
                }
                action={
                    <IconButton onClick={handleDismiss}>
                        <CloseIcon />
                    </IconButton>
                }
                title={
                    <Typography variant="subtitle2" className={classes.title}>
                        {props.title}
                    </Typography>
                }
                subheader={
                    <Typography variant="body2" className={classes.subheader}>
                        <span className={classes.author}>{props.author}</span>
                        <span>
                            <span>mentioned you...</span>
                            <span aria-label="img" role="img">
                                💬
                            </span>
                        </span>
                    </Typography>
                }
            />
        </Card>
    );
});
