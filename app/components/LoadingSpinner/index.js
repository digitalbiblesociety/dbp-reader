/**
 *
 * LoadingSpinner
 *
 */

import React from 'react';
import PropTypes from 'prop-types';

function LoadingSpinner({ styles }) {
	return (
		<div style={styles} className="loading-spinner">
			<span className="loading-spinner1 loading-spinner-child" />
			<span className="loading-spinner2 loading-spinner-child" />
			<span className="loading-spinner3 loading-spinner-child" />
			<span className="loading-spinner4 loading-spinner-child" />
			<span className="loading-spinner5 loading-spinner-child" />
			<span className="loading-spinner6 loading-spinner-child" />
			<span className="loading-spinner7 loading-spinner-child" />
			<span className="loading-spinner8 loading-spinner-child" />
			<span className="loading-spinner9 loading-spinner-child" />
			<span className="loading-spinner10 loading-spinner-child" />
			<span className="loading-spinner11 loading-spinner-child" />
			<span className="loading-spinner12 loading-spinner-child" />
		</div>
	);
}

LoadingSpinner.propTypes = {
	styles: PropTypes.object,
};

export default LoadingSpinner;
