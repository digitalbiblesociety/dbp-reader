/**
 *
 * FootnotePortal
 *
 */

import React from 'react';
import ReactDOM from 'react-dom';

function FootnotePortal({ message, coords, closeFootnote }) {
	const component = (
		<div
			className={'footnote-portal-container'}
			style={{ left: coords.x, top: coords.y }}
		>
			<span role={'button'} tabIndex={0} onClick={closeFootnote}>
				X
			</span>
			<p>{message}</p>
		</div>
	);
	return ReactDOM.createPortal(component, document.getElementById('__next'));
}

FootnotePortal.propTypes = {};

export default FootnotePortal;
