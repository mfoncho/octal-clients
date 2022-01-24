import { io } from "../types";
import BaseClient, { Params } from "../base";

export default class CalendarClient extends BaseClient {
    async getCalendar(params?: Params): Promise<io.Calendar> {
        const { data } = await this.endpoint.get("/calendar", params);
        return data as io.Calendar;
    }
}
