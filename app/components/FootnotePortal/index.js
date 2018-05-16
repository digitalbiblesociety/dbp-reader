/**
*
* FootnotePortal
*
*/

import React from 'react';
import ReactDOM from 'react-dom';
// Need to make sure that the box doesn't extend off the screen
// import { FormattedMessage } from 'react-intl';
// import messages from './messages';

function FootnotePortal({ message, coords, closeFootnote }) {
	const component = (
		<div className={'footnote-portal-container'} style={{ left: coords.x, top: coords.y }}>
			<span role={'button'} tabIndex={0} onClick={closeFootnote}>X</span>
			<p>{message}</p>
		</div>
	);
	return ReactDOM.createPortal(component, document.getElementById('app'));
}

FootnotePortal.propTypes = {

};

export default FootnotePortal;
