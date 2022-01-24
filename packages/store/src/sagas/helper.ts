import {
    cancel,
    cancelled,
    fork,
    put,
    take,
    takeEvery,
    takeLatest,
} from "redux-saga/effects";

export const factory = (
    SIGSRT: string,
    SIGTSTP: string,
    start: any,
    effect = takeEvery
) => {
    function* worker(sigsrt: any): Iterable<any> {
        let sigtstp = { type: SIGTSTP, id: "" };

        const job = {
            id: sigsrt.id,
            signals: {
                stop: SIGTSTP,
                start: SIGSRT,
            },
        };

        const task = (yield fork(start, sigsrt)) as any;

        do {
            sigtstp = (yield take(SIGTSTP)) as any;
        } while (sigtstp.id !== sigsrt.id);

        yield cancel(task);
    }

    return { effect, type: SIGSRT, handler: worker };
};

export const singleton = (
    SIGSRT: string,
    SIGSTOP: string,
    handler: any,
    effect = takeLatest
) => {
    function* worker(sigsrt: string): Iterable<any> {
        const job = { id: SIGSRT, signals: [SIGSTOP, SIGSRT] };

        try {
            yield put({ type: "START_JOB", payload: job });
            const task = (yield fork(handler, sigsrt)) as any;

            yield take(SIGSTOP);
            yield put({ type: "STOP_JOB", payload: job });

            yield cancel(task);
        } finally {
            if (yield cancelled()) {
                yield put({ type: "STOP_JOB", payload: job });
            }

            yield put({ type: "REMOVE_JOB", payload: job });
        }
    }

    return { effect, type: SIGSRT, handler: worker };
};

export const job = { singleton, factory };
