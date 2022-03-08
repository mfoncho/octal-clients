import React, { useState, useEffect } from "react";
import Layout from "@console/Layout";
import { Avatar } from "@octal/ui";
import { io } from "@console/types";
import client from "@console/client";
import { useParams } from "react-router-dom";
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
        <Layout
            icon={<Avatar alt={user.name} src={user.avatar} />}
            title={user.name}
            className="flex flex-col p-4">
            <div className="pb-8">
                <Profile user={user} />
            </div>
            <UserSpaces id={params.user_id!} />
        </Layout>
    );
});
