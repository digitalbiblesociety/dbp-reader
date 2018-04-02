/**
*
* HighlightColors
*
*/

import React from 'react';
// import styled from 'styled-components';

import { FormattedMessage } from 'react-intl';
import messages from './messages';

function HighlightColors() {
	return (
		<React.Fragment>
			<span className={'color-group'}>
				<span className={'none'} />
				<span className={'color-text'}><FormattedMessage {...messages.none} /></span>
			</span>
			<span className={'color-group'}>
				<span className={'yellow'} />
				<span className={'color-text'}><FormattedMessage {...messages.yellow} /></span>
			</span>
			<span className={'color-group'}>
				<span className={'green'} />
				<span className={'color-text'}><FormattedMessage {...messages.green} /></span>
			</span>
			<span className={'color-group'}>
				<span className={'pink'} />
				<span className={'color-text'}><FormattedMessage {...messages.pink} /></span>
			</span>
			<span className={'color-group'}>
				<span className={'purple'} />
				<span className={'color-text'}><FormattedMessage {...messages.purple} /></span>
			</span>
			<span className={'color-group'}>
				<span className={'blue'} />
				<span className={'color-text'}><FormattedMessage {...messages.blue} /></span>
			</span>
		</React.Fragment>
	);
}

HighlightColors.propTypes = {

};

export default HighlightColors;
