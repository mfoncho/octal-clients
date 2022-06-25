import React, { useState, useEffect } from "react";
import moment from "moment";
import { io } from "@console/types";
import * as Icons from "@octal/icons";
import { Button } from "@octal/ui";
import Pagination from "@material-ui/lab/Pagination";
import { Page } from "src/types";
import Layout from "@console/Layout";
import client, { FetchInvitesRequest } from "@console/client";
import { useLocation, useNavigate } from "react-router-dom";
import { useNavigator } from "@console/hooks";

const defaultPage: Page<io.Invite> = {
    data: [],
    page_size: 0,
    page_number: 0,
    total_pages: 0,
    total_count: 0,
};

export default React.memo(() => {
    const navigate = useNavigate();
    const location = useLocation();
    const [page, setPage] = useState(defaultPage);
    const navigator = useNavigator();
    const [loading, setLoading] = useState<string[]>([]);

    useEffect(() => {
        const params: FetchInvitesRequest = {};
        const query = new URLSearchParams(location.search);
        const page = query.has("page") ? parseInt(query.get("page") || "1") : 1;
        params.page = page;
        const limit = query.has("limit") ? query.get("limit") || "" : "";
        if (limit.trim() != "" && parseInt(limit)) {
            params.limit = limit.trim();
        }
        fetchPageInvites(params);
    }, [location.search]);

    function fetchPageInvites(params: FetchInvitesRequest) {
        client
            .fetchInvites(params)
            .then((data) => {
                setPage(data);
            })
            .catch(() => {});
    }

    function handlePageChange(event: any, page: number) {
        const query = new URLSearchParams(location.search);
        query.set("page", page as any);
        navigate(`${location.pathname}?${query.toString()}`);
    }

    function handleOpenUser(user: io.User) {
        return () => {
            navigator.openUser(user);
        };
    }

    function handleOpenSpace(space: io.Space) {
        return () => {
            navigator.openSpace(space);
        };
    }

    function handleMailInvite(invite: io.Invite) {
        return () => {
            client
                .mailInvite({ invite_id: invite.id })
                .finally(() => {
                    setLoading((loading) =>
                        loading.filter((id) => id != invite.id)
                    );
                })
                .then((data) => {
                    setPage((page) => ({
                        ...page,
                        data: page.data.map((inv) =>
                            inv.id == data.id ? data : inv
                        ),
                    }));
                })
                .catch(() => {});
            setLoading((loading) => loading.concat([invite.id]));
        };
    }

    function handleDeleteInvite(invite: io.Invite) {
        return () => {
            client
                .deleteInvite({ invite_id: invite.id })
                .finally(() => {
                    setLoading((loading) =>
                        loading.filter((id) => id != invite.id)
                    );
                })
                .then(() => {
                    setPage((page) => ({
                        ...page,
                        data: page.data.filter((inv) => inv.id != invite.id),
                    }));
                })
                .catch(() => {});
            setLoading((loading) => loading.concat([invite.id]));
        };
    }

    return (
        <Layout className="flex flex-grow flex-col p-4 bg-slate-200">
            <div className="flex flex flex-col divide-y divide-gray-100 rounded-md overflow-hidden shadow">
                <div className="grid grid-cols-6 py-3 text-gray-700 rounded-t-md text-xs font-semibold bg-gray-100">
                    <div className="col-span-2 px-6 overflow-hidden">
                        INVITE
                    </div>
                    <div className="px-6 overflow-hidden">SPACE</div>
                    <div className="px-6 overflow-hidden"></div>
                    <div className="px-6 overflow-hidden flex justify-center"></div>
                    <div />
                </div>
                {page.data.map((invite) => (
                    <div
                        key={invite.id}
                        className="grid grid-cols-6 text-gray-700 hover:bg-primary-50 text-sm space-x-4 bg-white">
                        <div className="col-span-2 flex flex-row overflow-hidden">
                            <div className="flex flex-row items-center px-4">
                                {invite.email && invite.mailed && (
                                    <div className="p-1.5">
                                        <Icons.Mail.Sent className="w-5 h-5 text-gray-500" />
                                    </div>
                                )}
                                {invite.email && !invite.mailed && (
                                    <Button
                                        disabled={loading.includes(invite.id)}
                                        onClick={handleMailInvite(invite)}
                                        variant="icon"
                                        color="clear">
                                        <Icons.Mail.Send className="w-5 h-5 hover:text-primary-500" />
                                    </Button>
                                )}
                                {invite.link && (
                                    <div className="p-1.5">
                                        <Icons.Link className="w-5 h-5 text-gray-500" />
                                    </div>
                                )}
                            </div>
                            <div className="flex flex-1 items-center overflow-hidden">
                                <p className="truncate font-semibold text-sm">
                                    {invite.email && invite.email}
                                    {invite.link && invite.link}
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-row items-center overflow-hidden">
                            {invite.space && (
                                <p
                                    role="button"
                                    className="truncate px-2 font-semibold"
                                    onClick={handleOpenSpace(invite.space)}>
                                    {invite.space.name}
                                </p>
                            )}
                        </div>
                        <div className="px-6 py-3 overflow-hidden">
                            <div
                                role="button"
                                onClick={handleOpenUser(invite.user)}
                                className="flex flex-row items-center">
                                <div className="flex flex-col">
                                    <span className="text-primary-700 px-2 font-semibold">
                                        @{invite.user.username}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-row items-center justify-center px-6">
                            <span className="text-xs font-semibold">
                                {moment(invite.expire_at).format("l")}
                            </span>
                        </div>
                        <div className="flex space-x-2 flex-row items-center justify-end px-6">
                            <Button
                                disabled={loading.includes(invite.id)}
                                onClick={handleDeleteInvite(invite)}
                                variant="icon"
                                color="clear">
                                <Icons.Delete />
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
            <div className="flex flex-row justify-end p-2">
                <Pagination
                    variant="outlined"
                    page={page.page_number}
                    count={page.total_pages}
                    onChange={handlePageChange}
                />
            </div>
        </Layout>
    );
});
