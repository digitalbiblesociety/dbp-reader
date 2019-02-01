/**
 *
 * PlainTextVerse
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import IconsInText from '../IconsInText';
import customStyle from '../../utils/customVerseStyle';

const PlainTextVerse = ({
	onMouseUp,
	onMouseDown,
	onHighlightClick,
	onNoteClick,
	verse,
	activeVerse,
	verseIsActive,
	oneVerse,
}) => (
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
	>
		{oneVerse && <br />}
		<sup data-verseid={verse.verse_start}>
			&nbsp;
			{verse.verse_start_alt || verse.verse_start}
			&nbsp;
		</sup>
		<IconsInText
			clickHandler={onNoteClick}
			bookmarkData={{
				hasBookmark: verse.hasBookmark,
				index: verse.bookmarkIndex,
			}}
			noteData={{ hasNote: verse.hasNote, index: verse.noteIndex }}
		/>
		{verse.hasHighlight ? (
			<span
				data-verseid={verse.verse_start}
				dangerouslySetInnerHTML={{ __html: verse.verse_text }} // eslint-disable-line react/no-danger
			/>
		) : (
			<span data-verseid={verse.verse_start}>{verse.verse_text}</span>
		)}
	</span>
);

PlainTextVerse.propTypes = {
	onMouseUp: PropTypes.func,
	onMouseDown: PropTypes.func,
	onHighlightClick: PropTypes.func,
	onNoteClick: PropTypes.func,
	verse: PropTypes.object,
	activeVerse: PropTypes.number,
	verseIsActive: PropTypes.bool,
	oneVerse: PropTypes.bool,
};

export default PlainTextVerse;
