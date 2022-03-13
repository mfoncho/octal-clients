import React, { useEffect, useState } from "react";
import List from "@material-ui/core/List";
import Button from "@material-ui/core/Button";
import { Dialog } from "@octal/ui";
import Avatar from "@material-ui/core/Avatar";
import ListItem from "@material-ui/core/ListItem";
import { makeStyles } from "@material-ui/core/styles";
import { useNavigate, generatePath } from "react-router-dom";
import ListItemText from "@material-ui/core/ListItemText";
import DialogContent from "@material-ui/core/DialogContent";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import { useDispatch } from "react-redux";
import * as Icons from "@octal/icons";
import Client from "@octal/client";
import paths from "src/paths/workspace";
import { useSpaces } from "@octal/store";
import { joinSpace } from "@octal/store/lib/actions/space";
import { io } from "@octal/client";

const useStyles = makeStyles((theme) => ({
    icon: {
        borderRadius: theme.spacing(1),
    },
    item: {
        borderRadius: theme.spacing(1),
    },
    joined: {
        color: theme.palette.primary["A400"],
    },
    button: {
        color: theme.palette.getContrastText(theme.palette.primary[500]),
        backgroundColor: theme.palette.primary[500],
        "&:hover": {
            backgroundColor: theme.palette.primary[700],
        },
    },
}));

interface IDialog {
    open: boolean;
    onClose: () => void;
}

export default React.memo<IDialog>((props) => {
    const navigate = useNavigate();

    const classes = useStyles();

    const dispatch = useDispatch();

    const joined = useSpaces();

    const [joining, setJoining] = useState<boolean>(false);

    const [spaces, setSpaces] = useState<io.Space[]>([]);

    useEffect(() => {
        if (props.open) {
            Client.fetchPublicSpaces()
                .then((data) => setSpaces(data))
                .catch((e) => e);
        }
    }, [props.open]);

    function handleJoinSpace(space: io.Space) {
        return () => {
            const params = {
                space_id: space.id,
                workspace_id: "whay",
            };
            const action = joinSpace(params);
            dispatch(action)
                .then(() => {
                    const path = generatePath(paths.space, params);
                    navigate(path);
                    props.onClose();
                })
                .catch(() => setJoining(false));
            setJoining(true);
        };
    }

    return (
        <Dialog
            open={props.open}
            icon={<Icons.Public />}
            title="Spaces"
            onClose={props.onClose}>
            <DialogContent>
                <List>
                    {spaces.map((space) => (
                        <ListItem
                            className={classes.item}
                            button
                            key={space.id}>
                            <ListItemAvatar>
                                <Avatar
                                    className={classes.icon}
                                    alt={space.name}
                                    src={space.icon ? space.icon : undefined}
                                />
                            </ListItemAvatar>

                            <ListItemText primary={space.name} />

                            {!joined.has(space.id) && !joining && (
                                <Button
                                    variant="outlined"
                                    className={classes.button}
                                    onClick={handleJoinSpace(space)}>
                                    JOIN
                                </Button>
                            )}
                        </ListItem>
                    ))}
                </List>
            </DialogContent>
        </Dialog>
    );
});
