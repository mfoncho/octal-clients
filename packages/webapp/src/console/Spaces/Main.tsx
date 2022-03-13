import React, { useState, useEffect } from "react";
import { useInput } from "src/utils";
import moment from "moment";
import * as Icons from "@octal/icons";
import { SearchInput, Label } from "@octal/ui";
import Pagination from "@material-ui/lab/Pagination";
import { Page } from "src/types";
import Layout from "@console/Layout";
import client, { FetchBoardsRequest } from "@console/client";
import { io } from "@console/types";
import { useLocation, useNavigate } from "react-router-dom";
import { useNavigator } from "@console/hooks";

const defaultPage: Page<io.Space> = {
    data: [],
    page_size: 0,
    page_number: 0,
    total_pages: 0,
    total_count: 0,
};

export default React.memo(() => {
    const search = useInput("");
    const navigate = useNavigate();
    const location = useLocation();
    const navigator = useNavigator();
    const [page, setPage] = useState(defaultPage);

    useEffect(() => {
        const params: FetchBoardsRequest = {};
        const query = new URLSearchParams(location.search);
        const page = query.has("page") ? parseInt(query.get("page") || "1") : 1;
        params.page = page;
        const name = query.has("name") ? query.get("name") || "" : "";
        if (name.trim() != "") {
            params.name = name.trim();
        }

        const limit = query.has("limit") ? query.get("limit") || "" : "";
        if (limit.trim() != "" && parseInt(limit)) {
            params.limit = limit.trim();
        }
        fetchPageUsers(params);
    }, [location.search]);

    function fetchPageUsers(params: FetchBoardsRequest) {
        client
            .fetchSpaces(params)
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

    function handleOpenSpace(board: io.Space) {
        return () => {
            navigator.openSpace(board);
        };
    }

    return (
        <Layout className="flex flex-grow flex-col p-2">
            <table className="p-2">
                <thead className="bg-gray-50">
                    <tr>
                        <th scope="col px-6 py-3">
                            <div>
                                <SearchInput {...search.props} />
                            </div>
                        </th>
                        <th scope="col" className="text-center px-6 py-3">
                            <div className="text-xs font-medium text-gray-500 uppercase">
                                ACCESS
                            </div>
                        </th>
                        <th scope="col" className="text-right px-6 py-3">
                            <div className="text-xs font-medium text-gray-500 uppercase">
                                CREATED
                            </div>
                        </th>
                        <th scope="col" className="text-center px-6 py-3">
                            <div className="text-xs font-medium text-gray-500 uppercase">
                                ACTIONS
                            </div>
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {page.data.map((space) => (
                        <tr
                            key={space.id}
                            onClick={handleOpenSpace(space)}
                            className="hover:bg-primary-50 text-sm">
                            <td className="px-6 py-3">
                                <div className="flex flex-row items-center">
                                    <div className="w-8 h-8 flex justify-center items-center text-white bg-primary-500 rounded-lg">
                                        <Icons.Space />
                                    </div>
                                    <span className="px-4 font-semibold">
                                        {space.name}
                                    </span>
                                </div>
                            </td>
                            <td className="text-center px-6 py-2">
                                <span>
                                    <Label color="green">{space.access}</Label>
                                </span>
                            </td>
                            <td className="text-right px-6 py-3">
                                <span className="text-xs text-gray-500 font-medium">
                                    {moment(space.created_at).format("ll")}
                                </span>
                            </td>
                            <td className="text-center px-6 py-3"></td>
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
