import React, { useState, useEffect } from "react";
import { Label } from "@octal/ui";
import * as Icons from "@octal/icons";
import Pagination from "@material-ui/lab/Pagination";
import { Page } from "src/types";
import Layout from "@console/Layout";
import client, { FetchUsersRequest } from "@console/client";
import { io } from "@console/types";
import { useLocation, useNavigate } from "react-router-dom";
import { useNavigator } from "@console/hooks";

const defaultPage: Page<io.User> = {
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

    useEffect(() => {
        const params: FetchUsersRequest = {};
        const query = new URLSearchParams(location.search);
        const page = query.has("page") ? parseInt(query.get("page") || "1") : 1;
        params.page = page;
        const name = query.has("name") ? query.get("name") || "" : "";
        if (name.trim() != "") {
            params.name = name.trim();
        }
        const email = query.has("email") ? query.get("email") || "" : "";
        if (email.trim() != "") {
            params.email = email.trim();
        }

        const limit = query.has("limit") ? query.get("limit") || "" : "";
        if (limit.trim() != "" && parseInt(limit)) {
            params.limit = limit.trim();
        }
        fetchPageUsers(params);
    }, [location.search]);

    function fetchPageUsers(params: FetchUsersRequest) {
        client
            .fetchUsers(params)
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

    return (
        <Layout className="flex flex-grow flex-col p-4 bg-slate-200">
            <table className="p-2 rounded-md overflow-hidden shadow">
                <thead className="bg-gray-50">
                    <tr>
                        <th scope="col px-6 py-3">
                            <div className="px-6 text-left text-xs font-medium text-gray-500 uppercase">
                                User
                            </div>
                        </th>
                        <th scope="col" className="text-center px-6 py-3">
                            <div className="text-xs font-medium text-gray-500 uppercase">
                                EMAIL
                            </div>
                        </th>
                        <th scope="col" className="text-center px-6 py-3">
                            <div className="text-xs font-medium text-gray-500 uppercase">
                                STATUS
                            </div>
                        </th>
                        <th
                            scope="col"
                            className="flex flex-row justify-end px-6 py-3">
                            <span className="text-xs font-medium text-gray-500 uppercase">
                                VERIFIED
                            </span>
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {page.data.map((user) => (
                        <tr
                            key={user.id}
                            role="button"
                            className="hover:bg-primary-50 text-sm"
                            onClick={handleOpenUser(user)}>
                            <td className="px-6 py-3">
                                <div className="flex flex-row items-center">
                                    <img
                                        alt={user.name}
                                        src={user.avatar}
                                        className="inline-block h-8 w-8 rounded-full"
                                    />
                                    <div className="flex flex-col">
                                        <span className="px-4 font-semibold">
                                            {user.name}
                                        </span>
                                        <span className="px-4 font-semibold text-primary-500">
                                            @{user.username}
                                        </span>
                                    </div>
                                </div>
                            </td>
                            <td className="text-center px-6 py-3">
                                <span className="">{user.email}</span>
                            </td>
                            <td className="text-center px-6 py-3">
                                <span>
                                    <Label
                                        color={
                                            user.suspended ? "red" : "green"
                                        }>
                                        {user.suspended
                                            ? "Suspended"
                                            : "Active"}
                                    </Label>
                                </span>
                            </td>
                            <td className="text-center px-6 py-3">
                                {user.verified && (
                                    <Icons.VerifiedBadge className="text-green-800" />
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
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
