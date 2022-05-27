export interface Target<T = string> {
    value: T;
}

export class UIEvent<T = Target> {
    readonly type: string;
    readonly event: React.SyntheticEvent;
    readonly target: T;

    constructor(target: T, event: React.SyntheticEvent, type: string) {
        this.target = target;
        this.event = event;
        this.type = type;
    }

    static create<T = Target>(
        target: T,
        event: React.SyntheticEvent,
        type: string = "ui"
    ) {
        return new UIEvent<T>(target, event, type);
    }

    stopPropagation() {
        this.event.stopPropagation();
    }

    preventDefault() {
        this.event.preventDefault();
    }
}

export default UIEvent;
