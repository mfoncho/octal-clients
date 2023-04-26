import React from "react";
import clx from "classnames";
import { Button, Dialog, Textarea, Markdown, Flow, Image } from "@colab/ui";
import { Text } from "@colab/ui";
import * as Icons from "@colab/icons";
import { useInput } from "src/utils";
import PerfectScrollbar from "react-perfect-scrollbar";
import { presence as colors } from "src/utils";
import {
    useProfile,
    useRoles,
    useViewer,
    usePresence,
    UserRecord,
} from "@colab/store";
import * as ThreadAction from "@colab/store/lib/actions/thread";
import { useDispatch } from "react-redux";

interface IUserRecord {
    id: string;
}

const DirectMessageForm = React.memo<{
    user: UserRecord;
    onSubmit?: () => void;
}>(({ user, ...props }) => {
    const dispatch = useDispatch();
    const [loading, setLoading] = React.useState<boolean>(false);
    const input = useInput("");
    function handleSubmit() {
        if (input.valid && !loading) {
            const action = ThreadAction.postDirectMessage({
                user_id: user.id,
                params: {
                    content: input.value,
                },
            });
            setLoading(true);
            return dispatch(action).finally(props.onSubmit as any);
        }
    }

    return (
        <div className="flex flex-1 flex-col overflow-hidden justify-between">
            <PerfectScrollbar className="flex flex-col">
                <Textarea
                    disabled={loading}
                    onSubmit={handleSubmit}
                    onChange={input.props.onChange}
                    className="text-msg p-3 min-h-[10px] flex-1 flex flex-row first-child:w-full"
                    placeholder={`@${user.username || ""} quick message`}
                />
            </PerfectScrollbar>
            <button
                disabled={loading}
                className="disabled:bg-primary-400 bg-primary-700 w-full text-white font-bold py-2"
                onClick={handleSubmit}>
                Send
            </button>
        </div>
    );
});

const Record = Dialog.create<IUserRecord>((props) => {
    const viewer = useViewer();
    const roles = useRoles();
    const user = useProfile(props.id)!;
    const presence = usePresence(props.id);
    const [tab, setTab] = React.useState<string>("bio");
    const userRoles = roles.filter((role) => user.roles.includes(role.id));
    return (
        <Dialog.Base
            open={props.open}
            maxWidth="xs"
            fullWidth={false}
            fullScreen="mobile"
            className="relative w-[280px]"
            onClose={props.onClose}>
            <div className="w-full flex flex-col justify-between overflow-hidden md:w-[280px] md:h-[250px] h-[350px] relative">
                <Image
                    alt={user.username}
                    src={user.avatar}
                    className={
                        "w-full h-full md:rounded-t-lg absolute object-fill"
                    }
                />
                <div className="flex px-4  py-4 flex-row justify-between md:invisible z-[1]">
                    <div />
                    <Button variant="icon" onClick={props.onClose}>
                        <Icons.Close className="text-gray-500" />
                    </Button>
                </div>
                <div className="flex flex-row justify-between items-center bg-gray-800/50 w-full z-[1] py-2 backdrop-blur-sm  overflow-hidden text-white px-4">
                    <div>
                        <span className="text-sm font-semibold py-px">
                            <Text>{user.status.text}</Text>
                        </span>
                    </div>
                    <div
                        className="w-3 h-3 rounded-full shadow"
                        style={{ backgroundColor: colors.get(presence.state) }}
                    />
                </div>
            </div>
            <div
                className={`flex flex-col justify-center py-2 px-4 text-gray-700 overflow-hidden ${
                    viewer.id === user.id && "md:rounded-b-lg"
                }`}>
                <div className="flex flex-col">
                    <span className="text-lg font-black pb-px">
                        {user.name}
                    </span>
                    <span className="text-gray-600 text-sm font-bold pb-px">
                        {`@${user.username}`}
                    </span>
                </div>
                <div className="space-x-2 flex flex-row flex-wrap py-2">
                    {userRoles
                        .map((role) => (
                            <div
                                key={role.id}
                                className="text-sm font-semibold py-px space-x rounded-md border-slate-200 border bg-slate-100 hover:bg-slate-200">
                                <span className="px-1">
                                    <Text>{role.toString()}</Text>
                                </span>
                            </div>
                        ))
                        .toList()
                        .reverse()}
                </div>
                {/**
                 **/}
            </div>
            <div className="flex flex-row h-12 bg-slate-100 z-[1] space-x-2 p-2">
                <button
                    onClick={(_) => setTab("bio")}
                    className={clx(
                        "flex-1 rounded-lg hover:bg-slate-200 py-4 text-gray-600 justify-center items-center flex",
                        tab == "bio" && "bg-slate-300"
                    )}>
                    {tab == "bio" ? <Icons.Info.Solid /> : <Icons.Info />}
                </button>
                {viewer.id !== user.id && (
                    <button
                        onClick={(_) => setTab("chat")}
                        className={clx(
                            "flex-1 rounded-lg hover:bg-slate-200 py-4 text-gray-600 justify-center items-center flex",
                            tab == "chat" && "bg-slate-300"
                        )}>
                        <Icons.Chat />
                    </button>
                )}
            </div>
            <div className="flex flex-col md:rounded-b-lg w-full overflow-hidden overflow-hidden md:h-[100px] flex-1 md:flex-none">
                <Flow.Switch value={tab}>
                    <Flow.Case value="chat">
                        {viewer.id !== user.id && (
                            <DirectMessageForm
                                user={user}
                                onSubmit={props.onClose as any}
                            />
                        )}
                    </Flow.Case>
                    <Flow.Case value="bio">
                        <PerfectScrollbar className="flex flex-col">
                            <div className="p-4 bg-slate-50 flex-1">
                                <span className="text-base text-gray-700">
                                    <Markdown>{user.bio}</Markdown>
                                </span>
                            </div>
                        </PerfectScrollbar>
                    </Flow.Case>
                </Flow.Switch>
            </div>
        </Dialog.Base>
    );
});

type HandleCb = (e: React.MouseEvent<HTMLElement>) => void;

type AnchorSetState = React.Dispatch<React.SetStateAction<HTMLElement | null>>;

function useRecord(
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
        node = (
            <Record
                id={id}
                open={Boolean(anchor) && Boolean(id)}
                onClose={() => setAnchor(null)}
            />
        );
    }
    return [node, handle, setAnchor];
}

type RecordType = typeof Record & {
    useRecord: typeof useRecord;
};

(Record as RecordType).useRecord = useRecord;

export default Record as RecordType;
