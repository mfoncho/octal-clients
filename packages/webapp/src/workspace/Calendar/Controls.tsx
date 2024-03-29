import React, { useState, useRef } from "react";
import { Popper, Switch } from "@colab/ui";
import { useCalendar } from "src/hooks";
import moment from "moment";
import * as Icons from "@colab/icons";

interface IControls {
    calendar: string;
}

const DayPicker = Popper.create<HTMLDivElement, IControls>((props: any) => {
    let date = new Date(1993, 7, 1);
    const [calendar, { setCalendar }] = useCalendar(props.calendar);

    function handleToggleDay(index: number) {
        return () => {
            if (calendar.days.includes(index)) {
                setCalendar({
                    days: calendar.days
                        .filter((day) => day !== index)
                        .toJS() as any,
                });
            } else {
                setCalendar({
                    days: calendar.days.concat([index]).toJS() as any,
                });
            }
        };
    }
    return (
        <Popper
            as="div"
            placement="bottom-start"
            distance={10}
            tabIndex={-1}
            anchorEl={props.anchorEl}
            onClickAway={props.onClickAway}
            className="z-10 flex w-52 flex-col rounded-md ring-1 ring-gray-800 ring-opacity-5 max-h-68 p-3 bg-white shadow-lg overflow-x-hidden overflow-y-auto space-y-2">
            {Array(7)
                .fill(0)
                .map((_month, index) => (
                    <div
                        key={String(index)}
                        className="flex flex-row items-center p-px justify-between rounded-md">
                        <div className="text-gray-700 text-sm flex flex-col pr-8">
                            <span className="font-semibold">
                                {moment(date).add(index, "days").format("dddd")}
                            </span>
                        </div>

                        <Switch
                            checked={calendar.days.includes(index)}
                            onChange={handleToggleDay(index)}
                        />
                    </div>
                ))}
        </Popper>
    );
});
export default React.memo<IControls>((props) => {
    const [picker, setPicker] = useState(false);
    const pickerRef = useRef<HTMLButtonElement>(null);
    const [, calendarActions] = useCalendar(props.calendar);

    function handleMonth(e: React.MouseEvent) {
        e.stopPropagation();
        e.preventDefault();
        calendarActions.setMonth();
    }

    function handleOpenPicker() {
        setPicker(true);
    }

    function handleClosePicker() {
        setPicker(false);
    }
    return (
        <React.Fragment>
            <div className="flex flex-row justify-end items-center space-x-2">
                <button
                    className="p-2 bg-white rounded-md ring-1 ring-gray-200 shadow hover:shadow-md hover:bg-primary-200"
                    onClick={() => calendarActions.setDay()}>
                    <Icons.Calendar.Day />
                </button>
                <button
                    className="p-2 bg-white rounded-md ring-1 ring-gray-200 shadow hover:shadow-md hover:bg-primary-200"
                    onClick={handleMonth}>
                    <Icons.Calendar.Month />
                </button>
                <div>
                    <button
                        className="p-2 bg-white rounded-md ring-1 ring-gray-200 shadow hover:shadow-md hover:bg-primary-200"
                        ref={pickerRef}
                        onClick={handleOpenPicker}>
                        <Icons.Controls />
                    </button>
                    <DayPicker
                        open={picker}
                        calendar={props.calendar}
                        anchorEl={pickerRef.current}
                        onClickAway={handleClosePicker}
                    />
                </div>
            </div>
        </React.Fragment>
    );
});
