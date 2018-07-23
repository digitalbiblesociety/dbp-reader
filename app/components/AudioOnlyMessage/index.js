/**
 *
 * AudioOnlyMessage
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import SvgWrapper from '../SvgWrapper';
import messages from './messages';

function AudioOnlyMessage({ chapter, book }) {
	return (
		<div className={'audio-only'}>
			<SvgWrapper svgid={'audio_only'} />
			<p>{`${book} ${chapter}`}</p>
			<span className={'divider'} />
			<FormattedMessage {...messages.audioOnly} />
		</div>
	);
}

AudioOnlyMessage.propTypes = {
	chapter: PropTypes.number,
	book: PropTypes.string,
};

export default AudioOnlyMessage;
