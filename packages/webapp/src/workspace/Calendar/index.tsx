import React, { useState, useEffect, useMemo } from "react";
import clx from "classnames";
import Header from "./Header";
import { List } from "immutable";
import { MdOutlineArrowBackIosNew as BackIcon } from "react-icons/md";
import { Calendar, Button, Popper, Text } from "@octal/ui";
import { UseCards } from "@workspace/Records";
import moment from "moment";
import cal from "@octal/calendar";
import PerfectScrollbar from "react-perfect-scrollbar";
import CardDialog from "@workspace/CardDialog";
import * as CalendarActions from "@octal/store/lib/actions/calendar";
import { useDispatch } from "react-redux";
import {
    CardRecord,
    CardDatetimeValueRecord,
    useCalendarLoaded,
    useUser,
    useDateCardsIndex,
} from "@octal/store";
import { sort, keyStingFromDate } from "@octal/common";
import { useCalendar } from "src/hooks";

const defaultList = List<any>();

const dated = ["datetime", "date"];

interface IUserAvatar {
    user: string;
}

interface ICardField {
    card: CardRecord;
    value: string;
    field_id: string;
}

const MonthYearPicker = Popper.create<HTMLDivElement, any>((props: any) => {
    let date = new Date(1993, 0, 1);
    return (
        <Popper
            as="div"
            placement="bottom-start"
            distance={10}
            tabIndex={-1}
            anchorEl={props.anchorEl}
            onClickAway={props.onClickAway}
            className="z-10 flex w-48 flex-col rounded-md ring-1 ring-gray-800 ring-opacity-5 max-h-56 p-3 bg-white shadow-lg overflow-x-hidden overflow-y-auto">
            <div className="flex flex-row justify-center pb-3">
                <div className="flex flex-row items-center justify-end space-x-2">
                    <Button
                        variant="icon"
                        color="clear"
                        onClick={() => props.setYear(props.year - 1)}>
                        <BackIcon />
                    </Button>
                    <span className="p-2 font-semibold">{props.year}</span>
                    <Button
                        variant="icon"
                        color="clear"
                        onClick={() => props.setYear(props.year + 1)}
                        className="rotate-180">
                        <BackIcon />
                    </Button>
                </div>
            </div>
            <div className="grid grid-col-3 sm:grid-cols-4 gap-3">
                {Array(12)
                    .fill(0)
                    .map((_month, index) => (
                        <button
                            key={String(index)}
                            onClick={() => props.setMonth(index)}
                            className={clx(
                                "flex flex-row justify-center items-center p-2  rounded-lg",
                                props.month === index
                                    ? "text-white bg-primary-500"
                                    : "text-gray-700 bg-gray-100"
                            )}>
                            <span className="text-xs font-semibold p-px">
                                {moment(date)
                                    .add(index, "months")
                                    .format("MMM")}
                            </span>
                        </button>
                    ))}
            </div>
        </Popper>
    );
});

const UserIcon = React.memo((props: IUserAvatar) => {
    const user = useUser(props.user);
    return (
        <img
            key={user.id}
            className="inline-block h-7 w-7 rounded-xl ring-2 ring-white"
            alt={user.username}
            src={user.avatar}
        />
    );
});

function CardField(props: ICardField) {
    const [open, setOpen] = useState<boolean>(false);
    const card = props.card;
    const field = card.getField(props.field_id)!;
    return (
        <React.Fragment>
            <div
                role="button"
                onClick={() => setOpen(true)}
                className="flex-none flex flex-row items-center rounded-lg overflow-hidden pl-1 border border-gray-300 hover:bg-gray-200 cursor-pointer">
                <div className="flex flex-col py-0.5 px-1 font-semibold">
                    <span className="text-sm whitespace-nowrap font-semibold text-gray-800">
                        <Text>{card.name}</Text>
                    </span>
                    <span className="text-xs whitespace-nowrap text-gray-600">
                        {field.name}
                    </span>
                </div>
            </div>
            <CardDialog
                id={card.id}
                open={open}
                onClose={() => setOpen(false)}
            />
        </React.Fragment>
    );
}

const FieldCards = React.memo<{ date: string }>(({ date }) => {
    const key = keyStingFromDate(cal.fromISOString(date));
    const index = useDateCardsIndex(key);
    let [cards, setCards] = useState<List<CardRecord>>(defaultList);
    const fcards = useMemo<List<ICardField>>(() => {
        return cards
            .reduce((fcards, card) => {
                card.dates.includes(date);
                return card.fields
                    .filter((field) => {
                        return (
                            dated.includes(field.type) &&
                            !field.values.isEmpty()
                        );
                    })
                    .reduce((fcards, field) => {
                        let val: CardDatetimeValueRecord =
                            field.values.first() as any;
                        let fdate = cal.fromISOString(val.value);
                        if (key == keyStingFromDate(fdate)) {
                            return fcards.push({
                                card,
                                value: val.value,
                                field_id: field.id,
                            });
                        }
                        return fcards;
                    }, fcards);
            }, defaultList)
            .sort(sort("value", "desc"));
    }, [cards]);

    return (
        <div className="flex-grow flex flex-col pl-1.5 pr-2 pb-8 space-y-1.5">
            <UseCards records={index} setRecords={setCards} />
            {fcards.map((fcard) => (
                <CardField key={fcard.field_id} {...fcard} />
            ))}
        </div>
    );
});

export default React.memo(function Main() {
    const today = new Date();
    const loaded = useCalendarLoaded();
    const dispatch = useDispatch();
    const [picker, setPicker] = useState<boolean>(false);
    const [calendar, { setCalendar, ...actions }] = useCalendar("calendar");
    const pickerRef = React.useRef<HTMLButtonElement | null>(null);
    let { day, week, month, year } = calendar;

    useEffect(() => {
        if (!loaded.includes("cards")) {
            dispatch(CalendarActions.loadCalendar());
        }
    });

    function isToday(date: Date) {
        return (
            today.getDate() == date.getDate() &&
            today.getMonth() == date.getMonth() &&
            today.getFullYear() == date.getFullYear()
        );
    }

    function renderDay(isodate: string, dayi: number) {
        let date = cal.fromISOString(isodate);
        if (!calendar.days.includes(date.getDay())) {
            return <React.Fragment />;
        }
        return (
            <div className="flex flex-col overflow-hidden">
                <button
                    className="py-1 px-2 hover:bg-gray-200"
                    onClick={() => actions.setDay(day > -1 ? -1 : dayi)}>
                    <div
                        className={clx(
                            "flex flex-row justify-center items-center text-sm rounded-full w-5 h-5",
                            isToday(date) ? "text-white bg-primary-500" : ""
                        )}>
                        <span>{date.getDate()}</span>
                    </div>
                </button>
                <PerfectScrollbar className="flex-1 flex flex-col overflow-x-hidden">
                    <FieldCards date={isodate} />
                </PerfectScrollbar>
            </div>
        );
    }

    function renderWeek(weeki: number, days: any) {
        return (
            <div className="flex-1 flex flex-row overflow-hidden">
                <button
                    onClick={() => actions.setWeek(week > -1 ? -1 : weeki)}
                    className="w-3 flex flex-col justify-center items-center hover:bg-gray-200 p-px">
                    {week > -1 ? "-" : "+"}
                </button>
                <div
                    className={clx(
                        "flex-1 border-l border-gray-400 grid flex flex-row divide-x divide-gray-400 overflow-hidden",
                        {
                            ["grid-cols-7"]: calendar.days.size == 7,
                            ["grid-cols-6"]: calendar.days.size == 6,
                            ["grid-cols-5"]: calendar.days.size == 5,
                            ["grid-cols-4"]: calendar.days.size == 4,
                            ["grid-cols-3"]: calendar.days.size == 3,
                            ["grid-cols-2"]: calendar.days.size == 2,
                            ["grid-cols-1"]: calendar.days.size == 1,
                        }
                    )}>
                    {days}
                </div>
            </div>
        );
    }

    function renderActions() {
        return (
            <div className="flex flex-row items-center justify-end space-x-2">
                <Button variant="icon" onClick={() => actions.previous()}>
                    <BackIcon />
                </Button>
                <Button
                    variant="icon"
                    onClick={() => actions.next()}
                    className="rotate-180">
                    <BackIcon />
                </Button>
            </div>
        );
    }

    function renderHeader() {
        let date = new Date(year, month);
        let label = moment(date).format("MMMM YYYY");
        if (day > -1) {
            date = cal.date(day, month, year);
            label = moment(date).format("MMMM Do YYYY");
        } else if (week > -1) {
            label = moment(date).format(`[Week] ${week + 1} MMMM YYYY`);
        }
        const onClick =
            day > -1 || week > -1
                ? () => actions.setMonth()
                : () => setPicker(true);
        return (
            <div className="flex flex-row justify-between items-center px-8 py-4">
                <Button
                    ref={pickerRef}
                    onClick={onClick}
                    className="font-bold text-lg text-gray-700">
                    {label}
                </Button>
                {renderActions()}
            </div>
        );
    }

    function renderDays() {
        let date = new Date(1993, 7, 1);
        if (day > -1) return null;
        return (
            <div className="flex flex-row items-center">
                <button
                    onClick={() => actions.setMonth()}
                    className="w-3 flex flex-col justify-center items-center hover:bg-gray-200 px-px">
                    {week > -1 ? "+" : "-"}
                </button>
                <div
                    className={clx(
                        "flex-1 border-l border-gray-400 grid flex flex-row divide-x divide-gray-400 overflow-hidden",
                        {
                            ["grid-cols-7"]: calendar.days.size == 7,
                            ["grid-cols-6"]: calendar.days.size == 6,
                            ["grid-cols-5"]: calendar.days.size == 5,
                            ["grid-cols-4"]: calendar.days.size == 4,
                            ["grid-cols-3"]: calendar.days.size == 3,
                            ["grid-cols-2"]: calendar.days.size == 2,
                            ["grid-cols-1"]: calendar.days.size == 1,
                        }
                    )}>
                    {Array(7)
                        .fill(0)
                        .map((_zero, index) => index)
                        .filter((index) => calendar.days.includes(index))
                        .map((index) => (
                            <div
                                key={String(index)}
                                className="flex text-sm font-semibold px-2 flex-col overflow-hidden">
                                {moment(date).add(index, "days").format("ddd")}
                            </div>
                        ))}
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-grow flex-col overflow-hidden">
            <Header />
            {renderHeader()}
            <div className="pb-8 flex-1 flex flex-col overflow-x-hidden overflow-y-auto px-8">
                <div className="flex-1 flex flex-col border border-gray-400 divide-y divide-gray-400 overflow-hidden">
                    {renderDays()}
                    <Calendar
                        day={day}
                        year={year}
                        week={week}
                        month={month}
                        renderDay={renderDay}
                        renderWeek={renderWeek}
                    />
                </div>
            </div>
            <MonthYearPicker
                open={picker}
                year={year}
                month={month}
                setYear={actions.setYear}
                setMonth={actions.setMonth}
                anchorEl={pickerRef.current}
                onClickAway={() => setPicker(false)}
            />
        </div>
    );
});
