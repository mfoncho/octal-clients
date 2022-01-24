export interface Session {}

let state: Session = {};

export const reducers = {
    CONNECTED(state: Session, { payload }: any): Session {
        return payload ? payload : state;
    },
};

export default { state, reducers };
