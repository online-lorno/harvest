import React, { Component } from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';

// layouts
import BasicLayout from './layouts/basic-layout';

// containers
import DashboardPage from './containers/DashboardPage';


const routes = [
	{ path: '/', exact: true, Layout: BasicLayout, Component: DashboardPage }
];

export class Routes extends Component {
	render() {
		const { location } = this.props;
		return (
			<Switch location={location}>
				{routes.map(({ path, exact, Layout, Component }) => (
					<Route
						key={0}
						path={path}
						exact={exact}
						render={props => (
							<Layout location={location}>
								<Component {...props} />
							</Layout>
						)}
					/>
				))}
			</Switch>
		);
	}
}

export default withRouter(Routes);
