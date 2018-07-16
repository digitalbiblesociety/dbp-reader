/**
 *
 * PopupMessage
 *
 */

import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
// import App from 'containers/App';
// import styled from 'styled-components';

function PopupMessage({ styles, message, x, y }) {
	// console.log(styles);
	// console.log({ top: y - 50, left: x - 87.5, ...styles });
	const component = (
		<div
			style={{ top: y - 50, left: x - 87.5, ...styles }}
			className={'custom-popup'}
		>
			<p>
				{message} If you believe this to be an error please{' '}
				<a
					className={'logo'}
					href={'https://support.bible.is/contact'}
					title={'https://support.bible.is/contact'}
					target={'_blank'}
					rel={'noopener'}
				>
					contact support
				</a>.
			</p>
		</div>
	);
	// console.log(parentComponent);
	// console.log(App);
	// if (parentComponent) {
	// 	return ReactDOM.createPortal(component, parentComponent);
	// }

	return ReactDOM.createPortal(component, document.getElementById('app'));
}

PopupMessage.propTypes = {
	message: PropTypes.string.isRequired,
	x: PropTypes.number,
	y: PropTypes.number,
	styles: PropTypes.object,
};

export default PopupMessage;
