import React from "react";
import { Popper, Textarea } from "@octal/ui";
import { Text } from "@octal/ui";
import PresenceAvatar from "../PresenceAvatar";
import { useInput } from "src/utils";
import { useUser, useViewer } from "@octal/store";
import * as ThreadAction from "@octal/store/lib/actions/thread";
import { useDispatch } from "react-redux";

interface IUserCard {
    id: string;
}

const Card = Popper.create<HTMLDivElement, IUserCard>((props) => {
    const viewer = useViewer();

    const [loading, setLoading] = React.useState<boolean>(false);

    const user = useUser(props.id)!;

    const dispatch = useDispatch();

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
            return dispatch(action).finally(props.onClickAway as any);
        }
    }

    return (
        <Popper
            open={true}
            portal={true}
            anchorEl={props.anchorEl}
            onClickAway={props.onClickAway}
            className="rounded-md flex flex-col w-[250px] z-[1500] bg-white shadow-lg">
            <div className="w-full flex py-5 justify-center items-center">
                <PresenceAvatar
                    id={user.id}
                    src={user.avatar}
                    className={"w-20 h-20 rounded-full"}
                />
            </div>
            <div className="flex flex-col">
                <div className="flex flex-col justify-center items-center bg-gray-800/50">
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
                        <Textarea
                            value={loading ? input.value : ""}
                            onSubmit={handleSubmit}
                            onChange={input.props.onChange}
                            className="text-msg p-3 min-h-[100px]"
                            placeholder={`@${
                                user.username || ""
                            } quick message`}
                        />
                        <button
                            className="bg-primary-500 rounded-b w-full text-white font-bold py-2"
                            onClick={handleSubmit}>
                            Send
                        </button>
                    </>
                )}
            </div>
        </Popper>
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
                anchorEl={anchor}
                onClickAway={() => setAnchor(null)}
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
