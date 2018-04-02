/**
*
* HighlightColors
*
*/

import React from 'react';
import PropTypes from 'prop-types';
// import styled from 'styled-components';

import { FormattedMessage } from 'react-intl';
import messages from './messages';

function HighlightColors({ addHighlight }) {
	return (
		<React.Fragment>
			<span className={'color-group'}>
				<span role={'button'} tabIndex={0} className={'none'} onClick={() => addHighlight({ color: 'none' })} />
				<span className={'color-text'}><FormattedMessage {...messages.none} /></span>
			</span>
			<span className={'color-group'}>
				<span role={'button'} tabIndex={-1} className={'yellow'} onClick={() => addHighlight({ color: 'FD2' })} />
				<span className={'color-text'}><FormattedMessage {...messages.yellow} /></span>
			</span>
			<span className={'color-group'}>
				<span role={'button'} tabIndex={-2} className={'green'} onClick={() => addHighlight({ color: '5B4' })} />
				<span className={'color-text'}><FormattedMessage {...messages.green} /></span>
			</span>
			<span className={'color-group'}>
				<span role={'button'} tabIndex={-3} className={'pink'} onClick={() => addHighlight({ color: 'D6A' })} />
				<span className={'color-text'}><FormattedMessage {...messages.pink} /></span>
			</span>
			<span className={'color-group'}>
				<span role={'button'} tabIndex={-4} className={'purple'} onClick={() => addHighlight({ color: '86A' })} />
				<span className={'color-text'}><FormattedMessage {...messages.purple} /></span>
			</span>
			<span className={'color-group'}>
				<span role={'button'} tabIndex={-5} className={'blue'} onClick={() => addHighlight({ color: '1AF' })} />
				<span className={'color-text'}><FormattedMessage {...messages.blue} /></span>
			</span>
		</React.Fragment>
	);
}

HighlightColors.propTypes = {
	addHighlight: PropTypes.func,
};

export default HighlightColors;
