import React from "react";
import moment from "moment";
import capitalize from "lodash/capitalize";
import * as patterns from "@octal/patterns";
import * as Icons from "@octal/icons";
import { BsPlusLg as AddIcon } from "react-icons/bs";
import { IoMdCopy as CopyIcon, IoMdLink as LinkIcon } from "react-icons/io";
import { BiTrash as DeleteIcon } from "react-icons/bi";
import { FaCheck as InvitedIcon } from "react-icons/fa";
import { Dialog, Button, Flow } from "@octal/ui";
import { useInput } from "src/utils";
import client, { io } from "@octal/client";
import { SpaceRecord } from "@octal/store";

type ModeType = "email" | "link";

interface IInviteMode {
    space: SpaceRecord;
    invite?: io.SpaceInvite;
    setMode: (mode: ModeType) => void;
}

interface IInvite {
    space: SpaceRecord;
}

function validateEmail(email: string) {
    return new RegExp(patterns.email).test(email);
}

function EmailInvite(props: IInviteMode) {
    const email = useInput("", validateEmail);
    const inputRef = React.useRef<HTMLInputElement | null>(null);
    const [loading, setLoading] = React.useState(false);
    const [emails, setEmails] = React.useState<string[]>([]);
    const [invited, setInvited] = React.useState<string[]>([]);

    function handleAddEmail() {
        const { value } = email;
        setEmails((emails) => [value].concat(emails));
        email.setValue("");
    }

    function handleRemoveEmail(email: string) {
        return () => {
            setEmails((emails) => emails.filter((mail) => mail !== email));
        };
    }

    function handleSubmit() {
        const semails = emails.length > 0 ? emails : [email.value];
        client
            .sendInvitations({ space_id: props.space.id, params: semails })
            .then(() => {
                setInvited(semails);
                setEmails(semails);
                if (email.value) {
                    email.setValue("");
                }
            })
            .catch(() => {})
            .finally(() => setLoading(false));
        setLoading(true);
    }

    function submitable() {
        // valid single email
        if (email.value.length > 0 && email.valid && emails.length == 0)
            return true;

        // valid email array with empty input
        if (email.value.length == 0 && emails.length > 0) return true;

        return false;
    }

    function handleResetForm() {
        email.setValue("");
        setEmails([]);
        setInvited([]);
        setLoading(false);
    }

    const valid = submitable();

    return (
        <React.Fragment>
            <Dialog.Content className="flex flex-col overflow-hidden">
                {invited.length == 0 && (
                    <React.Fragment>
                        <div className="relative flex flex-row">
                            <input
                                ref={inputRef}
                                type="email"
                                disabled={loading}
                                placeholder="Email"
                                className="form-input font-semibold w-full text-gray-800 px-9 rounded-md border-gray-400"
                                {...email.props}
                            />
                            <div className="absolute pointer-events-none w-full flex flex-row justify-between text-gray-600 h-full py-2 px-2 flex items-center justify-center">
                                <Icons.Email />
                                <Button
                                    color="regular"
                                    className="text-lg pointer-events-auto"
                                    disabled={!email.valid || loading}
                                    onClick={handleAddEmail}
                                    variant="icon">
                                    <AddIcon className="text-gray-600" />
                                </Button>
                            </div>
                        </div>
                        <div className="flex flex-row justify-end py-2">
                            <button
                                onClick={() => props.setMode("link")}
                                className="text-sm font-bold text-primary-500">
                                Invite Link
                            </button>
                        </div>
                    </React.Fragment>
                )}
                {emails.length > 0 && (
                    <div className="flex flex-col overflow-y-auto overflow-x-hidden py-4">
                        {emails.map((email, index) => (
                            <div
                                key={String(index)}
                                className="group hover:bg-gray-50 flex flex-row py-1 justify-between items-center">
                                <span className="px-2 py-1 rounded-md bg-primary-50 text-primary-800 font-bold text-base text-gray-800">
                                    {email}
                                </span>
                                {invited.includes(email) ? (
                                    <button className="px-4">
                                        <InvitedIcon className="text-green-800" />
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleRemoveEmail(email)}
                                        className="px-4">
                                        <DeleteIcon className="text-gray-500" />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </Dialog.Content>
            <Dialog.Actions>
                {invited.length > 0 ? (
                    <Button onClick={handleResetForm} color="primary">
                        Reset
                    </Button>
                ) : (
                    <Button
                        onClick={handleSubmit}
                        color="primary"
                        disabled={loading || !valid}>
                        Invite
                    </Button>
                )}
            </Dialog.Actions>
        </React.Fragment>
    );
}

function InviteLink(props: IInviteMode) {
    function handleCopyLink() {
        if (props.invite) {
            navigator.clipboard.writeText(props.invite.link);
        }
    }

    return (
        <React.Fragment>
            <Dialog.Content className="flex flex-col overflow-hidden">
                <div className="relative flex flex-row">
                    <input
                        disabled={true}
                        value={props.invite ? props.invite.link : "..."}
                        placeholder="Email"
                        className="form-input font-semibold w-full text-gray-600 pr-12 pl-8 rounded-md border-gray-400"
                    />
                    <div className="absolute pointer-events-none w-full flex flex-row justify-between text-gray-600 h-full py-2 px-2 flex items-center justify-center">
                        <LinkIcon />
                        <Button
                            color="primary"
                            className="text-lg pointer-events-auto"
                            onClick={handleCopyLink}
                            variant="icon">
                            <CopyIcon className="text-white" />
                        </Button>
                    </div>
                </div>
                <div className="flex flex-row justify-end py-2 text-sm font-bold text-primary-500">
                    {props.invite?.expire_at && (
                        <>
                            <span className="pr-2">Expire at: </span>
                            <span className="">
                                {props.invite &&
                                    moment(props.invite.expire_at).format("ll")}
                            </span>
                        </>
                    )}
                </div>
            </Dialog.Content>
            <Dialog.Actions>
                <Button onClick={() => props.setMode("email")} color="primary">
                    Invite Email
                </Button>
            </Dialog.Actions>
        </React.Fragment>
    );
}

export default Dialog.create<IInvite>((props) => {
    const [invite, setInvite] = React.useState<io.SpaceInvite>();

    const [mode, setMode] = React.useState<ModeType>("link");

    React.useEffect(getSpaceInvite, []);

    function getSpaceInvite() {
        client
            .getSpaceInvite(props.space.id)
            .then((data) => {
                setInvite(data);
            })
            .catch(() => {});
    }

    return (
        <Dialog
            title={`Invite ${capitalize(mode)}`}
            maxWidth="xs"
            open={props.open}
            onClose={props.onClose}>
            <Flow.Switch value={mode}>
                <Flow.Case value="email">
                    <EmailInvite space={props.space} setMode={setMode} />
                </Flow.Case>
                <Flow.Case value="link">
                    <InviteLink
                        invite={invite}
                        space={props.space}
                        setMode={setMode}
                    />
                </Flow.Case>
            </Flow.Switch>
        </Dialog>
    );
});
