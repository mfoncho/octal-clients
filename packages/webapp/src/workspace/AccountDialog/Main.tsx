import React, { useState } from "react";
import { Dialog, Flow, UIEvent } from "@colab/ui";
import { useUser } from "@colab/store/lib/hooks";
import Preferences from "./Preferences";
import Session from "./Session";
import Profile from "./Profile";
import Security from "./Security";
import { Tab } from "../SpaceDialog";

interface IDialog {}

const tabs = [
    { name: "Profile", value: "profile" },
    { name: "Preferences", value: "preferences" },
    { name: "Session", value: "session" },
];

export default Dialog.create<IDialog>((props) => {
    const user = useUser();

    const [active, setActive] = useState<string>("profile");

    function handleSwitchTab(event: UIEvent<{ value: string }>) {
        setActive(event.target.value);
    }

    return (
        <Dialog
            open={props.open}
            fullHeight={true}
            title="Account"
            onClose={props.onClose}>
            <div className="flex flex-row bg-slate-100 px-5 py-3 overflow-x-auto space-x-4">
                {tabs.map((tab) => (
                    <Tab
                        key={tab.value}
                        value={tab.value}
                        active={active === tab.value}
                        onClick={handleSwitchTab}>
                        {tab.name}
                    </Tab>
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
