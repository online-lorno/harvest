import * as ActionTypes from '../constants/ActionTypes';

const initialState = {};

export default function reducer(state = initialState, action) {
	switch (action.type) {
		case ActionTypes.RESET_DASHBOARD_PAGE:
			return {
				...initialState
			};
		default:
			return state;
	}
}
