import React, { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import Popover from "@material-ui/core/Popover";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import InputBase from "@material-ui/core/InputBase";
import { Text } from "@octal/ui";
import PresenceAvatar from "../PresenceAvatar";
import { useUser, useViewer } from "@octal/store";
import { useDispatch } from "react-redux";

const useStyles = makeStyles((theme) => ({
    root: {
        width: 256,
        display: "flex",
        flexDirection: "column",
        backgroundColor: theme.palette.background.default,
    },
    glass: {
        position: "absolute",
        width: "100%",
        height: "100%",
    },
    header: {
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        justifyContent: "center",
    },
    statusIcon: {
        margin: theme.spacing(1, 0, 0, 0),
        width: theme.spacing(3),
        height: theme.spacing(3),
    },
    padded: {
        padding: theme.spacing(2),
    },
    textarea: {
        padding: theme.spacing(2),
    },
    avatar: {
        width: theme.spacing(10),
        height: theme.spacing(10),
    },
    content: {
        display: "flex",
        flexDirection: "column",
    },
    submit: {
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
    },
    info: {
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: theme.spacing(1, 1),
        backgroundColor: "rgba(0,0,0,0.8)",
    },
    status: {
        fontSize: "0.9rem",
        fontWeight: 600,
        margin: theme.spacing(0.1),
        color: theme.palette.common.white,
    },
    names: {
        fontSize: "0.9rem",
        fontWeight: 600,
        margin: theme.spacing(0.1),
        color: theme.palette.common.white,
    },
    name: {
        borderRadius: theme.spacing(1),
        color: theme.palette.common.white,
        fontSize: "0.9rem",
        fontWeight: 600,
        margin: theme.spacing(0.1),
        paddingLeft: theme.spacing(1),
        paddingRight: theme.spacing(1),
        backgroundColor: theme.palette.primary["A700"],
    },
}));

interface IUserCard {
    id: string;
    anchor: Element;
    onClose: (event: any, reason: string) => void;
}

const Card = React.memo((props: IUserCard) => {
    const viewer = useViewer();

    const classes = useStyles();

    const user = useUser(props.id)!;

    const dispatch = useDispatch();

    const [text, setText] = useState<string>("");

    const [valid, setValid] = useState<boolean>(false);

    useEffect(() => {
        if (text.trim().length > 1) {
            setValid(true);
        } else {
            setValid(false);
        }
    }, [text]);

    function handleTextInput({ target }: any) {
        setText(target.value);
    }

    function handleSubmit(event: any) {
        dispatch({
            type: "POST_DIRECT_MESSAGE",
            payload: {
                text: text,
                user: props.id,
            },
        });
    }

    function handleKeyPress(event: React.KeyboardEvent) {
        if (event.key === "Enter") {
            event.preventDefault();
            event.stopPropagation();
            if (valid) {
                handleSubmit(event);
            }
        }
    }

    return (
        <Popover
            open
            onClose={props.onClose}
            anchorEl={props.anchor}
            PaperProps={{ elevation: 3 }}
            classes={{ paper: classes.root }}>
            <div className={classes.glass} />
            <div className={classes.header}>
                <div className={classes.padded}>
                    <PresenceAvatar
                        id={user.id}
                        src={user.avatar}
                        className={classes.avatar}
                    />
                </div>
            </div>
            <Paper elevation={2}>
                <div className={classes.info}>
                    <span className="text-base font-bold text-white pb-px">
                        {`@${user.name}`}
                    </span>
                    <span className="text-sm font-bold text-white pb-px">
                        {user.name}
                    </span>
                    <span className="text-sm font-semibold text-white py-px">
                        {Boolean(user.state.icon) ||
                            (Boolean(user.state.status) && (
                                <React.Fragment>
                                    <span>
                                        <Text>{user.state.icon}</Text>
                                    </span>
                                    <span>{user.state.status}</span>
                                </React.Fragment>
                            ))}
                    </span>
                </div>
                {viewer.id !== user.id && (
                    <>
                        <InputBase
                            multiline
                            rows={4}
                            value={text}
                            fullWidth
                            onChange={handleTextInput}
                            className={classes.textarea}
                            onKeyPress={handleKeyPress}
                            placeholder={`Send ${
                                user.name || ""
                            } a quick message`}
                            inputProps={{ "aria-label": "Send quick message" }}
                        />
                        <Button
                            fullWidth
                            color="primary"
                            variant="contained"
                            onClick={handleSubmit}
                            disabled={!valid || !Boolean(user.name)}
                            className={classes.submit}>
                            Send
                        </Button>
                    </>
                )}
            </Paper>
        </Popover>
    );
});

type HandleCb = (e: React.MouseEvent<HTMLElement>) => void;

type AnchorSetState = React.Dispatch<React.SetStateAction<HTMLElement | null>>;

function useCard(
    id: string | null | undefined
): [React.ReactNode, HandleCb, AnchorSetState] {
    const [anchor, setAnchor] = React.useState<HTMLElement | null>(null);

    let node = null;
    const handle = React.useCallback(
        (e: React.MouseEvent<HTMLElement>) => {
            setAnchor(() => e.target as any);
        },
        [id]
    );

    if (anchor && id) {
        node = <Card id={id} anchor={anchor} onClose={() => setAnchor(null)} />;
    }
    return [node, handle, setAnchor];
}

type CardType = typeof Card & {
    useCard: typeof useCard;
};

(Card as CardType).useCard = useCard;

export default Card as CardType;
