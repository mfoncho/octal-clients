import React, { useState } from "react";
import clx from "classnames";
import * as Icons from "@colab/icons";
import { Dialog, Button } from "@colab/ui";
import {
    useAuthId,
    SpaceRecord,
    SpacePermissions,
    useSpacePermissions,
} from "@colab/store";
import PerfectScrollbar from "react-perfect-scrollbar";
import GeneralManager from "./General";
import RolesPermissionsManager from "./Roles";
import InviationsManager from "./Invitations";
import MembersManager from "./Members";
import ShutdownManager from "./Shutdown";
import TopicsManager from "./Topics";

export interface SpaceManagerProps {
    space: SpaceRecord;
    permissions: SpacePermissions;
}

export interface SpaceManagerFilterParams extends SpaceManagerProps {}

interface ManagerModule {
    name: string;
    //filter: (params: SpaceManagerFilterParams) => boolean;
    //icon: React.FC<any> | React.ComponentClass<any, any>;

    manager:
        | React.FC<SpaceManagerProps>
        | React.ComponentClass<SpaceManagerProps, any>;
}

const managers: ManagerModule[] = [
    GeneralManager,
    MembersManager,
    TopicsManager,
    InviationsManager,
    RolesPermissionsManager,
    ShutdownManager,
];

const scrollbarOptions = {
    suppressScrollX: true,
};

interface IDialog {
    space: SpaceRecord;
}

export default Dialog.create<IDialog>((props) => {
    const { space } = props;

    const authid = useAuthId();

    const permissions = useSpacePermissions(space.id);

    const [Manager, setManager] = useState<
        | React.FC<SpaceManagerProps>
        | React.ComponentClass<SpaceManagerProps, any>
        | null
    >(GeneralManager.manager);

    function renderMenu(menu: ManagerModule, index: number) {
        const selected = menu.manager == Manager;

        const handleClick = () => setManager(() => menu.manager);

        const critical = menu.name.toLowerCase() == "shutdown";

        if ((space.admin_id !== authid || space.is_common) && critical) {
            return null;
        }
        return (
            <li
                key={String(index)}
                onClick={handleClick}
                role="button"
                className={clx(
                    "px-4 py-1.5 flex flex-row items-center rounded-md  my-px",
                    {
                        ["bg-red-100"]: selected && critical,
                        ["bg-slate-200"]: selected && !critical,
                        ["mt-4 text-red-600 hover:bg-red-50"]: critical,
                        ["text-slate-600 hover:bg-slate-50"]: !critical,
                    }
                )}>
                <span
                    className={clx("font-semibold text-base", {
                        ["text-slate-800"]: selected && !critical,
                        ["text-red-800"]: selected && critical,
                    })}>
                    {menu.name}
                </span>
            </li>
        );
    }

    return (
        <Dialog.Base
            open={props.open}
            maxWidth="md"
            fullWidth={true}
            className="h-5/6"
            onClose={props.onClose}>
            <div className="flex-1 flex flex-row justify-center overflow-hidden">
                <div className="flex rounded-l-lg bg-slate-100 flex-none w-3/12 flex-row justify-end">
                    <div className="flex-none flex flex-col w-56 ">
                        <div className="h-20 pl-8 pr-4 flex flex-row items-center">
                            <span className="font-semibold text-base text-gray-600">
                                {space.name}
                            </span>
                        </div>
                        <ul className="flex flex-col px-4">
                            {managers.map(renderMenu)}
                        </ul>
                    </div>
                </div>
                <div className="relative flex flex-1 flex-row">
                    <PerfectScrollbar
                        options={scrollbarOptions}
                        className="flex-1 flex flex-col">
                        {Manager ? (
                            <Manager space={space} permissions={permissions} />
                        ) : (
                            <div />
                        )}
                    </PerfectScrollbar>
                </div>
                <div className="absolute w-full h-20 items-center flex flex-row justify-end px-8">
                    <Button
                        onClick={props.onClose as any}
                        variant="icon"
                        className="bg-white"
                        color="clear">
                        <Icons.Close />
                    </Button>
                </div>
            </div>
        </Dialog.Base>
    );
});
