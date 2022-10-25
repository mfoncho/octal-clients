import { BiCalendar as CalendarIcon } from "react-icons/bi";
import {
    BsCalendar2 as Week,
    BsCalendar3 as Month,
    BsCalendar3Event as Day,
} from "react-icons/bs";

type Calendar = typeof CalendarIcon & {
    Day: typeof Day;
    Week: typeof Week;
    Month: typeof Month;
};

(CalendarIcon as Calendar).Day = Day;
(CalendarIcon as Calendar).Week = Week;
(CalendarIcon as Calendar).Month = Month;

export { Week, Month, Day };

export default CalendarIcon as Calendar;
