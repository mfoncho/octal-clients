import { Screen } from "@octal/ui";
import moment from "moment";
import {
    useEffect,
    useMemo,
    useRef,
    useState,
    useCallback,
    useContext,
} from "react";
import { useHistory, generatePath } from "react-router-dom";
import paths from "./paths";
import { useDispatch } from "react-redux";
import {
    useBoardStore,
    Calendar,
    useDrawer as useStoreDrawer,
    useCalendar as useStoreCalendar,
} from "@octal/store";
import calutils from "@octal/calendar";
import { openDrawer, closeDrawer } from "@octal/store/lib/actions/drawer";
import { updateCalendar, ICalendarParams } from "@octal/store/lib/actions/calendar";

export function useMediaQuery(query: string) {
    const [matches, setMatches] = useState(false);

    useEffect(() => {
        const media = window.matchMedia(query.replace(/^@media( ?)/m, ""));
        if (media.matches !== matches) {
            setMatches(media.matches);
        }
        const listener = () => setMatches(media.matches);
        window.addEventListener("resize", listener);
        return () => window.removeEventListener("resize", listener);
    }, [matches, query]);

    return matches;
}

export function useScreen() {
    return useContext(Screen.Context);
}

export function useCalendar(id: string) {
    const dispatch = useDispatch();
    const calendar = useStoreCalendar(id);
    const setCalendar = useCallback(
        (params: Partial<ICalendarParams>) => {
            const pre = calendar.toJS() as any;
            return dispatch(updateCalendar(id, { ...pre, ...params }));
        },
        [id, calendar]
    );
    return useMemo(() => {
        const { day, week, month, year } = calendar;
        function isToday(date: Date) {
            const today = new Date();
            return (
                today.getDate() == date.getDate() &&
                today.getMonth() == date.getMonth() &&
                today.getFullYear() == date.getFullYear()
            );
        }

        function setDay(day?: number) {
            if (day === undefined || day == null) {
                let date = new Date();
                let day = calutils.day(date);
                let month = date.getMonth();
                let year = date.getFullYear();
                return setCalendar({ day, week: -1, month, year });
            } else if (day > -1) {
                let date = calutils.date(day, month, year);
                let nweek = calutils.week(date);
                return setCalendar({
                    day: day,
                    week: nweek,
                    month: date.getMonth(),
                    year: date.getFullYear(),
                });
            } else {
                return setCalendar({ day: day });
            }
        }

        function setWeek(week: number) {
            return setCalendar({ week });
        }

        function setYear(year: number) {
            return setCalendar({ day: -1, week: -1, month, year });
        }
        function setMonth(month?: number) {
            if (month === undefined || month === null) {
                const today = new Date();
                return setCalendar({
                    day: -1,
                    week: -1,
                    month: today.getMonth(),
                    year: today.getFullYear(),
                });
            } else {
                return setCalendar({ day: -1, week: -1, month, year });
            }
        }

        function next() {
            if (day > -1) {
                let date = calutils.date(day, month, year);
                let ndate = moment(date).add(1, "days").toDate();
                let nday = calutils.day(ndate);
                let nmonth = ndate.getMonth();
                let nyear = ndate.getFullYear();
                let nweek = calutils.week(ndate);
                return setCalendar({
                    day: nday,
                    week: nweek,
                    month: nmonth,
                    year: nyear,
                });
            } else if (week > -1) {
                let weeks = calutils.weeks(month, year);
                if (week + 1 < weeks) {
                    return setCalendar({
                        day: -1,
                        week: week + 1,
                        month: month,
                        year: year,
                    });
                } else if (month < 11) {
                    return setCalendar({
                        day: -1,
                        week: 0,
                        month: month + 1,
                        year: year,
                    });
                } else {
                    return setCalendar({
                        day: -1,
                        week: 0,
                        month: 0,
                        year: year + 1,
                    });
                }
            } else if (month >= 11) {
                return setCalendar({
                    day: -1,
                    week: -1,
                    month: 0,
                    year: year + 1,
                });
            } else {
                return setCalendar({
                    day: -1,
                    week: -1,
                    month: month + 1,
                    year: year,
                });
            }
        }

        function previous() {
            if (day > -1) {
                let date = calutils.date(day, month, year);
                let ndate = moment(date).subtract(1, "days").toDate();
                let nday = calutils.day(ndate);
                let nmonth = ndate.getMonth();
                let nyear = ndate.getFullYear();
                let nweek = calutils.week(ndate);
                setCalendar({
                    day: nday,
                    week: nweek,
                    month: nmonth,
                    year: nyear,
                });
            } else if (week > -1) {
                if (week > 0) {
                    setCalendar({ day: -1, week: week - 1 });
                } else if (month > 0) {
                    let weeks = calutils.weeks(month - 1, year);
                    setCalendar({ day: -1, week: weeks - 1, month: month - 1 });
                } else {
                    let weeks = calutils.weeks(11, year - 1);
                    setCalendar({
                        day: -1,
                        week: weeks - 1,
                        month: 11,
                        year: year - 1,
                    });
                }
            } else if (month > 0) {
                return setCalendar({ day: -1, week: -1, month: month - 1 });
            } else {
                return setCalendar({
                    day: -1,
                    week: -1,
                    month: 11,
                    year: year - 1,
                });
            }
        }
        let actions = {
            previous,
            next,
            setDay,
            setWeek,
            setMonth,
            setYear,
            isToday,
            setCalendar,
        };

        return [calendar, actions] as [Calendar, typeof actions];
    }, [calendar]);
}

export function useDrawer<T>(id: string, params: T) {
    const drawer = useStoreDrawer<T>(id, params);
    const dispatch = useDispatch();
    const open = useCallback(
        (params: T) => {
            return dispatch(openDrawer(id, params));
        },
        [id]
    );

    const close = useCallback(
        (params: T) => {
            return dispatch(closeDrawer(id, params));
        },
        [id]
    );

    const toggle = useCallback(
        (params: T) => {
            if (drawer && drawer.open) {
                return dispatch(closeDrawer(id, params));
            } else if (drawer) {
                return dispatch(openDrawer(id, params));
            }
        },
        [drawer, id]
    );

    const actions = { open, close, toggle };

    return [drawer, actions] as [typeof drawer, typeof actions];
}

const defaultNavigatorDrawerParams = {};

export function useNavigatorDrawer() {
    return useDrawer("navigator", defaultNavigatorDrawerParams);
}

export function useNavigator() {
    const history = useHistory();

    const boards = useBoardStore();

    function openHome() {
        if (history.location.pathname != "/spaces") {
            history.push("/spaces/1");
        }
    }

    const openSpace = useCallback((params: { id: string }) => {
        const path = generatePath(paths.workspace.space, {
            space_id: params.id,
        });
        history.push(path);
    }, []);

    const openTopic = useCallback(
        (params: { id: string; space_id: string }) => {
            const path = generatePath(paths.workspace.topic, {
                topic_id: params.id,
                space_id: params.space_id,
            });
            history.push(path);
        },
        []
    );

    const openBoard = useCallback((params: { id: string }) => {
        const path = generatePath(paths.workspace.board, {
            space_id: params.id,
        });
        history.push(path);
    }, []);

    const openCard = useCallback((params: { id: string; board_id: string }) => {
        const board = boards.getBoard(params.board_id);
        if (board) {
            const path = generatePath(paths.workspace.card, {
                card_id: params.id,
                space_id: board.space_id,
                board_id: params.board_id,
            });
            history.push(path);
        }
    }, []);

    return { openCard, openTopic, openSpace, openBoard, openHome };
}

export function useCurPrev<T, P>(value: T) {
    const [[curr, prev], update] = useState<[T, T | P]>([value, value]);

    useEffect(() => {
        update([value, curr]);
    }, [value]);

    return [curr, prev];
}

export interface ValidationRule {
    max?: number;
    min?: number;
    required?: boolean;
}

export interface Validation<T> {
    name: string;
    rules: ValidationRule[];
    validate: (v: T) => boolean;
}

export function useFormInput<T>(original: T, validate?: (v: T) => boolean) {
    const [value, setValue] = useState<T>(original);

    const [valid, setValid] = useState<boolean>(false);

    useEffect(() => {
        switch (typeof value) {
            case "string":
                let val = value.trim();
                let orig =
                    typeof original == "string" ? original.trim() : original;

                if (validate) {
                    setValid(validate(value));
                } else if (orig === val) {
                    setValid(false);
                } else {
                    setValid(Boolean(val));
                }

                break;

            default:
                setValid(Boolean(value));
        }
    }, [value, original]);

    function onChange(e: any) {
        if (typeof original == "number") {
            setValue(Number(e.target.value) as any);
        } else {
            setValue(e.target.value);
        }
    }

    return { value, valid, setValue, onChange, props: { value, onChange } };
}

export function useUnmount<T extends readonly unknown[], S>(
    cb: (props: T) => S,
    val: T
) {
    const ref = useRef<{ val: T; fn: (props: T) => S }>();
    const fn = useCallback(cb, val);
    useEffect(() => {
        ref.current = { val, fn };
    }, [fn]);

    useEffect(() => {
        return () => {
            ref!.current!.fn(ref.current!.val);
        };
    }, []);
}

export function useDebounce<T>(value: T, delay: number) {
    // State and setters for debounced value

    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        // Update debounced value after delay
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
}

export function useDebouncedCallback<
    T extends (...args: any[]) => any,
    S extends readonly unknown[]
>(callback: T, wait: number, watch: S = [] as any) {
    // track args & timeout handle between calls
    const argsRef = useRef<any[]>();
    const timeout = useRef<ReturnType<typeof setTimeout>>();

    function cleanup() {
        if (timeout.current) {
            clearTimeout(timeout.current);
        }
    }

    // make sure our timeout gets cleared if
    // our consuming component gets unmounted
    useEffect(() => cleanup, []);

    return useCallback((...args: any[]) => {
        // capture latest args
        argsRef.current = args;

        // clear debounce timer
        cleanup();

        // start waiting again
        timeout.current = setTimeout(() => {
            if (argsRef.current) {
                callback(...argsRef.current);
            }
        }, wait);
    }, watch) as T;
}

export const useInput = useFormInput;
