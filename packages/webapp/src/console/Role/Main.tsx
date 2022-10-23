import React, { useState, useEffect } from "react";
import clx from "classnames";
import Permissions from "./Role";
import Display from "./Display";
import Users from "./Users";
import { io } from "@console/types";
import client from "@console/client";
import { useParams } from "react-router-dom";
import { Dialog, Button, Flow, Text } from "@colab/ui";
import Layout from "@console/Layout";

interface ICustomize {
    loading?: boolean;
    name: string;
    onConfirm?: (e: React.MouseEvent) => void;
}

function deleteText(name: string) {
    return `Delete custom role (__${name}__). 

Customized permissions will be lost permantly.
###### Are you sure you want to proceed`;
}

const DeleteRoleDialog = Dialog.create<ICustomize>((props) => {
    return (
        <Dialog.Warning
            open={props.open}
            title={`Delete Role`}
            onClose={props.loading ? undefined : props.onClose}
            disabled={props.loading}
            onConfirm={props.onConfirm as any}>
            {deleteText(props.name)}
        </Dialog.Warning>
    );
});

const tabs = [
    {
        name: "Display",
        value: "display",
        comp: Display,
    },
    {
        name: "Permissions",
        value: "permissions",
        comp: Permissions,
    },
    {
        name: "Users",
        value: "users",
        comp: Users,
    },
];

export default React.memo(() => {
    const params = useParams<{ role_id: string }>();
    const [tab, setTab] = useState<string>("display");
    const [role, setRole] = useState<io.Role>();

    useEffect(() => {
        if (!role) {
            getRole();
        }
    }, [Boolean(role)]);

    function getRole() {
        client.getRole(params as any).then((data) => {
            setRole(data);
        });
    }

    if (!role) {
        return <div />;
    }

    return (
        <Layout
            icon={
                <span className="text-lg">
                    <Text>{role.icon}</Text>
                </span>
            }
            title={
                <span className="text-base font-semibold">
                    <Text>{role.name}</Text>
                </span>
            }
            className="bg-slate-200 flex flex-col flex-grow pb-10">
            <div className="flex flex-row items-center py-2 px-4">
                {tabs.map((t) => (
                    <div key={t.value} className="flex flex-col">
                        <Button color="clear" onClick={() => setTab(t.value)}>
                            {t.name}
                        </Button>
                        <div
                            className={clx("h-1 bg-primary-500", {
                                "bg-primary-500": t.value == tab,
                                "bg-gray-200": t.value != tab,
                            })}
                        />
                    </div>
                ))}
            </div>
            <div className="flex-1 overflow-y-auto block px-4">
                <Flow.Switch value={tab}>
                    {tabs.map((tab) => (
                        <Flow.Case key={tab.value} value={tab.value}>
                            {React.createElement(tab.comp, {
                                role: role,
                                updateRole: setRole,
                            })}
                        </Flow.Case>
                    ))}
                </Flow.Switch>
            </div>
        </Layout>
    );
});
