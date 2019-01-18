/**
 *
 * PlainTextVerses
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import PlainTextVerse from '../PlainTextVerse';
import ReadersModeVerse from '../ReadersModeVerse';

const PlainTextVerses = ({
	textComponents,
	onMouseUp,
	onMouseDown,
	onNoteClick,
	onHighlightClick,
	readersMode,
	oneVersePerLine,
	verseIsActive,
	activeVerse,
}) => {
	console.log(
		'functions',
		'\nonMouseUp',
		onMouseUp,
		'\nonMouseDown',
		onMouseDown,
		'\nonNoteClick',
		onNoteClick,
		'\nonHighlightClick',
		onHighlightClick,
	);
	if (readersMode) {
		return textComponents.map((verse) => (
			<ReadersModeVerse
				verse={verse}
				onMouseUp={onMouseUp}
				onMouseDown={onMouseDown}
				onHighlightClick={onHighlightClick}
				activeVerse={activeVerse}
				verseIsActive={verseIsActive}
			/>
		));
	}
	return textComponents.map((verse) => (
		<PlainTextVerse
			verse={verse}
			onMouseUp={onMouseUp}
			onMouseDown={onMouseDown}
			onNoteClick={onNoteClick}
			onHighlightClick={onHighlightClick}
			activeVerse={activeVerse}
			verseIsActive={verseIsActive}
			oneVerse={oneVersePerLine}
		/>
	));
};

PlainTextVerses.propTypes = {
	textComponents: PropTypes.array,
	onMouseUp: PropTypes.function,
	onMouseDown: PropTypes.function,
	onNoteClick: PropTypes.function,
	onHighlightClick: PropTypes.function,
	readersMode: PropTypes.bool,
	oneVersePerLine: PropTypes.bool,
	verseIsActive: PropTypes.bool,
	activeVerse: PropTypes.number,
};

export default PlainTextVerses;
