export interface Target<T = string> {
    value: T;
}

export interface EventRef<T = any> {
    detail?: T;
    target?: HTMLElement;
    currentTarget?: HTMLElement;
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
        type?: string
    ) {
        return new UIEvent<T>(target, event, type ?? event.type);
    }

    static event<T = any>(type: string, ref: EventRef<T> = {}) {
        let ev = new CustomEvent(type, ref);
        return new Proxy(ev, {
            get(target, prop, _receiver) {
                if (prop === "target" && ref.target) {
                    return ref.target;
                }

                if (prop === "currentTarget" && ref.currentTarget) {
                    return ref.currentTarget;
                }
                //@ts-ignore
                let val: any = target[prop];
                if (typeof val === "function") {
                    val.bind(target);
                }
                return val;
            },
        });
    }

    static synthesis<T extends Element, E extends Event>(
        event: E
    ): React.SyntheticEvent<T, E> {
        let isDefaultPrevented = false;
        let isPropagationStopped = false;
        const preventDefault = () => {
            isDefaultPrevented = true;
            event.preventDefault();
        };
        const stopPropagation = () => {
            isPropagationStopped = true;
            event.stopPropagation();
        };
        return {
            nativeEvent: event,
            currentTarget: event.currentTarget as EventTarget & T,
            target: event.target as EventTarget & T,
            bubbles: event.bubbles,
            cancelable: event.cancelable,
            defaultPrevented: event.defaultPrevented,
            eventPhase: event.eventPhase,
            isTrusted: event.isTrusted,
            preventDefault,
            isDefaultPrevented: () => isDefaultPrevented,
            stopPropagation,
            isPropagationStopped: () => isPropagationStopped,
            persist: () => {},
            timeStamp: event.timeStamp,
            type: event.type,
        };
    }

    stopPropagation() {
        this.event.stopPropagation();
    }

    preventDefault() {
        this.event.preventDefault();
    }
}

export default UIEvent;
