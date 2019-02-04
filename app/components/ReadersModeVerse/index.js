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
			dangerouslySetInnerHTML={{ __html: verse.verse_text }}
		/>
		<span key={`${verse.verse_end}spaces`} className={'readers-spaces'}>
			&nbsp;
		</span>
	</>
);

ReadersModeVerse.propTypes = {
	onMouseUp: PropTypes.func,
	onMouseDown: PropTypes.func,
	onHighlightClick: PropTypes.func,
	verse: PropTypes.object,
	activeVerse: PropTypes.number,
	verseIsActive: PropTypes.bool,
};

export default ReadersModeVerse;
