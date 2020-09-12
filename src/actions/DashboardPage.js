// import { push } from 'connected-react-router';
import * as ActionTypes from '../constants/ActionTypes';

export function reset() {
	return async dispatch => {
		dispatch({
			type: ActionTypes.RESET_DASHBOARD_PAGE
		});
	};
}