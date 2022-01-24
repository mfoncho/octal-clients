import axios from "axios";
import store from "@octal/store";

let id = 0;

export function auth(config: any) {
	const { auth } = store.getState();

	switch (auth.token) {
		case "Bearer":
			config.headers["Authorization"] = `Bearer ${auth.token}`;
			break;

		case "csrf-token":
			config.headers["X-CSRF-TOKEN"] = auth.token;
			break;

		default:
			break;
	}

	const source = axios.CancelToken.source();

	config.cancelToken = source.token;

	config.id = id++;

	/*
		store.dispatch({
			type:'HTTP_START',
			payload:{ 
				id: config.id,
				data: config.data,
				cancel:(reason: any)=>{
					//source.cancel({config, reason} as string);
				},
				url: config.url,
				action: config.action,
				method: config.method,
				params: config.params,
			}
		});

		config.onUploadProgress = (event: any) => {
			store.dispatch({
				type:'HTTP_UPLOAD_PROGRESS', 
				payload:{
					id:config.id,
					total:event.total,
					loaded:event.loaded, 
					computable: event.lengthComputable,
				}
			});
		}

		config.onDownloadProgress = (event: any) => {
			store.dispatch({
				type:'HTTP_DOWNLOAD_PROGRESS', 
				payload:{
					id:config.id,
					total:event.total,
					loaded:event.loaded, 
					computable: event.lengthComputable,
				} 
			});
		}
		*/

	return config;
}

export function error(error: any) {
	if (error.response) {
		if (error.response.status === 401) {
			window.location.reload();
		}

		const data = error.toJSON();

		/*
			store.dispatch({
				type:'HTTP_ERROR', 
				payload:{ 
					code: data.code,
					id: data.config.id, 
					reason: data.message,
					status: error.response.status,
					message: error.response.data.message,
					statusText: error.response.statusText,
				} 
			})
			*/

		return Promise.reject(error.response);
	} else {
		if (error.request) {
			const { config, ...data } = error.toJSON();

			/*
				store.dispatch({
					type:'HTTP_ERROR', 
					payload:{ 
						id: error.config.id, 
						code: data.code,
						status: error.request.status,
						reason: data.message,
					} 
				})
				*/

			return Promise.reject(data);
		} else {
			return Promise.reject(error.message.reason as string);
		}
	}
}

export function success(res: any) {
	/*
	store.dispatch({
		type:'HTTP_COMPLETE', 
		payload:{ 
			id:res.config.id, 
			status:res.status  
		} 
	});
	*/
	return res;
}
