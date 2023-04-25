import React, { useState, useEffect } from "react";
import Layout from "@console/Layout";
import { io } from "@console/types";
import client from "@console/client";
import { useParams } from "react-router-dom";
import Roles from "./Roles";
import Profile from "./Profile";
import UserSpaces from "./Workspaces";

export default React.memo(() => {
    const params = useParams<{ user_id: string }>();
    const [user, setUser] = useState<io.Account>();
    useEffect(() => {
        if (!user) {
            getUserAccount();
        }
    }, [user]);

    function getUserAccount() {
        return client
            .getAccount({ user_id: params.user_id! })
            .then((data) => setUser(data))
            .catch(() => {});
    }

    if (!user) return <></>;
    return (
        <Layout title={user.name} className="block p-4 space-y-4">
            <Profile user={user} />
            <Roles roles={user.roles} />
            <UserSpaces id={params.user_id!} />
        </Layout>
    );
});
