/**
 *
 * ReadersModeVerse
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import customStyle from '../../utils/customVerseStyle';

const ReadersModeVerse = ({
	onMouseUp,
	onMouseDown,
	onHighlightClick,
	verse,
	activeVerse,
	verseIsActive,
}) => (
	<>
		<span
			onMouseUp={onMouseUp}
			onMouseDown={onMouseDown}
			onClick={onHighlightClick}
			style={customStyle(verse)}
			className={
				verseIsActive &&
				(parseInt(activeVerse, 10) === verse.verse_start ||
					activeVerse === verse.verse_start_alt)
					? 'align-left active-verse'
					: 'align-left'
			}
			data-verseid={verse.verse_start}
			key={verse.verse_start}
			dangerouslySetInnerHTML={
				verse.hasHighlight && { __html: verse.verse_text }
			}
		>
			{!verse.hasHighlight && verse.verse_text}
		</span>
		<span key={`${verse.verse_end}spaces`} className={'readers-spaces'}>
			&nbsp;
		</span>
	</>
);

ReadersModeVerse.propTypes = {
	onMouseUp: PropTypes.function,
	onMouseDown: PropTypes.function,
	onHighlightClick: PropTypes.function,
	verse: PropTypes.object,
	activeVerse: PropTypes.number,
	verseIsActive: PropTypes.bool,
};

export default ReadersModeVerse;
