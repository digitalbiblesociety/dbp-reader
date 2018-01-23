/**
*
* SearchButton
*
*/

import React from 'react';
// import styled from 'styled-components';

// import { FormattedMessage } from 'react-intl';
// import messages from './messages';

function SearchButton() {
	return (
		<button className="search-button" type="submit">
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="-12.8 -13.9 32.9 33.8">
				<path opacity=".8" fill="#231F20" d="M18.4 13.5L10 6c1.5-1.8 2.3-4.8 2.3-7.5C12.3-8 6.6-13-.2-13s-12 5-12 11.5S-7 10.3 0 10.3c2 0 4.3-.4 5.8-1l8.5 8c.6.7 1.5.7 2 0l2-1.8c.6-.6.6-1.4 0-2zM0 5.5c-4 0-7.2-3-7.2-7 0-3.7 3.3-7 7.3-7 4.3 0 7.5 3.3 7.5 7 0 4-3.2 7-7.3 7z"></path>
				<path fill="#FFF" d="M18.4 14.5L10 7c1.5-1.8 2.3-4.8 2.3-7.5C12.3-7 6.6-12-.2-12s-12 5-12 11.5S-7 11.3 0 11.3c2 0 4.3-.4 5.8-1l8.5 8c.6.7 1.5.7 2 0l2-1.8c.6-.6.6-1.4 0-2zM0 6.5c-4 0-7.2-3-7.2-7 0-3.7 3.3-7 7.3-7 4.3 0 7.5 3.3 7.5 7 0 4-3.2 7-7.3 7z"></path>
			</svg>
		</button>
	);
}

export default SearchButton;
