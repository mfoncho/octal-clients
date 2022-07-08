import React, { useState, useEffect, useRef } from "react";
import { List } from "immutable";
import Field, { IField } from "./Field";
import * as Icons from "@octal/icons";
import { MdCancel as CancelIcon } from "react-icons/md";
import { useFieldAction } from "@workspace/Board/hooks";
import { useInput } from "src/utils";
import { useAuthId } from "@octal/store";
import { Text, Textarea } from "@octal/ui";
import MembersPopper from "@workspace/Space/MembersPopper";
import { useCardCapability } from "../hooks";
import {
    CardTaskValueRecord,
    CardFieldRecord,
    MemberRecord,
    useUser,
} from "@octal/store";

export interface IEdit {
    value: string;
    disabled?: boolean;
    onClose: (...e: any) => void;
    onSubmit: (value: string) => void;
}

export interface IUserValue {
    value: CardTaskValueRecord;
}

export interface ITaskParams {
    done: boolean;
    name: string;
}

export interface ITaskCreator {
    field: CardFieldRecord;
    onSubmit: (params: ITaskParams) => void;
}

export interface ITask {
    task: CardTaskValueRecord;
    onCheck?: (id: string, checked: boolean) => void;
    onUpdate?: (id: string, params: Partial<ITaskParams>) => void;
    onDelete?: (id: string) => void;
}

function Task({ task, ...props }: ITask) {
    const [edit, setEdit] = useState(false);
    const name = useInput(task.name);

    useEffect(() => {
        name.setValue(task.name);
    }, [task.name]);

    function handleKeyPress(e: any) {
        handleSubmit();
    }

    function handleDelete() {
        if (props.onDelete) {
            props.onDelete(task.id);
        }
    }

    function handleCheckTask() {
        if (props.onCheck) {
            props.onCheck(task.id, !task.done);
        }
    }

    function handleSubmit() {
        if (props.onUpdate) {
            props.onUpdate(task.id, { name: name.value });
            setEdit(false);
        }
    }

    function handleBlur() {
        setEdit(false);
    }

    return (
        <div className="group flex py-0.5 flex-row items-center rounded-md hover:bg-gray-100">
            <div className="flex flex-grow flex-row items-center">
                <button onClick={handleCheckTask}>
                    {task.done ? (
                        <Icons.Task.DoneSolid className="h-5 w-5 text-primary-500" />
                    ) : (
                        <Icons.Task.Undone className="h-5 w-5 text-primary-500" />
                    )}
                </button>
                {edit ? (
                    <Textarea.Input
                        onBlur={handleBlur}
                        autoFocus={true}
                        className="flex-1 rounded mx-1 px-1 py-0 focus:outline-none font-semibold text-gray-700 text-sm"
                        onSubmit={handleKeyPress}
                        {...name.props}
                    />
                ) : (
                    <span className="rounded px-2 focus:outline-none font-semibold text-gray-700 text-sm">
                        <Text>{task.name}</Text>
                    </span>
                )}
            </div>
            {!edit && (
                <div className="flex flex-row items-center">
                    {props.onUpdate && (
                        <button
                            onClick={() => setEdit(true)}
                            className="group-hover:visible invisible mr-2">
                            <Icons.Edit className="h-4 w-4 text-gray-500" />
                        </button>
                    )}
                    {props.onDelete && (
                        <button
                            className="group-hover:visible invisible"
                            onClick={handleDelete}>
                            <Icons.CloseCircleSolid className="h-4 w-4 text-gray-500" />
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}

function AddTask({ onSubmit }: ITaskCreator) {
    const [open, setOpen] = useState(false);
    const name = useInput("");

    function handleSubmit() {
        onSubmit({ done: false, name: name.value });
        name.setValue("");
    }

    function handleClose() {
        setOpen(false);
        name.setValue("");
    }

    function handleBlur() {
        if (name.value == "") {
            handleClose();
        }
    }

    if (open) {
        return (
            <div className="flex flex-row items-center mb-1">
                <div className="flex flex-grow flex-row items-center">
                    <Icons.Task.Undone className="h-5 w-5 text-primary-500" />

                    <Textarea.Input
                        onBlur={handleBlur}
                        autoFocus={true}
                        onSubmit={handleSubmit}
                        className="flex-1 rounded mx-1 px-1 py-0  focus:outline-none font-semibold text-gray-700 text-sm"
                        {...name.props}
                    />
                </div>
                <button onClick={handleClose}>
                    <CancelIcon className="h-4 w-4 text-gray-500" />
                </button>
            </div>
        );
    }
    return (
        <div>
            <button
                onClick={() => setOpen(true)}
                className="group rounded-md bg-gray-100 text-sm font-semibold text-gray-700">
                <Icons.Task.Add className="group-hover:hidden h-5 w-5 text-primary-500" />
                <Icons.Task.AddSolid className="group-hover:block h-5 w-5 text-primary-500 hidden" />
            </button>
        </div>
    );
}

const User = React.memo<{ id: string }>((props) => {
    const user = useUser(props.id);
    return (
        <span className="text-primary-700 pr-4 text-sm font-semibold cursor-pointer">
            @{user.username}
        </span>
    );
});

export default function ChecklistField({ field, handle, ...props }: IField) {
    const fieldRef = useRef<HTMLButtonElement>(null);

    const aid = useAuthId();

    const [popper, setPopper] = useState<boolean>(false);

    const can = useCardCapability(field.card_id);

    const actions = useFieldAction(field);

    const users = field.users.toJS() as string[];

    const tasks = field.values as any as List<CardTaskValueRecord>;

    function handleCreateTask(params: ITaskParams) {
        return actions.createFieldValue(params);
    }

    function handleDeleteTask(id: string) {
        return actions.deleteFieldValue(id);
    }

    function handleCheckTask(id: string, checked: boolean) {
        if (users.includes(aid)) {
            return handleUpdateTask(id, { done: checked });
        }
    }

    function handleUpdateTask(id: string, params: Partial<ITaskParams>) {
        return actions.updateFieldValue(id, params);
    }

    function handleTogglePopper() {
        setPopper((editing) => !editing);
    }

    function handleUserInput(member: MemberRecord) {
        if (users.includes(member.user_id)) {
            return actions.unassignUser(member.user_id);
        } else {
            return actions.assignUser(member.user_id);
        }
    }

    return (
        <Field
            handle={handle}
            onClick={handleTogglePopper}
            dragging={props.dragging}
            icon={Icons.Field.Users}
            buttonRef={fieldRef}
            field={field}>
            <div className="flex-1 flex flex-col px-1">
                <div className="flex flex-row pb-1">
                    {users.map((id) => (
                        <User key={id} id={id} />
                    ))}
                </div>
                {tasks.map((task) => (
                    <Task
                        key={task.id}
                        task={task}
                        onCheck={handleCheckTask}
                        {...can("card.manage", {
                            onUpdate: handleUpdateTask,
                            onDelete: handleDeleteTask,
                        })}
                    />
                ))}
                {can(
                    "card.manage",
                    <div className="py-1 flex flex-col">
                        <AddTask field={field} onSubmit={handleCreateTask} />
                    </div>
                )}
            </div>
            {can(
                "card.manage",
                <MembersPopper
                    placement="right-start"
                    selected={users}
                    onSelect={handleUserInput}
                    anchorEl={fieldRef.current}
                    onClickAway={handleTogglePopper}
                    open={popper}
                />
            )}
        </Field>
    );
}
