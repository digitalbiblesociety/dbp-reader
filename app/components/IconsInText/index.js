/**
 *
 * IconsInText
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import SvgWrapper from '../SvgWrapper';

function IconsInText({ noteData, bookmarkData, clickHandler }) {
	if (noteData.hasNote && bookmarkData.hasBookmark) {
		return [
			<SvgWrapper
				key={'bookmark_icon'}
				onClick={() => clickHandler(bookmarkData.index, true)}
				className={'icon note-in-verse'}
				svgid={'bookmark_in_verse'}
			/>,
			<SvgWrapper
				key={'note_icon'}
				onClick={() => clickHandler(noteData.index, false)}
				className={'icon note-in-verse'}
				svgid={'note_in_verse'}
			/>,
		];
	} else if (noteData.hasNote) {
		return (
			<SvgWrapper
				key={'note_icon'}
				onClick={() => clickHandler(noteData.index, false)}
				className={'icon note-in-verse'}
				svgid={'note_in_verse'}
			/>
		);
	} else if (bookmarkData.hasBookmark) {
		return (
			<SvgWrapper
				key={'bookmark_icon'}
				onClick={() => clickHandler(bookmarkData.index, true)}
				className={'icon note-in-verse'}
				svgid={'bookmark_in_verse'}
			/>
		);
	}

	return null;
}

IconsInText.propTypes = {
	noteData: PropTypes.object,
	bookmarkData: PropTypes.object,
	clickHandler: PropTypes.func,
};

export default IconsInText;
