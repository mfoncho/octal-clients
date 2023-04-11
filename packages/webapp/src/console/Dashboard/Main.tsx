import React, { useState, useEffect } from "react";
import Layout from "@console/Layout";
import { Link } from "react-router-dom";
import { io } from "@console/types";
import * as Icons from "@colab/icons";
import client from "@console/client";
import paths from "@console/paths";
import usersmodule from "@console/Users";
import spacesmodule from "@console/Spaces";

const defaultWorkspaceCounters = {
    users: 0,
    tasks: 0,
    records: 0,
    topics: 0,
    spaces: 0,
    messages: 0,
    done_tasks: 0,
    checked_records: 0,
};

export interface IInfoRecord {
    name: string;
    count: number;
    icon?:
        | React.FC<React.HTMLAttributes<any>>
        | React.Component<React.HTMLAttributes<any>>
        | React.PureComponent<React.HTMLAttributes<any>>
        | any;
}

export interface ILinkRecord extends IInfoRecord {
    name: string;
    count: number;
    path: string;
}

function BlankIcon(_props: any) {
    return <></>;
}

function InfoRecord(props: IInfoRecord) {
    const Icon = props.icon ?? BlankIcon;

    return (
        <div className="flex flex-col overflow-hidden shadow rounded-lg bg-white">
            <div className="flex flex-row p-4 items-center">
                <div className="flex justify-center items-center rounded-lg w-12 h-12 bg-primary-500 text-white">
                    <Icon className="h-6 w-6" />
                </div>
                <div className="flex flex-col px-4">
                    <div>
                        <span className="font-semibold text-base text-gray-600">
                            {props.name}
                        </span>
                    </div>
                    <div>
                        <span className="font-bold text-xl text-gray-800">
                            {props.count}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}

function LinkRecord(props: ILinkRecord) {
    const Icon = props.icon ?? BlankIcon;
    return (
        <Link
            to={props.path}
            className="flex flex-col overflow-hidden shadow rounded-lg bg-white hover:bg-gray-100">
            <div className="flex flex-row p-4 items-center">
                <div className="flex justify-center items-center rounded-lg w-12 h-12 bg-primary-500 text-white">
                    <Icon className="h-8 w-8" />
                </div>
                <div className="flex flex-col px-4">
                    <div>
                        <span className="font-semibold text-md text-gray-600">
                            {props.name}
                        </span>
                    </div>
                    <div>
                        <span className="font-bold text-2xl text-gray-800">
                            {props.count}
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
}

export default function Main() {
    const [counters, setCounters] = useState<io.WorkspaceCounters>(
        defaultWorkspaceCounters
    );
    useEffect(() => {
        getCounters();
    }, []);

    useEffect(() => {
        const timeout = setTimeout(getCounters, 30000);
        return () => {
            clearTimeout(timeout);
        };
    }, []);

    function getCounters(): any {
        return client
            .getWorkspaceCounters()
            .then((data) => {
                setCounters(data);
            })
            .catch(getCounters);
    }

    const linkRecords: ILinkRecord[] = [];

    const infoRecords: IInfoRecord[] = [];

    linkRecords.push({
        name: "Users",
        path: paths.users,
        count: counters.users,
        icon: usersmodule.icon,
    });

    linkRecords.push({
        name: "Spaces",
        path: paths.spaces,
        count: counters.spaces,
        icon: spacesmodule.icon,
    });

    infoRecords.push({
        name: "Topics",
        icon: Icons.Topic,
        count: counters.topics,
    });

    infoRecords.push({
        name: "Messages",
        icon: Icons.Chat,
        count: counters.messages,
    });

    infoRecords.push({
        name: "Records",
        icon: Icons.Board,
        count: counters.records,
    });

    infoRecords.push({
        name: "Completed",
        icon: Icons.Complete,
        count: counters.checked_records,
    });

    infoRecords.push({
        name: "Tasks",
        icon: Icons.Task,
        count: counters.tasks,
    });

    infoRecords.push({
        name: "Done",
        icon: Icons.Task.DoneSolid,
        count: counters.done_tasks,
    });

    return (
        <Layout className="flex flex-col p-4 bg-slate-200">
            <div className="grid grid-cols-2 gap-4 py-4">
                {linkRecords.map((lrecord) => (
                    <LinkRecord key={lrecord.name} {...lrecord} />
                ))}
            </div>
            <div className="grid grid-cols-3 gap-4 py-4">
                {infoRecords.map((lrecord) => (
                    <InfoRecord key={lrecord.name} {...lrecord} />
                ))}
            </div>
        </Layout>
    );
}
