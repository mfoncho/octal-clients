import React, { useState, useEffect } from "react";
import calendar from "@octal/calendar";

export interface ICalendar {
    day?: number;
    week?: number;
    month?: number;
    year?: number;
    date?: Date;
    renderDay?: (date: string, day: number) => JSX.Element;
    renderWeek?: (week: number, days: JSX.Element[]) => JSX.Element;
}

export interface IDay {
    day: number;
    date: string;
}

export interface IWeek {
    week: number;
    children: JSX.Element[];
}

function Day(props: IDay) {
    let date = calendar.fromISOString(props.date);
    return <div>{date.toString()}</div>;
}

function Week(props: IWeek) {
    return (
        <div>
            {props.week}
            <div>{props.children}</div>
        </div>
    );
}

const components = { Day, Week };

export const Components =
    React.createContext<Partial<typeof components>>(components);

export const Calendar = React.memo<ICalendar>(function Main(props) {
    const Calendar = { ...components, ...React.useContext(Components) };
    const date = new Date();
    const [year, setYear] = useState<number>(props.year ?? date.getFullYear());
    const [month, setMonth] = useState<number>(props.month ?? date.getMonth());
    const [dates, setDates] = useState<string[]>([]);

    useEffect(() => {
        const date = new Date();
        if (props.month! > -1 && props.month !== month) {
            setMonth(props.month!);
        } else if (props.month === undefined && date.getMonth() != month) {
            setMonth(date.getMonth());
        }
        if (props.year! > -1 && props.year !== year) {
            setYear(props.year!);
        } else if (props.year === undefined && date.getFullYear() != year) {
            setYear(date.getFullYear());
        }
    }, [props.month, props.year]);

    useEffect(() => {
        const dates = calendar.create(month, year);
        setDates(dates);
    }, [month, year]);

    function renderDay(day: number) {
        let date = dates[day];
        if (date) {
            if (props.renderDay) {
                return (
                    <React.Fragment key={date}>
                        {props.renderDay(date, day)}
                    </React.Fragment>
                );
            } else {
                return <Calendar.Day key={date} day={day} date={date} />;
            }
        }
        return <React.Fragment key={date} />;
    }

    function renderWeek(weekNumber: number) {
        let index = weekNumber * 7;
        let renderedDays: JSX.Element[] = [];
        for (let i = index; i < index + 7; i++) {
            renderedDays.push(renderDay(i));
        }

        if (props.renderWeek) {
            return (
                <React.Fragment key={String(weekNumber)}>
                    {props.renderWeek(weekNumber, renderedDays)}
                </React.Fragment>
            );
        } else {
            return (
                <Calendar.Week week={weekNumber} key={String(weekNumber)}>
                    {renderedDays}
                </Calendar.Week>
            );
        }
    }

    if (props.day! >= 0 && props.day! < dates.length) {
        return renderDay(props.day!);
    }

    if (props.week! >= 0 && props.week! <= dates.length / 7) {
        return renderWeek(props.week!);
    }

    let renderedWeeks: (JSX.Element | null | undefined)[] = [];

    let weeks = dates.length / 7;

    for (let i = 0; i < weeks; i++) {
        renderedWeeks.push(renderWeek(i));
    }
    return <React.Fragment>{renderedWeeks}</React.Fragment>;
});

(Calendar as any).Components = Components;

type CalendarType = typeof Calendar & {
    Components: typeof Components;
};

export default Calendar as CalendarType;
