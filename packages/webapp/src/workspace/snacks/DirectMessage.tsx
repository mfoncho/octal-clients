import React, { useState } from "react";
import cls from "classnames";
import { makeStyles } from "@material-ui/core/styles";
import { useSnackbar } from "notistack";
import Collapse from "@material-ui/core/Collapse";
import Paper from "@material-ui/core/Paper";
import InputBase from "@material-ui/core/InputBase";
import Typography from "@material-ui/core/Typography";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import CloseIcon from "@material-ui/icons/Close";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import truncate from "lodash/truncate";
import { useDispatch } from "react-redux";

const useStyles = makeStyles((theme) => ({
    card: {
        maxWidth: 400,
        minWidth: 344,
    },
    textarea: {
        padding: theme.spacing(2.5),
        backgroundColor:
            theme.palette.type === "light"
                ? theme.palette.primary[50]
                : `${theme.palette.primary["A400"]}0F`,
    },
    avatar: {
        width: 45,
        height: 45,
        borderRadius: theme.spacing(3),
    },
    typography: {
        fontWeight: "bold",
    },
    header: {
        padding: theme.spacing(1, 1, 1, 2),
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        "& div": {
            display: "flex",
            alignItems: "center",
            flexDirection: "row",
        },
    },
    info: {
        padding: theme.spacing(0, 1),
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
    },
    expand: {
        padding: theme.spacing(1, 1),
        transform: "rotate(0deg)",
        transition: theme.transitions.create("transform", {
            duration: theme.transitions.duration.shortest,
        }),
    },
    expandOpen: {
        transform: "rotate(180deg)",
    },
    collapse: {},
    text: {
        padding: 16,
    },
    checkIcon: {
        fontSize: 20,
        color: "#b3b3b3",
        paddingRight: 4,
    },
    submit: {
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
    },
    button: {
        padding: 0,
        textTransform: "none",
    },
}));

export default React.forwardRef((props: any, ref: any) => {
    const classes = useStyles();

    const dispatch = useDispatch();

    const [text, setText] = useState("");

    const { closeSnackbar } = useSnackbar();

    const [read, setRead] = useState(false);

    const [expanded, setExpanded] = useState(false);

    function handleTextInput(e: any) {
        setText(e.target.value);
    }

    function handleDismiss() {
        closeSnackbar(props.id);
    }

    function handleKeyPress(event: any) {
        if (event.key === "Enter") {
            event.preventDefault();
            event.stopPropagation();
            if (text.trim() !== "") {
                sumitMessage();
                handleDismiss();
            }
        }
    }

    function sumitMessage() {
        dispatch({
            type: "POST_MESSAGE",
            payload: {
                text: text,
                thread: props.message.thread_id,
                space: props.message.space_id,
            },
        });
        handleDismiss();
    }

    function handleExpandClick() {
        if (expanded === false && read === false) {
            setRead(true);
            dispatch({
                type: "MARK_AS_READ",
                payload: props.message,
            });
        }
        setExpanded(!expanded);
    }

    return (
        <Card className={classes.card} ref={ref}>
            <CardActions classes={{ root: classes.header }}>
                <div>
                    <Avatar
                        src={props.message.author.avatar}
                        aria-label="user-icon"
                        className={classes.avatar}
                    />
                    <div className={classes.info}>
                        <Typography
                            variant="subtitle2"
                            className={classes.typography}>
                            {props.message.author.name}
                        </Typography>
                    </div>
                </div>
                <div>
                    <IconButton
                        aria-label="Show more"
                        className={cls(classes.expand, {
                            [classes.expandOpen]: expanded,
                        })}
                        onClick={handleExpandClick}>
                        <ExpandMoreIcon />
                    </IconButton>
                    <IconButton
                        className={classes.expand}
                        onClick={handleDismiss}>
                        <CloseIcon />
                    </IconButton>
                </div>
            </CardActions>
            <Collapse in={!expanded} timeout="auto" unmountOnExit>
                <div className={classes.text}>
                    <Typography gutterBottom>
                        {truncate(props.message.text, { length: 90 })}
                    </Typography>
                </div>
            </Collapse>
            <Collapse in={expanded} timeout="auto" unmountOnExit>
                <Paper className={classes.collapse}>
                    <div className={classes.text}>
                        <Typography gutterBottom>
                            {props.message.text}
                        </Typography>
                    </div>
                    <InputBase
                        multiline
                        rows={3}
                        value={text}
                        fullWidth
                        autoFocus
                        className={classes.textarea}
                        onChange={handleTextInput}
                        onKeyPress={handleKeyPress}
                        placeholder={`Send @${props.message.author.name} a quick reply`}
                        inputProps={{ "aria-label": "Quick reply" }}
                    />
                    <Button
                        className={classes.submit}
                        fullWidth
                        variant="contained"
                        color="primary"
                        onClick={sumitMessage}>
                        Send
                    </Button>
                </Paper>
            </Collapse>
        </Card>
    );
});
