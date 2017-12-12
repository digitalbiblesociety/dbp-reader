/**
*
* FontSelector
*
*/

import React from 'react';
// import styled from 'styled-components';

import { FormattedMessage } from 'react-intl';
import messages from './messages';

function FontSelector() {
	return (
		<div>
			<FormattedMessage {...messages.header} />
		</div>
	);
}

FontSelector.propTypes = {

};

export default FontSelector;
