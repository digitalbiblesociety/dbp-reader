/**
*
* AudioOnlyMessage
*
*/

import React from 'react';
import PropTypes from 'prop-types';
import SvgWrapper from 'components/SvgWrapper';
import { FormattedMessage } from 'react-intl';
import messages from './messages';

function AudioOnlyMessage({ chapter, book }) {
	return (
		<div className={'audio-only'}>
			<SvgWrapper svgid={'audio_only'} />
			<p>{`${book} ${chapter}`}</p>
			<FormattedMessage {...messages.audioOnly} />
		</div>
	);
}

AudioOnlyMessage.propTypes = {
	chapter: PropTypes.number,
	book: PropTypes.string,
};

export default AudioOnlyMessage;
