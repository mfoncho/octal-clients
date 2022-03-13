import React, { useState, useEffect } from "react";
import moment from "moment";
import { useInput } from "src/utils";
import { Button } from "@octal/ui";
import Pagination from "@material-ui/lab/Pagination";
import { Page } from "src/types";
import {
    MdOutlineEmail as MailIcon,
    MdOutlineMarkEmailRead as MailedIcon,
} from "react-icons/md";
import { RiMailSendFill as SendMailIcon } from "react-icons/ri";
import { IoMdLink as LinkIcon } from "react-icons/io";
import { BiTrash as DeleteIcon } from "react-icons/bi";
import Layout from "@console/Layout";
import client, { FetchInvitesRequest } from "@console/client";
import { io } from "@console/types";
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
        <Layout className="flex flex-grow flex-col p-2">
            <div className="flex flex flex-col divide-y divide-gray-100">
                <div className="grid grid-cols-6 py-4 text-gray-700 rounded-t-md text-sm font-semibold bg-gray-100">
                    <div className="px-6 overflow-hidden">USER</div>
                    <div className="px-6 overflow-hidden">SPACE</div>
                    <div className="col-span-2 px-6 overflow-hidden">
                        LINK/EMAIL
                    </div>
                    <div className="px-6 overflow-hidden flex justify-center">
                        EXIPRE
                    </div>
                    <div />
                </div>
                {page.data.map((invite) => (
                    <div
                        key={invite.id}
                        className="grid grid-cols-6 text-gray-700 hover:bg-primary-50 text-sm">
                        <div className="px-6 py-3 overflow-hidden">
                            <div
                                onClick={handleOpenUser(invite.user)}
                                className="flex flex-row items-center">
                                <img
                                    alt={invite.user.name}
                                    src={invite.user.avatar}
                                    className="inline-block h-8 w-8 rounded-full"
                                />
                                <div className="flex flex-col">
                                    <span className="px-2 font-semibold">
                                        {invite.user.username}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-row items-center overflow-hidden">
                            {invite.space && (
                                <p
                                    className="truncate px-2 font-semibold"
                                    onClick={handleOpenSpace(invite.space)}>
                                    {invite.space.name}
                                </p>
                            )}
                        </div>
                        <div className="col-span-2 flex flex-row overflow-hidden">
                            <div className="flex flex-row items-center px-4">
                                {invite.email && invite.mailed && (
                                    <MailedIcon className="w-5 h-5 text-gray-500" />
                                )}
                                {invite.email && !invite.mailed && (
                                    <MailIcon className="w-5 h-5 text-gray-500" />
                                )}
                                {invite.link && (
                                    <LinkIcon className="w-5 h-5 text-gray-500" />
                                )}
                            </div>
                            <div className="flex flex-1 items-center overflow-hidden">
                                <p className="truncate font-semibold text-sm">
                                    {invite.email && invite.email}
                                    {invite.link && invite.link}
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-row items-center justify-center px-6">
                            <span className="text-xs font-semibold">
                                {moment(invite.expire_at).format("l")}
                            </span>
                        </div>
                        <div className="flex space-x-2 flex-row items-center justify-end px-6">
                            {invite.email && !invite.mailed && (
                                <Button
                                    disabled={loading.includes(invite.id)}
                                    onClick={handleMailInvite(invite)}
                                    variant="icon"
                                    color="clear">
                                    <SendMailIcon className="w-5 h-5 hover:text-primary-500" />
                                </Button>
                            )}
                            <Button
                                disabled={loading.includes(invite.id)}
                                onClick={handleDeleteInvite(invite)}
                                variant="icon"
                                color="clear">
                                <DeleteIcon className="w-5 h-5 hover:text-red-600" />
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
