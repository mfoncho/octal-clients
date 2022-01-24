import React, { useState } from "react";
import { Flow, Dialog, useScreen } from "@octal/ui";
import { useUser } from "@octal/store";
import Profile from "./Profile";
import Security from "./Security";

interface IDialog {}

export default Dialog.create<IDialog>((props) => {
    const user = useUser();

    const screen = useScreen();

    const [view, setView] = useState<string>("profile");

    function handleChangeView(view: string) {
        setView(view);
    }

    return (
        <Dialog
            title="Edit your profile"
            maxWidth="sm"
            fullScreen={screen.mobile}
            open={props.open}
            onClose={props.onClose}>
            <Flow.Switch value={view}>
                <Flow.Case value="profile">
                    <Profile user={user} setView={handleChangeView} />
                </Flow.Case>
                <Flow.Case value="password">
                    <Security user={user} setView={handleChangeView} />
                </Flow.Case>
            </Flow.Switch>
        </Dialog>
    );
});
