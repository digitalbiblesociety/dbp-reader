/**
*
* FontSizeSelector
*
*/

import React from 'react';
// import styled from 'styled-components';

import { FormattedMessage } from 'react-intl';
import messages from './messages';

function FontSizeSelector() {
	return (
		<div>
			<FormattedMessage {...messages.header} />
		</div>
	);
}

FontSizeSelector.propTypes = {

};

export default FontSizeSelector;
