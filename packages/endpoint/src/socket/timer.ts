export type Callback = () => void;

export type Timeout = (tries: number) => number;

export default class Timer {
    tries: number;

    timeout: Timeout;

    callback: Callback;

    timer: number;

    constructor(callback: Callback, timerout: Timeout) {
        this.callback = callback;
        this.timeout = timerout;
        this.timer = 0;
        this.tries = 0;
    }

    reset() {
        this.tries = 0;
        this.clearTimer();
    }

    /**
     * Cancels any previous scheduleTimeout and schedules callback
     */
    scheduleTimeout() {
        this.clearTimer();

        this.timer = (setTimeout(() => {
            this.tries = this.tries + 1;
            this.callback();
        }, this.timeout(this.tries + 1)) as any) as number;
    }

    private clearTimer() {
        if (this.timer > 0) {
            clearTimeout(this.timer as any);
            this.timer = 0;
        }
    }
}
