import React from "react";
import { Button, Dialog, Textarea } from "@octal/ui";
import { Text } from "@octal/ui";
import * as Icons from "@octal/icons";
import { useInput } from "src/utils";
import { useProfile, useViewer, UserRecord } from "@octal/store";
import * as ThreadAction from "@octal/store/lib/actions/thread";
import { useDispatch } from "react-redux";

interface IUserCard {
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
        <>
            <Textarea
                disabled={loading}
                onSubmit={handleSubmit}
                onChange={input.props.onChange}
                className="text-msg p-3 min-h-[100px] flex-1 flex flex-row first-child:w-full"
                placeholder={`@${user.username || ""} quick message`}
            />
            <button
                disabled={loading}
                className="disabled:bg-primary-400 bg-primary-700 w-full text-white font-bold py-2"
                onClick={handleSubmit}>
                Send
            </button>
        </>
    );
});

const Card = Dialog.create<IUserCard>((props) => {
    const viewer = useViewer();

    const user = useProfile(props.id)!;
    return (
        <Dialog.Base
            open={props.open}
            maxWidth="xs"
            fullWidth={false}
            fullScreen="mobile"
            className="w-[280px] justify-between"
            onClose={props.onClose}>
            <div className="w-full flex flex-col justify-between overflow-hidden md:w-[280px] md:h-[250px] h-[350px] relative">
                <img
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
                <div
                    className={`flex flex-col justify-center items-center bg-gray-800/50 w-full z-[1] py-2 backdrop-blur-sm  overflow-hidden ${
                        viewer.id === user.id && "md:rounded-b-lg"
                    }`}>
                    <span className="text-base font-bold text-white pb-px">
                        {`@${user.username}`}
                    </span>
                    <span className="text-sm font-bold text-white pb-px">
                        {user.name}
                    </span>
                    <span className="text-sm font-semibold text-white py-px">
                        <span>
                            <Text>{user.status}</Text>
                        </span>
                    </span>
                </div>
            </div>
            {viewer.id !== user.id && (
                <div className="flex flex-col md:rounded-b-lg w-full overflow-hidden flex-1">
                    <DirectMessageForm
                        user={user}
                        onSubmit={props.onClose as any}
                    />
                </div>
            )}
        </Dialog.Base>
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
        node = (
            <Card
                id={id}
                open={Boolean(anchor) && Boolean(id)}
                onClose={() => setAnchor(null)}
            />
        );
    }
    return [node, handle, setAnchor];
}

type CardType = typeof Card & {
    useCard: typeof useCard;
};

(Card as CardType).useCard = useCard;

export default Card as CardType;
