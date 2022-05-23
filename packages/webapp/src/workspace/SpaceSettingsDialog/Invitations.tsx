import React, { useState, useEffect } from "react";
import { Button } from "@octal/ui";
import { BsTrash as DeleteIcon } from "react-icons/bs";
import moment from "moment";
import client, { io } from "@octal/client";
import Layout from "./Layout";
import { SpaceManagerProps } from "./index";

const Manager = React.memo(({ space }: SpaceManagerProps) => {
    const [loading, setLoading] = useState(false);

    const [invitations, setInvitations] = useState<io.SpaceInvite[]>([]);

    useEffect(() => {
        fetchInvites();
    }, []);

    function fetchInvites() {
        client
            .fetchSpaceInvites(space.id)
            .then((data) => {
                setInvitations(data);
            })
            .catch(() => {})
            .finally(() => setLoading(false));
        setLoading(true);
    }

    function handleDeleteInvitation(invite: io.SpaceInvite) {
        return () => {
            client
                .deleteInvitation({
                    space_id: space.id,
                    invite_id: invite.id,
                })
                .then(() => {
                    setInvitations((invitations) =>
                        invitations.filter((inv) => inv.id !== invite.id)
                    );
                })
                .finally(() => setLoading(false));
            setLoading(true);
        };
    }

    return (
        <Layout
            title="Invitations"
            className="flex flex-col divide-solid divide-y border border-solid rounded">
            {invitations.map((invite) => (
                <div
                    key={invite.id}
                    className="flex flex-row items-center justify-between hover:bg-slate-200 px-4">
                    <div className="flex-1 flex flex-row items-center">
                        <img
                            className="w-8 h-8 rounded-full"
                            alt={invite.user.username}
                            src={invite.user.avatar}
                        />
                        <span className="px-2 font-bold text-sm text-gray-800">
                            {invite.user.username}
                        </span>
                    </div>
                    <div className="flex-1 text-gray-600 overflow-hidden">
                        {invite.link && (
                            <p className="truncate font-semibold text-sm">
                                {invite.link}
                            </p>
                        )}
                        {invite.email && (
                            <p className="truncate font-semibold text-sm">
                                {invite.email}
                            </p>
                        )}
                    </div>
                    <div className="flex-1 flex flex-row font-semibold text-xs justify-center overflow-x-hidden text-gray-600">
                        {moment(invite.expire_at).fromNow()}
                    </div>
                    <div className="flex flex-row p-2  justify-end">
                        <Button
                            variant="icon"
                            onClick={handleDeleteInvitation(invite)}
                            disabled={loading}
                            className="hover:text-red-500"
                            color="clear">
                            <DeleteIcon />
                        </Button>
                    </div>
                </div>
            ))}
        </Layout>
    );
});

function filter() {
    return true;
}

const name = "Invitations";

export default {
    name: name,
    filter: filter,
    manager: Manager,
};
