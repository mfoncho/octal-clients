export type RTokenT = string;

export interface IRequest {
    id: string;
    cancel: RTokenT;
}

export interface HttpState {
    [id: string]: IRequest;
}

export const state: HttpState = {};

export const reducers = {
    HTTP_START(state: HttpState, { payload }: any): HttpState {
        return { ...state, [payload.id]: payload };
    },

    HTTP_ERROR(state: HttpState, { payload }: any) {
        return state;
    },

    HTTP_CANCELLED(state: HttpState, { payload }: any): HttpState {
        if (state[payload.id]) {
            const req = {
                ...state[payload.id],
                reason: payload.reason,
                cancelled: true,
            } as any;

            delete req["cancel"];

            return { ...state, [req.id]: req };
        }

        return state;
    },

    HTTP_COMPLETE(state: HttpState, { payload }: any): HttpState {
        if (state[payload.id]) {
            state = { ...state };
            delete state[payload.id];
        }

        return state;
    },

    HTTP_UPLOAD_PROGRESS(state: HttpState, { payload }: any): HttpState {
        if (state[payload.id]) {
            let { id, ...progress } = payload;

            return { ...state, [id]: { ...state[id], progress } };
        }

        return state;
    },

    HTTP_DOWNLOAD_PROGRESS(state: HttpState, { payload }: any): HttpState {
        if (state[payload.id]) {
            let { id, ...progress } = payload;

            return { ...state, [id]: { ...state[id], progress } };
        }

        return state;
    },
};

export default { state, reducers };
