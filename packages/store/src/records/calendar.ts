import { Record, List } from "immutable";

export interface ICalendar {
    id: string;
    day: number;
    week: number;
    year: number;
    month: number;
    days: number[];
}

const today = new Date();

export class Calendar extends Record({
    id: "",
    day: -1,
    week: -1,
    year: today.getFullYear(),
    month: today.getMonth(),
    days: List<number>([0, 1, 2, 3, 4, 5, 6]),
}) {
    constructor(params: any) {
        super(Calendar.objectFromJS(params));
    }

    patch(param: object) {
        return this.merge(Calendar.objectFromJS(param));
    }

    static objectFromJS(data: any) {
        if (data.days && !List.isList(data.days)) {
            data = { ...data, days: List<number>(data.days) };
        }

        return data;
    }

    static make(data: any) {
        return new Calendar(data);
    }
}
