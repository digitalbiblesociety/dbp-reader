/**
 *
 * PlainText
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import createHighlights from '../../containers/Text/highlightPlainText';
import PlainTextVerses from '../PlainTextVerses';

class PlainText extends React.PureComponent {
	setHighlights = (highlights, userAuthenticated, text, activeChapter) => {
		if (
			highlights.length &&
			userAuthenticated &&
			text.length &&
			createHighlights
		) {
			// Use function for highlighting the plain plainText
			// TODO: Can remove filter once I fix the problem with the new highlights not being fetched
			return createHighlights(
				highlights.filter((h) => h.chapter === activeChapter),
				text,
			);
		}
		return text || [];
	};

	mapHighlights = (highlights) =>
		highlights.map((v) => {
			const highlightsInVerse = highlights.filter(
				(h) => v.verse_start === h.verse_start && !h.highlighted_words,
			);
			const wholeVerseHighlighted = !!highlightsInVerse.length;
			if (wholeVerseHighlighted) {
				const highlightedColor = highlightsInVerse[highlightsInVerse.length - 1]
					? highlightsInVerse[highlightsInVerse.length - 1].highlighted_color
					: '';

				return { ...v, wholeVerseHighlighted, highlightedColor };
			}
			return v;
		});

	render() {
		const {
			highlights,
			activeChapter,
			verseNumber,
			userAuthenticated,
			userSettings,
			activeVerseInfo,
			// Functions
			handleMouseUp,
			getFirstVerse,
			handleHighlightClick,
			handleNoteClick,
			initialText,
		} = this.props;
		// Needs to be state eventually

		const chapterAlt = initialText[0] && initialText[0].chapter_alt;
		const verseIsActive = activeVerseInfo.verse && activeVerseInfo.isPlain;
		const activeVerse = activeVerseInfo.verse || 0;
		const readersMode = userSettings.getIn([
			'toggleOptions',
			'readersMode',
			'active',
		]);
		const oneVersePerLine = userSettings.getIn([
			'toggleOptions',
			'oneVersePerLine',
			'active',
		]);
		const justifiedText = userSettings.getIn([
			'toggleOptions',
			'justifiedText',
			'active',
		]);

		// Mapping the text again here because I need to apply a class for all highlights with a char count of null
		const mappedText = this.mapHighlights(
			this.setHighlights(
				highlights,
				userAuthenticated,
				initialText,
				activeChapter,
			),
		);

		const textComponents = PlainTextVerses({
			textComponents: mappedText,
			onMouseUp: handleMouseUp,
			onMouseDown: getFirstVerse,
			onHighlightClick: handleHighlightClick,
			onNoteClick: handleNoteClick,
			readersMode,
			oneVersePerLine,
			activeVerse: parseInt(activeVerse, 10),
			verseIsActive: !!verseIsActive,
		});

		// Puts in dropcaps chapter number
		if (!readersMode && !oneVersePerLine && Array.isArray(textComponents)) {
			textComponents.unshift(
				<span key={'chapterNumber'} className={'drop-caps'}>
					{chapterAlt || activeChapter}
				</span>,
			);
		}
		// Using parseInt to determine whether or not the verseNumber is a real number or if it is a series of characters
		if (verseNumber && Array.isArray(textComponents)) {
			return (
				<div className={justifiedText ? 'chapter justify' : 'chapter'}>
					<div className={'single-formatted-verse'}>
						{textComponents.filter(
							(c) => c.key === (parseInt(verseNumber, 10) ? verseNumber : '1'),
						)}
					</div>
				</div>
			);
		}

		return (
			<div className={justifiedText ? 'chapter justify' : 'chapter'}>
				{textComponents}
			</div>
		);
	}
}

PlainText.propTypes = {
	highlights: PropTypes.array,
	initialText: PropTypes.array,
	activeChapter: PropTypes.number,
	verseNumber: PropTypes.string,
	userAuthenticated: PropTypes.bool,
	userSettings: PropTypes.object,
	activeVerseInfo: PropTypes.object,
	handleMouseUp: PropTypes.func,
	getFirstVerse: PropTypes.func,
	handleHighlightClick: PropTypes.func,
	handleNoteClick: PropTypes.func,
};

export default PlainText;
