import {
    BsCalendar2 as Week,
    BsCalendar3 as Month,
    BsCalendar3Event as Day,
} from "react-icons/bs";

type Calendar = typeof Month & {
    Day: typeof Week;
    Week: typeof Week;
    Month: typeof Month;
};

(Month as Calendar).Day = Day;
(Month as Calendar).Week = Week;
(Month as Calendar).Month = Month;

export { Week, Month, Day };

export default Month as Calendar;
