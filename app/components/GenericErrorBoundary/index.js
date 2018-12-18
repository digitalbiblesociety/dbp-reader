/**
 *
 * GenericErrorBoundary
 *
 */

import React from 'react';
import PropTypes from 'prop-types';

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
			if (process.env.NODE_ENV === 'development') {
				return (
					<div>
						<section style={{ whiteSpace: 'pre-wrap', color: 'black' }}>
							{this.state.error && this.state.error.toString()}
							<br />
							{this.state.errorInfo.componentStack}
							{JSON.stringify(this.state.errorInfo)}
						</section>
					</div>
				);
			} else if (window && window.location) {
				window.location.reload();
			}
		}
		// Normally, just render children
		return this.props.children;
	}
}

GenericErrorBoundary.propTypes = {
	children: PropTypes.node,
};

export default GenericErrorBoundary;
