const calendar = {
    date(day: number, month: number, year: number) {
        let daysOfMonth = this.days(month, year);
        let firstMonthDay = this.start(month, year);
        let daysOfPrevMonth = this.days(month - 1, year);
        if (day < firstMonthDay) {
            day = daysOfPrevMonth - firstMonthDay + (day + 1);
            return new Date(year, month - 1, day);
        } else if (day + firstMonthDay > daysOfMonth) {
            day = day + 1 - (firstMonthDay + daysOfMonth);
            return new Date(year, month + 1, day);
        }
        return new Date(year, month, day + 1 - firstMonthDay);
    },

    day(date: Date) {
        let month = date.getMonth();
        let year = date.getFullYear();
        return date.getDate() + this.start(month, year) - 1;
    },

    week(date: Date) {
        let month = date.getMonth();
        let year = date.getFullYear();
        let firstMonthDay = this.start(month, year);
        return Math.floor((firstMonthDay + date.getDate() - 1) / 7);
    },

    weeks(month: number, year: number) {
        let daysOfMonth = this.days(month, year);
        let firstMonthDay = this.start(month, year);
        return Math.ceil((daysOfMonth + firstMonthDay) / 7);
    },

    days(month: number, year: number) {
        return new Date(year, month + 1, 0).getDate();
    },

    start(month: number, year: number) {
        return new Date(year, month, 1).getDay();
    },

    fromISOString(date: string) {
        var b = date.split(/\D+/) as any;
        return new Date(Date.UTC(b[0], --b[1], b[2], b[3], b[4], b[5], b[6]));
    },

    create(month: number, year: number): string[] {
        let dates: string[] = [];
        let daysOfMonth = this.days(month, year);
        let firstMonthDay = this.start(month, year);
        let daysOfPrevMonth = this.days(month - 1, year);
        for (let i = 0; i < firstMonthDay; i++) {
            let prevdate = new Date(year, month - 1, daysOfPrevMonth - i);
            dates.unshift(prevdate.toISOString());
        }

        // fill days of month
        for (let i = 1; i <= daysOfMonth; i++) {
            let monthdate = new Date(year, month, i);
            dates.push(monthdate.toISOString());
        }

        let incompleteWeekDays = dates.length % 7;
        if (incompleteWeekDays > 0) {
            for (let i = 1; i <= 7 - incompleteWeekDays; i++) {
                let nextdate = new Date(year, month + 1, i);
                dates.push(nextdate.toISOString());
            }
        }
        return dates;
    },
};

export default calendar;
