import React, { Component } from 'react';

export class BasicLayout extends Component {
	render() {
		return (
			<React.Fragment>
				{this.props.children}
			</React.Fragment>
		);
	}
}

export default BasicLayout;
