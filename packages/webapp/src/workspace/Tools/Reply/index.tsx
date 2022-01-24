import React from "react";
import { makeStyles, Divider } from "@material-ui/core";
import * as Icons from "@octal/icons";
import Tool from "../Tool";
import Thread from "../../Thread";
import Message from "../../Message";
import { Textarea } from "@octal/ui";
import { useMessage } from "@octal/store";
import { usePostInput } from "../../Space/hooks";

const useStyles = makeStyles((theme) => ({
    root: {
        display: "flex",
        flexDirection: "column",
    },
    message: {
        padding: theme.spacing(1, 0),
    },
    input: {
        flexShrink: 1,
        padding: theme.spacing(1),
    },
    main: {
        flexGrow: 1,
        display: "flex",
        overflow: "hidden",
        flexDirection: "column",
    },
}));

interface IReply {
    id: string;
}

export const sidebar = false;

export const name = "reply";

export const icon = Icons.Reply;

const Input = React.memo<{ placeholder?: string; id: string }>((props) => {
    const postInput = usePostInput(props.id);
    return <Textarea.Post {...postInput} placeholder={props.placeholder} />;
});

export default React.memo<IReply>((props) => {
    const classes = useStyles();
    const message = useMessage(props.id);
    return (
        <Tool icon={<Icons.Reply />} title={name}>
            <Divider />
            {message ? (
                <div className={classes.message}>
                    <Message extra={true} tsformat="LL" message={message} />
                </div>
            ) : null}
            <Divider />
            {message && message.reply_thread_id && (
                <>
                    <div className={classes.main}>
                        {message && <Thread id={message.reply_thread_id} />}
                    </div>
                    <div className={classes.input}>
                        <Input
                            id={message.reply_thread_id}
                            placeholder="Post reply"
                        />
                    </div>
                </>
            )}
        </Tool>
    );
});
