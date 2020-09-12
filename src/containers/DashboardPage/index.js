import { connect } from 'react-redux';
import DashboardPage from './DashboardPage';
import { reset } from '../../actions/DashboardPage';

const mapsStateToProps = state => ({
	pageProps: state.DashboardPageReducer
});

const mapsDispatchToProps = dispatch => ({
	reset: () => dispatch(reset())
});

export default connect(
	mapsStateToProps,
	mapsDispatchToProps
)(DashboardPage);
