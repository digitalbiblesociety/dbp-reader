/**
*
* ThemeSelector
*
*/

import React from 'react';
// import styled from 'styled-components';

import { FormattedMessage } from 'react-intl';
import messages from './messages';

function ThemeSelector() {
	return (
		<div>
			<FormattedMessage {...messages.header} />
		</div>
	);
}

ThemeSelector.propTypes = {

};

export default ThemeSelector;
