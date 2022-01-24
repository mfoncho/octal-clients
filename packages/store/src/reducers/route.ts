import immutable, { Record, Map, fromJS } from 'immutable';

export const RouteFactory = Record({
    key: "",
    hash: "",
    search: "",
    pathname: "",
    params: Map<string, string|any>()
}, "route")

export class Route extends RouteFactory {}

export interface RouteState extends Route {}

export const state = new Route();

export const reducers = {

    ROUTE( state: Route, { payload }: any ){
        return state.merge(fromJS(payload) as any);
    }

};

export default { state, reducers }
