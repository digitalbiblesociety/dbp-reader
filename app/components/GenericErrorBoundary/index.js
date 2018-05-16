/**
*
* GenericErrorBoundary
*
*/

import React from 'react';
import PropTypes from 'prop-types';
// import styled from 'styled-components';

// const Container = styled.div`
// 	padding:15px;
// `;

// import { FormattedMessage } from 'react-intl';
// import messages from './messages';

class GenericErrorBoundary extends React.Component {
	constructor(props) {
		super(props);
		this.state = { error: null, errorInfo: null };
	}

	componentDidCatch(error, errorInfo) {
		// Catch errors in any components below and re-render with error message
		this.setState({ error, errorInfo });
        // TODO: log error messages to an error reporting service here
	}

	render() {
		if (this.state.errorInfo) {
			// Error path
			return (
				<div>
					<h2>{`Something went wrong in the ${this.props.affectedArea} component. Please try refreshing the page, if that does not work send an email to Jesse and tell him what the error message was so he can fix it.`}</h2>
					<details style={{ whiteSpace: 'pre-wrap' }}>
						{this.state.error && this.state.error.toString()}
						<br />
						{this.state.errorInfo.componentStack}
					</details>
				</div>
			);
		}
		// Normally, just render children
		return this.props.children;
	}
}

GenericErrorBoundary.propTypes = {
	children: PropTypes.node,
	affectedArea: PropTypes.string,
};

export default GenericErrorBoundary;
