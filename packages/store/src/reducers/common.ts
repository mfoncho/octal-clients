import merge from 'lodash/merge';

export function put( state: any, { type, payload }: any){

	let entities = payload;

	if(!Array.isArray(payload)){

		entities = [ payload ];

	}

	state = { ...state }

	for(let entity of entities){

		let prev = state[entity.id] || {};

		state[entity.id] = { ...prev, ...entity };

	}

	return state;

}

export function patch( state: any, { payload }: any){

    let entity = state[payload.id];
	if( entity){
		return { ...state, [entity.id]:merge(entity, payload) }
	}

	return state;

}


export function remove( state: any, { payload }: any){

	if(state[payload]){

		state = { ...state }

		delete state[payload];

		return state;
	}

	return state;
}

export function clear(){

	return Object.create(null);

}

export default { put, patch, remove, clear }
