import Channel from "./channel";

export interface IPresenceEvent {
    state: string;
    diff: string;
}

export interface PresenceState {
    [key: string]: any;
}

export interface IStates {
    [key: string]: PresenceState;
}

export interface IOpts {
    events?: IPresenceEvent;
}
export interface IState {
    [key: string]: string | number;
}

export interface ICaller {
    onJoin: (...args: any) => void;
    onLeave: (...args: any) => void;
    onSync: (...args: any) => void;
}

export type Callback = (...args: any) => void;

export type Chooser = (...args: any) => Presence;

export default class Presence {
    state: IStates;
    pendingDiffs: any;
    channel: Channel;
    joinRef: any;
    caller: ICaller;

    constructor(channel: Channel, opts: IOpts = {}) {
        let events = opts.events || {
            state: "presence_state",
            diff: "presence_diff",
        };
        this.state = {};
        this.pendingDiffs = [];
        this.channel = channel;
        this.joinRef = null;
        this.caller = {
            onJoin: function () {},
            onLeave: function () {},
            onSync: function () {},
        };

        this.channel.on(events.state, (newState: any) => {
            let { onJoin, onLeave, onSync } = this.caller;

            this.joinRef = this.channel.joinRef();
            this.state = Presence.syncState(
                this.state,
                newState,
                onJoin,
                onLeave
            );

            this.pendingDiffs.forEach((diff: any) => {
                this.state = Presence.syncDiff(
                    this.state,
                    diff,
                    onJoin,
                    onLeave
                );
            });
            this.pendingDiffs = [];
            onSync();
        });

        this.channel.on(events.diff, (diff: any) => {
            let { onJoin, onLeave, onSync } = this.caller;

            if (this.inPendingSyncState()) {
                this.pendingDiffs.push(diff);
            } else {
                this.state = Presence.syncDiff(
                    this.state,
                    diff,
                    onJoin,
                    onLeave
                );
                onSync();
            }
        });
    }

    onJoin(callback: Callback) {
        this.caller.onJoin = callback;
    }

    onLeave(callback: Callback) {
        this.caller.onLeave = callback;
    }

    onSync(callback: Callback) {
        this.caller.onSync = callback;
    }

    list(by: any) {
        return Presence.list(this.state, by);
    }

    inPendingSyncState() {
        return !this.joinRef || this.joinRef !== this.channel.joinRef();
    }

    static syncState(
        currentState: any,
        newState: any,
        onJoin: Callback,
        onLeave: Callback
    ) {
        let state = Presence.clone(currentState);
        let joins: PresenceState = {};
        let leaves: PresenceState = {};

        this.map(state, (key, presence) => {
            if (!newState[key]) {
                leaves[key] = presence;
            }
        });
        this.map(newState, (key, newPresence) => {
            let currentPresence = state[key];
            if (currentPresence) {
                let newRefs = newPresence.metas.map((m: any) => m.phx_ref);
                let curRefs = currentPresence.metas.map((m: any) => m.phx_ref);
                let joinedMetas = newPresence.metas.filter(
                    (m: any) => curRefs.indexOf(m.phx_ref) < 0
                );
                let leftMetas = currentPresence.metas.filter(
                    (m: any) => newRefs.indexOf(m.phx_ref) < 0
                );
                if (joinedMetas.length > 0) {
                    joins[key] = newPresence;
                    joins[key].metas = joinedMetas;
                }
                if (leftMetas.length > 0) {
                    leaves[key] = this.clone(currentPresence);
                    leaves[key].metas = leftMetas;
                }
            } else {
                joins[key] = newPresence;
            }
        });
        return this.syncDiff(
            state,
            { joins: joins, leaves: leaves },
            onJoin,
            onLeave
        );
    }

    static syncDiff(
        state: any,
        diff: any,
        onJoin: Callback,
        onLeave: Callback
    ) {
        let { joins, leaves } = this.clone(diff);
        if (!onJoin) {
            onJoin = function () {};
        }
        if (!onLeave) {
            onLeave = function () {};
        }

        this.map(joins, (key, newPresence) => {
            let currentPresence = state[key];
            state[key] = this.clone(newPresence);
            if (currentPresence) {
                let joinedRefs = state[key].metas.map((m: any) => m.phx_ref);
                let curMetas = currentPresence.metas.filter(
                    (m: any) => joinedRefs.indexOf(m.phx_ref) < 0
                );
                state[key].metas.unshift(...curMetas);
            }
            onJoin(key, currentPresence, newPresence);
        });
        this.map(leaves, (key, leftPresence) => {
            let currentPresence = state[key];
            if (!currentPresence) {
                return;
            }
            let refsToRemove = leftPresence.metas.map((m: any) => m.phx_ref);
            currentPresence.metas = currentPresence.metas.filter((p: any) => {
                return refsToRemove.indexOf(p.phx_ref) < 0;
            });
            onLeave(key, currentPresence, leftPresence);
            if (currentPresence.metas.length === 0) {
                delete state[key];
            }
        });
        return state;
    }

    static list(presences: IStates, chooser?: Chooser) {
        if (!chooser) chooser = (_key: string, pres) => pres;

        return Presence.map(presences, (key: string, presence: Presence) => {
            return chooser!(key, presence);
        });
    }

    static map(obj: any, func: Callback) {
        return Object.getOwnPropertyNames(obj).map((key) =>
            func(key, obj[key])
        );
    }

    static clone(obj: any) {
        return JSON.parse(JSON.stringify(obj));
    }
}
