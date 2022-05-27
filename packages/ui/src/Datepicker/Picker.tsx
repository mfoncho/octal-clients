import React, { useEffect, useState } from "react";
import Calendar, { ISelectEvent } from "./Calendar";
import UIEvent from "../event";
import { Base } from "../Button";

export interface IChangeEvent {
    event: React.MouseEvent;
    target: { value: string };
}

export interface IPicker {
    value?: string | null;
    time?: boolean;
    disabled?: boolean;
    clear?: string | React.ReactNode;
    confirm?: string | React.ReactNode;
    onChange: (e: UIEvent) => void;
    onClear?: (e: React.MouseEvent) => void;
}

function getTime(date: Date): string {
    let hr = date.getHours().toString();
    let min = date.getMinutes().toString();
    if (hr.length === 1) {
        hr = "0" + hr;
    }
    if (min.length === 1) {
        min = "0" + min;
    }
    return `${hr}:${min}`;
}

export default function Picker({
    value,
    onChange,
    onClear,
    confirm = "Okay",
    clear = "Clear",
    disabled = false,
    ...props
}: IPicker) {
    const [time, setTime] = useState("");
    const [date, setDate] = useState<null | Date>(null);
    const [dvalue, setDvalue] = useState<null | string>(null);
    const [datetime, setDatetime] = useState(value);

    useEffect(() => {
        if (value) {
            let date = new Date(value);
            setDate(date);
            if (props.time) {
                setTime(getTime(date));
            } else {
                setTime("00:00");
            }
            setDvalue(date.toISOString());
        } else {
            setTime("");
            setDate(null);
            setDvalue(null);
        }
    }, [value]);

    useEffect(() => {
        if (date && Boolean(time)) {
            let [hh, mm] = time.split(":");
            const hr = parseInt(hh);
            const min = parseInt(mm);
            const dt = new Date(date.toISOString());
            dt.setHours(hr);
            dt.setMinutes(min);
            setDatetime(dt.toISOString());
        } else {
            setDatetime(null);
        }
    }, [date, time]);

    function handleSetTime(e: any) {
        setTime(e.target.value);
        if (!Boolean(date)) {
            setDate(new Date());
        }
    }

    function handleSetDate({ target: { value } }: ISelectEvent) {
        setDate(value);
        if (!Boolean(time)) {
            if (props.time) {
                setTime("23:59");
            } else {
                setTime("00:00");
            }
        }
    }

    function handleChangeValue(event: React.MouseEvent) {
        if (datetime) {
            onChange(UIEvent.create({ value: datetime }, event));
        }
    }

    return (
        <div className="flex flex-col rounded-md">
            <div className="flex flex-col p-4">
                <Calendar selected={date} onSelect={handleSetDate} />
                {props.time && (
                    <input
                        type="time"
                        value={time}
                        className="form-input font-semibold text-base text-gray-600 rounded-md my-2 flex flex-grow"
                        onChange={handleSetTime}
                    />
                )}
            </div>
            <div className="flex flex-row items-center p-2">
                {onClear ? (
                    <>
                        <Base
                            onClick={onClear}
                            disabled={!Boolean(dvalue) || disabled}
                            disabledClass="bg-gray-50 text-gray-400"
                            activeClass=" text-gray bg-gray-100"
                            className="flex-grow mx-2 rounded-md py-2 font-semibold text-center">
                            {clear}
                        </Base>
                        <Base
                            disabled={
                                !Boolean(datetime) ||
                                dvalue == datetime ||
                                disabled
                            }
                            onClick={handleChangeValue}
                            disabledClass="bg-gray-50 text-gray-400"
                            activeClass="text-white bg-primary-500"
                            className="flex-grow mx-2 rounded-md py-2 font-semibold text-center">
                            {confirm}
                        </Base>
                    </>
                ) : (
                    <Base
                        disabled={
                            !Boolean(datetime) || dvalue == datetime || disabled
                        }
                        onClick={handleChangeValue}
                        disabledClass="bg-gray-50 text-gray-400"
                        activeClass="text-white bg-primary-500"
                        className="flex-grow mx-2 rounded-md py-2 font-semibold text-center">
                        {confirm}
                    </Base>
                )}
            </div>
        </div>
    );
}
