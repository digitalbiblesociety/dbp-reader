/**
 *
 * ChaptersContainer
 *
 */

import React from 'react';
// import styled from 'styled-components';

import { FormattedMessage } from 'react-intl';
import messages from './messages';

function ChaptersContainer() {
	return (
		<div>
			<FormattedMessage {...messages.header} />
		</div>
	);
}

ChaptersContainer.propTypes = {};

export default ChaptersContainer;
