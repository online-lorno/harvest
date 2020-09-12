import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';

import DashboardPage from './DashboardPage';

export default history =>
	combineReducers({
		router: connectRouter(history),
		dashboardPageReducer: DashboardPage
	});