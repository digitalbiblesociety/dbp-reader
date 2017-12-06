/**
*
* ChapterButton
*
*/

import React from 'react';
import PropTypes from 'prop-types';
// import styled from 'styled-components';

// import { FormattedMessage } from 'react-intl';
// import messages from './messages';

function ChapterButton({ toggleBookNames }) {
	return (
		<button className="chapter-button" onClick={toggleBookNames}>
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 34 24">
				<path d="M.8 4.5v18.3s8-5.7 14.8 0H17V3C6.2-4 .8 4.6.8 4.6zM15 6v12.5c-6.2-3-11.2-.5-11.2-.5V6s2.5-2.4 5.5-2.4S15 6 15 6zm2-3v19.7h1.3c6.7-5.5 15 0 15 0v-18S27.6-4 17 3zm13.2 15s-5-2.4-11.2.5V6s2.7-2.4 5.6-2.4c3 0 5.6 2.3 5.6 2.3v12z"></path>
				<path fill="#FFF" d="M.8 5.5v18.3s8-5.7 14.8 0H17V4C6.2-3 .8 5.6.8 5.6zM15 7v12.5c-6.2-3-11.2-.5-11.2-.5V7s2.5-2.4 5.5-2.4S15 7 15 7zm2-3v19.7h1.3c6.7-5.5 15 0 15 0v-18S27.6-3 17 4zm13.2 15s-5-2.4-11.2.5V7s2.7-2.4 5.6-2.4c3 0 5.6 2.3 5.6 2.3v12z"></path>
			</svg>
		</button>
	);
}

ChapterButton.propTypes = {
	toggleBookNames: PropTypes.func,
};

export default ChapterButton;
