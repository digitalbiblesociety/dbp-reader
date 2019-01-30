/**
 *
 * Verses
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
// Utils
import PlainTextVerses from '../../components/PlainTextVerses';
import createHighlights from '../Text/highlightPlainText';

import injectReducer from '../../utils/injectReducer';
// Reducers
import reducer from './reducer';
import homeReducer from '../HomePage/reducer';
// Selectors
import makeSelectVerses, { makeSelectHome } from './selectors';
import makeSelectHomePage, { selectUserNotes } from '../HomePage/selectors';

export class Verses extends React.PureComponent {
	state = {
		footnoteState: false,
		coords: {},
		selectedText: '',
		userSelectedText: '',
		firstVerse: 0,
		lastVerse: 0,
		highlightActive: this.props.homepage.highlights || false,
		handlersAreSet: false,
		handledMouseDown: false,
		activeVerseInfo: { verse: 0 },
		wholeVerseIsSelected: false,
		domMethodsAvailable: false,
		formattedVerse: false,
		footnotes: {},
	};
	getPlainTextComponents() {
		const { highlights, activeChapter, verseNumber } = this.props.homepage;
		const { text: initialText } = this.props.textData;
		const { userAuthenticated, userSettings } = this.props;
		// Needs to be state eventually
		const { activeVerseInfo } = this.state;

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
		let plainText = [];
		if (
			highlights.length &&
			userAuthenticated &&
			initialText.length &&
			this.createHighlights
		) {
			// Use function for highlighting the plain plainText
			// TODO: Can remove filter once I fix the problem with the new highlights not being fetched
			plainText = createHighlights(
				highlights.filter((h) => h.chapter === activeChapter),
				initialText,
			);
		} else {
			plainText = initialText || [];
		}

		let textComponents;
		// Mapping the text again here because I need to apply a class for all highlights with a char count of null
		const mappedText = plainText.map((v) => {
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
		// Todo: Should handle each mode for formatted text and plain text in a separate component
		// Handle exception thrown when there isn't plain text but readers mode is selected
		if (readersMode) {
			textComponents = PlainTextVerses({
				textComponents: mappedText,
				onMouseUp: this.handleMouseUp,
				onMouseDown: this.getFirstVerse,
				onHighlightClick: this.handleHighlightClick,
				onNoteClick: this.handleNoteClick,
				readersMode,
				oneVersePerLine,
				activeVerse: parseInt(activeVerse, 10),
				verseIsActive: !!verseIsActive,
			});
		} else if (oneVersePerLine) {
			textComponents = PlainTextVerses({
				textComponents: mappedText,
				onMouseUp: this.handleMouseUp,
				onMouseDown: this.getFirstVerse,
				onHighlightClick: this.handleHighlightClick,
				onNoteClick: this.handleNoteClick,
				readersMode,
				oneVersePerLine,
				activeVerse: parseInt(activeVerse, 10),
				verseIsActive: !!verseIsActive,
			});
		} else {
			textComponents = PlainTextVerses({
				textComponents: mappedText,
				onMouseUp: this.handleMouseUp,
				onMouseDown: this.getFirstVerse,
				onHighlightClick: this.handleHighlightClick,
				onNoteClick: this.handleNoteClick,
				readersMode,
				oneVersePerLine,
				activeVerse: parseInt(activeVerse, 10),
				verseIsActive: !!verseIsActive,
			});
		}

		if (
			!readersMode &&
			!oneVersePerLine &&
			Array.isArray(textComponents) &&
			textComponents[0].key !== 'no_text'
		) {
			textComponents.unshift(
				<span key={'chapterNumber'} className={'drop-caps'}>
					{chapterAlt || activeChapter}
				</span>,
			);
		}
		// Using parseInt to determine whether or not the verseNumber is a real number or if it is a series of characters
		if (verseNumber && Array.isArray(textComponents)) {
			return textComponents.filter(
				(c) => c.key === (parseInt(verseNumber, 10) ? verseNumber : '1'),
			);
		}

		if ((readersMode || oneVersePerLine) && Array.isArray(textComponents)) {
			return (
				<div className={justifiedText ? 'chapter justify' : 'chapter'}>
					{textComponents}
				</div>
			);
		}
		return textComponents;
	}

	render() {
		const { activeChapter, formattedSource } = this.props.homepage;
		const { text } = this.props.textData;
		// const { text, activeChapter, formattedSource } = this.props.homepage;
		const { userSettings } = this.props;
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
		const chapterAlt = text[0] && text[0].chapter_alt;

		return (
			<>
				{(formattedSource.main && !readersMode && !oneVersePerLine) ||
				text.length === 0 ||
				(!readersMode && !oneVersePerLine) ? null : (
					<div className="active-chapter-title">
						<h1 className="active-chapter-title">
							{chapterAlt || activeChapter}
						</h1>
					</div>
				)}
				{/* {formattedSource.main && !readersMode && !oneVersePerLine
          ? this.getTextComponents(this.state.domMethodsAvailable)
          : this.getPlainTextComponents()} */}
				{this.getPlainTextComponents()}}
			</>
		);
	}
}

Verses.propTypes = {
	dispatch: PropTypes.func.isRequired,
	homepage: PropTypes.object.isRequired,
	// Other state
	userSettings: PropTypes.object,
	userAuthenticated: PropTypes.bool,
	userId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	textData: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
	verses: makeSelectVerses(),
	homepage: makeSelectHomePage(),
	textData: selectUserNotes(),
});

function mapDispatchToProps(dispatch) {
	return {
		dispatch,
	};
}

const withConnect = connect(
	mapStateToProps,
	mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'verses', reducer });
const withHomeReducer = injectReducer({
	key: 'homepage',
	reducer: homeReducer,
});

export default compose(
	withHomeReducer,
	withReducer,
	withConnect,
)(Verses);
