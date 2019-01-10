/**
 *
 * Ieerror
 *
 */

import React from 'react';
import { FormattedMessage } from 'react-intl';
import messages from './messages';

function Ieerror() {
	return (
		<div id={'internet-explorer-container'}>
			<FormattedMessage {...messages.noSupport} />
			&nbsp;
			<a href={'https://www.google.com/chrome'} target={'_blank'}>
				<FormattedMessage {...messages.chrome} />
			</a>
			&nbsp;
			<FormattedMessage {...messages.noSupportOr} />
			&nbsp;
			<a href={'https://www.mozilla.org/en-US/firefox/'} target={'_blank'}>
				<FormattedMessage {...messages.firefox} />
			</a>
		</div>
	);
}

Ieerror.propTypes = {};

export default Ieerror;
