import React, { useState } from "react";
import clx from "classnames";
import { Dialog, Button, Flow } from "@colab/ui";
import { useUser } from "@colab/store/lib/hooks";
import Preferences from "./Preferences";
import Session from "./Session";
import Profile from "./Profile";
import Security from "./Security";

interface IDialog {}

const tabs = [
    { name: "Profile", value: "profile" },
    { name: "Preferences", value: "preferences" },
    { name: "Session", value: "session" },
];

export default Dialog.create<IDialog>((props) => {
    const user = useUser();

    const [active, setActive] = useState<string>("profile");

    function handleSwitchTab(preference: string) {
        return () => {
            setActive(preference);
        };
    }

    return (
        <Dialog
            open={props.open}
            fullHeight={true}
            title="Account"
            onClose={props.onClose}>
            <div className="flex flex-row items-center px-4">
                {tabs.map((tab) => (
                    <div key={tab.value} className="flex flex-col mr-4">
                        <Button
                            key={tab.value}
                            color="clear"
                            onClick={handleSwitchTab(tab.value)}>
                            {tab.name}
                        </Button>
                        <div
                            className={clx(
                                "h-1 rounded-t-md",
                                active == tab.value && "bg-primary-500"
                            )}
                        />
                    </div>
                ))}
            </div>
            <div className="flex flex-col flex-1 overflow-hidden justify-between">
                <Flow.Switch value={active}>
                    <Flow.Case value="profile">
                        <Profile user={user} setView={setActive} />
                    </Flow.Case>
                    <Flow.Case value="preferences">
                        <Preferences user={user} setView={setActive} />
                    </Flow.Case>
                    <Flow.Case value="password">
                        <Security user={user} setView={setActive} />
                    </Flow.Case>
                    <Flow.Case value="session">
                        <Session />
                    </Flow.Case>
                </Flow.Switch>
            </div>
        </Dialog>
    );
});
