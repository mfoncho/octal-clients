
import { Record, OrderedMap} from 'immutable';

let nonce = 0;

export interface ISnackEvent {
	key: string;
	target: HTMLElement;
}

export class Snack extends Record({
	key: "",
	state: "",
	queued: false,
	message: "we all",
	config: {},
	onExit: (e: ISnackEvent) => {},
	onEnter: (e: ISnackEvent) => {},
	onExited: (e: ISnackEvent) => {},
	onEntered: (e: ISnackEvent) => {},
	onExiting: (e: ISnackEvent) => {},
	onEntering: (e: ISnackEvent) => {},
}){}

export type SnacksState = OrderedMap<string, Snack>

export const state = OrderedMap<string, Snack>()

export const reducers = {

	ENQUEUE_SNACK( state: SnacksState, { type, payload }: any ){

		const snack = new Snack({
			key: String(nonce++),
			message: payload,
			queued: false,
		});

		return state.set(snack.key, snack);
	},

	SNACK_QUEUED(state: SnacksState, { payload }: any){
		
		if(state.has(payload)){

			return state.withMutations( state => {
				state.setIn([payload, "state"], "PENDING");
			});

		}else {

			return state;
		}
	},

	SNACK_EXIT( state: SnacksState, { payload }: any ){

		if(state.has(payload)){

			return state.withMutations( state => {
				state.setIn([payload, "state"], "EXIT");
			});

		}else {

			return state;
		}

	},

	SNACK_EXITING( state: SnacksState, { payload }: any ){

		if(state.has(payload)){

			return state.withMutations( state => {
				state.setIn([payload, "state"], "EXITING");
			});

		}else {

			return state;
		}

	},

	SNACK_EXITED( state: SnacksState, { payload }: any ){

		if(state.has(payload)){

			return state.withMutations( state => {
				state.setIn([payload, "state"], "EXITED");
			});

		}else {

			return state;
		}

	},

	SNACK_ENTER( state: SnacksState, { payload }: any ){

		if(state.has(payload)){

			return state.withMutations( state => {
				state.setIn([payload, "state"], "ENTER");
			});

		}else {

			return state;
		}

	},


	SNACK_ENTERING( state: SnacksState, { payload }: any ){

		if(state.has(payload)){

			return state.withMutations( state => {
				state.setIn([payload, "state"], "ENTERING");
			});

		}else {

			return state;
		}

	},

	SNACK_ENTERED( state: SnacksState, { payload }: any ){

		if(state.has(payload)){

			return state.withMutations( state => {
				state.setIn([payload, "state"], "ENTERED");
			});

		}else {

			return state;
		}

	},

	REMOVE_SNACK( state: SnacksState, { payload }: any ){
		return state.delete(payload);
	}

};

export default { state, reducers }
