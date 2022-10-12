import React, { useState, useEffect } from "react";
import Layout from "@console/Layout";
import client from "@console/client";
import { io } from "@console/types";
import { Text, Button, Dialog } from "@colab/ui";
import { useNavigator } from "@console/hooks";
import CreateRoleDialog from "./RoleDialog";

export default React.memo(() => {
    const dialog = Dialog.useDialog();
    const [roles, setRoles] = useState<io.Role[]>([]);

    const navigator = useNavigator();

    useEffect(() => {
        loadRoles();
    }, []);

    async function loadRoles() {
        return client.fetchRoles().then((data) => {
            setRoles(data);
        });
    }

    function handleOpenRole(role: io.Role) {
        return () => {
            navigator.openRole(role);
        };
    }

    return (
        <Layout className="flex flex-grow flex-col p-4 bg-slate-200">
            <div className="flex flex-row py-4 justify-end items-center">
                <Button color="primary" onClick={dialog.opener("create")}>
                    Create
                </Button>
            </div>
            <div className="flex flex-col divide-y divide-solid divide-gray-200 rounded-md bg-white overflow-hidden shadow">
                {roles.map((role) => (
                    <div
                        key={role.id}
                        role="button"
                        onClick={handleOpenRole(role)}
                        className="hover:bg-primary-50 py-4">
                        <span className="px-4 font-semibold">
                            <span className="px-2">
                                <Text>{role.icon}</Text>
                            </span>
                            <span>{role.name}</span>
                        </span>
                    </div>
                ))}
            </div>
            <CreateRoleDialog open={dialog.create} onClose={dialog.close} />
        </Layout>
    );
});
