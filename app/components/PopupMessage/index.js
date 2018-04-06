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

function PopupMessage({ message, x, y }) {
	// console.log(x, y)
	const component = (
		<div style={{ top: y - 50, left: x - 87.5 }} className={'custom-popup'}>
			{message}
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
};

export default PopupMessage;
