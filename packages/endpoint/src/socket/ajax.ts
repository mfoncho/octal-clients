import { global, XHR_STATES } from "./constants";

export default class Ajax {
    static request(
        method: string,
        endPoint: string,
        accept: string,
        body: string,
        timeout: number,
        ontimeout: any,
        callback: any
    ) {
        if ((global as any).XDomainRequest) {
            let req = new (global as any).XDomainRequest(); // IE8, IE9
            Ajax.xdomainRequest(
                req,
                method,
                endPoint,
                body,
                timeout,
                ontimeout,
                callback
            );
        } else {
            let req = new global.XMLHttpRequest(); // IE7+, Firefox, Chrome, Opera, Safari
            Ajax.xhrRequest(
                req,
                method,
                endPoint,
                accept,
                body,
                timeout,
                ontimeout,
                callback
            );
        }
    }

    static xdomainRequest(
        req: any,
        method: string,
        endPoint: string,
        body: any,
        timeout: number,
        ontimeout: any,
        callback: any
    ) {
        req.timeout = timeout;
        req.open(method, endPoint);
        req.onload = () => {
            let response = Ajax.parseJSON(req.responseText);
            callback && callback(response);
        };
        if (ontimeout) {
            req.ontimeout = ontimeout;
        }

        // Work around bug in IE9 that requires an attached onprogress handler
        req.onprogress = () => {};

        req.send(body);
    }

    static xhrRequest(
        req: any,
        method: string,
        endPoint: string,
        accept: string,
        body: any,
        timeout: number,
        ontimeout: any,
        callback: any
    ) {
        req.open(method, endPoint, true);
        req.timeout = timeout;
        req.setRequestHeader("Content-Type", accept);
        req.onerror = () => {
            callback && callback(null);
        };
        req.onreadystatechange = () => {
            if (req.readyState === XHR_STATES.complete && callback) {
                let response = Ajax.parseJSON(req.responseText);
                callback(response);
            }
        };
        if (ontimeout) {
            req.ontimeout = ontimeout;
        }

        req.send(body);
    }

    static parseJSON(resp: string) {
        if (!resp || resp === "") {
            return null;
        }

        try {
            return JSON.parse(resp);
        } catch (e) {
            console && console.log("failed to parse JSON response", resp);
            return null;
        }
    }

    static serialize(obj: any, parentKey: string | number): string {
        let queryStr = [];
        for (var key in obj) {
            if (!Object.prototype.hasOwnProperty.call(obj, key)) {
                continue;
            }
            let paramKey = parentKey ? `${parentKey}[${key}]` : key;
            let paramVal = obj[key];
            if (typeof paramVal === "object") {
                queryStr.push(Ajax.serialize(paramVal, paramKey));
            } else {
                queryStr.push(
                    encodeURIComponent(paramKey) +
                        "=" +
                        encodeURIComponent(paramVal)
                );
            }
        }
        return queryStr.join("&");
    }

    static appendParams(url: string, params: any) {
        if (Object.keys(params).length === 0) {
            return url;
        }

        let prefix = url.match(/\?/) ? "&" : "?";
        return `${url}${prefix}${Ajax.serialize(params, params)}`;
    }
}
