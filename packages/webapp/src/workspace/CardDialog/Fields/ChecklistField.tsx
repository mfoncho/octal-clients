import React, { useState, useEffect, useRef } from "react";
import { List } from "immutable";
import InfoIcon from "@material-ui/icons/Info";
import Field, { IField } from "./Field";
import * as Icons from "@octal/icons";
import { BiTrash as DeleteTaskIcon } from "react-icons/bi";
import { MdCancel as CancelIcon } from "react-icons/md";
import { useFieldAction } from "@workspace/Board/hooks";
import { useInput } from "src/utils";
import { KeyboardInputEvent } from "src/types";
import MembersPopper from "@workspace/Space/MembersPopper";
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
    onUpdate?: (id: string, params: Partial<ITaskParams>) => void;
    onDelete?: (id: string) => void;
}

function Task({ task, ...props }: ITask) {
    const [edit, setEdit] = useState(false);
    const name = useInput(task.name);

    useEffect(() => {
        name.setValue(task.name);
    }, [task.name]);

    function handleKeyPress(e: KeyboardInputEvent) {
        if (e.key == "Enter" && name.valid) {
            handleSubmit();
        }
    }

    function handleDelete() {
        if (props.onDelete) {
            props.onDelete(task.id);
        }
    }

    function handleToggleTask() {
        if (props.onUpdate) {
            props.onUpdate(task.id, { done: !task.done });
        }
    }

    function handleSubmit() {
        if (props.onUpdate) {
            props.onUpdate(task.id, { name: name.value });
            setEdit(false);
        }
    }

    function handleBlur() {
        if (name.valid) {
            handleSubmit();
        }
        setEdit(false);
    }

    return (
        <div className="group flex py-0.5 flex-row items-center rounded-md hover:bg-gray-100">
            <div className="flex flex-grow flex-row items-center">
                <input
                    type="checkbox"
                    checked={task.done}
                    className="focus:ring-transparent focus:outline-none form-checkbox h-4 w-4 text-primary-500 rounded"
                    onChange={handleToggleTask}
                />
                {edit ? (
                    <input
                        {...name.props}
                        onBlur={handleBlur}
                        autoFocus={true}
                        className="rounded px-2 focus:outline-none font-semibold text-gray-700 text-sm"
                        onKeyPress={handleKeyPress}
                    />
                ) : (
                    <span
                        onClick={() => setEdit(true)}
                        className="rounded px-2 focus:outline-none font-semibold text-gray-700 text-sm">
                        {task.name}
                    </span>
                )}
            </div>
            <button
                className="group-hover:visible invisible"
                onClick={handleDelete}>
                <DeleteTaskIcon className="h-4 w-4 text-gray-500" />
            </button>
        </div>
    );
}

function AddTask({ onSubmit }: ITaskCreator) {
    const [open, setOpen] = useState(false);
    const name = useInput("");

    function handleSubmit() {}

    function handleKeyPress(e: KeyboardInputEvent) {
        if (e.key == "Enter" && name.valid) {
            handleSubmit();
            onSubmit({ done: false, name: name.value });
            name.setValue("");
        }
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
            <div className="flex flex-row items-center">
                <div className="flex flex-grow flex-row items-center">
                    <input
                        type="checkbox"
                        className="form-checkbox h-4 w-4 text-primary-500 rounded"
                        disabled={true}
                        defaultChecked={false}
                    />

                    <input
                        {...name.props}
                        onBlur={handleBlur}
                        autoFocus={true}
                        className="rounded px-2 focus:outline-none font-semibold text-gray-700 text-sm"
                        onKeyPress={handleKeyPress}
                    />
                </div>
                <button onClick={handleClose}>
                    <CancelIcon className="h-4 w-4 text-gray-500" />
                </button>
            </div>
        );
    }
    return (
        <button
            onClick={() => setOpen(true)}
            className="rounded-md bg-gray-100 text-sm font-semibold text-gray-700">
            add task
        </button>
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

export default function ChecklistField({ field, handle }: IField) {
    const fieldRef = useRef<HTMLButtonElement>(null);

    const [popper, setPopper] = useState<boolean>(false);

    const actions = useFieldAction(field);

    const users = field.users.toJS() as string[];

    const tasks = field.values as any as List<CardTaskValueRecord>;

    function handleCreateTask(params: ITaskParams) {
        return actions.createFieldValue(params);
    }

    function handleDeleteTask(id: string) {
        return actions.deleteFieldValue(id);
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
            icon={Icons.Field.Checklist}
            field={field}
            buttonRef={fieldRef}
            onClick={handleTogglePopper}>
            <div className="flex-1 flex flex-col">
                <div className="flex flex-row pb-1">
                    {users.map((id) => (
                        <User key={id} id={id} />
                    ))}
                </div>
                {tasks.map((task) => (
                    <Task
                        key={task.id}
                        task={task}
                        onUpdate={handleUpdateTask}
                        onDelete={handleDeleteTask}
                    />
                ))}
                <div className="py-2 flex flex-col">
                    <AddTask field={field} onSubmit={handleCreateTask} />
                </div>
            </div>
            <MembersPopper
                selected={users}
                onSelect={handleUserInput}
                anchorEl={fieldRef.current}
                onClickAway={handleTogglePopper}
                open={popper}
            />
        </Field>
    );
}
