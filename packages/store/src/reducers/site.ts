import { SetSiteAction } from "../actions/app";
import { SET_SITE } from "../actions/types";
import { SiteRecord } from "../records";

export const state = new SiteRecord({});

export const reducers = {
    [SET_SITE]:(site: SiteRecord, action: SetSiteAction)=>{
        return site.merge(action.payload);
    },
};

export default { state, reducers };
