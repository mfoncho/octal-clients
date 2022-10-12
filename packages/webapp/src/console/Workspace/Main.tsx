import React, { useState, useEffect } from "react";
import { ImageInput, Button } from "@colab/ui";
import client from "@console/client";
import { io } from "@console/types";
import { useInput } from "src/utils";
import Layout from "@console/Layout";

const noop = () => {};

export default React.memo(() => {
    const [workspace, setWorkspace] = useState<io.Workspace>();
    const [loading, setLoading] = useState(false);

    const name = useInput("");

    const icon = useInput<string | null>(null);

    useEffect(() => {
        loadWorkspace();
    }, []);

    function loadWorkspace() {
        client
            .getWorkspace()
            .then((data) => {
                setWorkspace(data);
            })
            .catch(noop);
    }

    function handleUpdateWorkspace() {
        client
            .updateWorkspace({
                name: name.value.trim(),
                icon: Boolean(icon.value) ? icon.value! : undefined,
            })
            .then((data) => {
                setWorkspace(data);
                icon.setValue(null);
            })
            .catch(noop)
            .finally(() => {
                setLoading(false);
            });
        setLoading(true);
    }

    useEffect(() => {
        if (workspace) {
            name.setValue(workspace.name);
        }
    }, [workspace]);

    if (!workspace) return null;

    let valid = name.value.trim() != workspace.name || icon.valid;
    valid = valid && name.value.trim().length > 2;

    return (
        <Layout className="flex flex-grow flex-col p-2">
            <div className="flex flex-col p-4">
                <div className="flex flex-row justify-center">
                    <div className="mt-1 flex flex-col justify-center items-center">
                        <ImageInput
                            id="logo-input"
                            value={icon.value}
                            onChange={icon.setValue}
                            className="w-24 h-24 rounded-lg shadow"
                            placeholder={workspace.icon}
                        />

                        <label
                            htmlFor="logo-input"
                            className="mt-5 bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            Change
                        </label>
                    </div>
                </div>
                <div className="flex flex-col">
                    <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-700">
                        Name
                    </label>
                    <input
                        type="text"
                        name="name"
                        autoComplete="workspace-name"
                        className="mt-1 p-2 font-bold focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        {...name.props}
                    />
                </div>
                <div className="flex flex-row py-4 justify-end">
                    <Button
                        onClick={handleUpdateWorkspace}
                        disabled={!valid || loading}
                        color="primary">
                        Save
                    </Button>
                </div>
            </div>
        </Layout>
    );
});
