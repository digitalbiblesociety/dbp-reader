/**
 *
 * DonateButton
 *
 */

import React from 'react';
import { FormattedMessage } from 'react-intl';
import messages from './messages';
// Use below for source before pushing to dev/prod
// `${process.env.CDN_STATIC_FILES}/fcbh_donate_img.png`
function DonateButton() {
	return (
		<a
			target={'_blank'}
			href={'http://www.bible.is/donate'}
			className={'donate-button'}
		>
			<img
				id="donate-image"
				alt="donate"
				src={`${process.env.CDN_STATIC_FILES}/fcbh_donate_img.png`}
			/>
			<FormattedMessage {...messages.donate} />
		</a>
	);
}

DonateButton.propTypes = {};

export default DonateButton;
