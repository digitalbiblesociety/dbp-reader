/**
 *
 * PlainTextVerses
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import PlainTextVerse from '../PlainTextVerse';

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
	if (readersMode) {
		// return reader components
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
