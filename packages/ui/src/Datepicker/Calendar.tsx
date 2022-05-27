import React, { useState, useEffect } from "react";
import UIEvent, { Target } from "../event";
const MONTH_NAMES = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export type ISelectEvent = UIEvent<Target<Date>>;

export interface ICalendar {
    selected?: Date | Date[] | null;
    onSelect?: (event: UIEvent<Target<Date>>) => void;
}

export default function Calendar(props: ICalendar) {
    const [year, setYear] = useState<number>(0);
    const [days, setDays] = useState<number[]>([]);
    const [month, setMonth] = useState<number>(1);
    const [today, setToday] = useState<number>(0);
    const [blanks, setBlanks] = useState<number[]>([]);

    useEffect(() => {
        let today = new Date();
        let month = today.getMonth();
        let year = today.getFullYear();
        setYear(year);
        setMonth(month);
    }, []);

    useEffect(() => {
        updateDays();
    }, [month]);

    function nextMonth() {
        if (month == 11) {
            setMonth(0);
            setYear(year + 1);
        } else {
            setMonth(month + 1);
        }
    }

    function prevMonth() {
        if (month == 0) {
            setMonth(11);
            setYear(year - 1);
        } else {
            setMonth(month - 1);
        }
    }

    function updateDays() {
        let daysInMonth = new Date(year, month + 1, 0).getDate();

        // find where to start calendar day of week
        let dayOfWeek = new Date(year, month).getDay();
        let blankdaysArray = [];
        for (let i = 1; i <= dayOfWeek; i++) {
            blankdaysArray.push(i);
        }

        let daysArray = [];
        for (let i = 1; i <= daysInMonth; i++) {
            daysArray.push(i);
        }

        const today = new Date();
        if (today.getMonth() == month && today.getFullYear() == year) {
            setToday(today.getDate());
        } else {
            setToday(-1);
        }

        setBlanks(blankdaysArray);
        setDays(daysArray);
    }

    function renderDay(day: number) {
        let className = "";
        let { selected } = props;
        const date = new Date(year, month, day);
        const onClick = (event: React.MouseEvent) => {
            if (props.onSelect) {
                props.onSelect(UIEvent.create({ value: date }, event));
            }
        };
        if (selected && !Array.isArray(selected)) {
            selected = [selected];
        } else {
            selected = [];
        }

        selected = selected.find((d) => {
            return (
                d.getFullYear() == date.getFullYear() &&
                d.getMonth() == date.getMonth() &&
                d.getDate() == date.getDate()
            );
        });

        if (selected) {
            className =
                "w-full h-full cursor-pointer bg-primary-600 text-white text-center text-sm leading-none rounded-full leading-loose";
        } else {
            className =
                today === day
                    ? "w-full h-full cursor-pointer bg-primary-100 text-center text-sm leading-none rounded-full leading-loose"
                    : "w-full h-full cursor-pointer text-center text-sm leading-none rounded-full leading-loose transition ease-in-out duration-100";
        }
        return (
            <button onClick={onClick} className={className}>
                {day}
            </button>
        );
    }

    return (
        <div className="w-64 h-64">
            <div className="flex justify-between items-center mb-2">
                <div>
                    <span className="text-lg font-bold text-gray-800">
                        {MONTH_NAMES[month]}
                    </span>
                    <span className="ml-1 text-lg text-gray-600 font-normal">
                        {year}
                    </span>
                </div>
                <div>
                    <button
                        type="button"
                        className="transition ease-in-out duration-100 inline-flex cursor-pointer hover:bg-gray-200 p-1 rounded"
                        onClick={prevMonth}>
                        <svg
                            className="h-6 w-6 text-gray-500 inline-flex"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M15 19l-7-7 7-7"
                            />
                        </svg>
                    </button>
                    <button
                        type="button"
                        className="transition ease-in-out duration-100 inline-flex cursor-pointer hover:bg-gray-200 p-1 rounded"
                        onClick={nextMonth}>
                        <svg
                            className="h-6 w-6 text-gray-500 inline-flex"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M9 5l7 7-7 7"
                            />
                        </svg>
                    </button>
                </div>
            </div>

            <div className="flex flex-wrap mb-3 -mx-1">
                {DAYS.map((day) => (
                    <div key={day} style={{ width: "14.26%" }} className="px-1">
                        <div className="text-gray-800 font-medium text-center text-xs">
                            {day}
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex flex-wrap -mx-1">
                {blanks.map((blank) => (
                    <div
                        key={blank}
                        style={{ width: "14.28%" }}
                        className="text-center border p-1 border-transparent text-sm"></div>
                ))}
                {days.map((day) => (
                    <div
                        key={day}
                        style={{ width: "14.28%" }}
                        className="px-1 mb-1">
                        {renderDay(day)}
                    </div>
                ))}
            </div>
        </div>
    );
}
