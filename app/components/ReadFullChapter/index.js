/**
 *
 * ReadFullChapter
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import PrefetchLink from '../../utils/PrefetchLink';
// import styled from 'styled-components';
import messages from './messages';

function ReadFullChapter({ activeTextId, activeBookId, activeChapter }) {
	return (
		<div className={'read-chapter-container'}>
			<PrefetchLink
				prefetch
				withData
				href={`/app?bibleId=${activeTextId.toLowerCase()}&bookId=${activeBookId.toLowerCase()}&chapter=${activeChapter}`}
				as={`/bible/${activeTextId.toLowerCase()}/${activeBookId.toLowerCase()}/${activeChapter}`}
			>
				<button className={'read-chapter'}>
					<FormattedMessage {...messages.readFullChapter} />
				</button>
			</PrefetchLink>
		</div>
	);
}

ReadFullChapter.propTypes = {
	activeTextId: PropTypes.string,
	activeBookId: PropTypes.string,
	activeChapter: PropTypes.number,
};

export default ReadFullChapter;
