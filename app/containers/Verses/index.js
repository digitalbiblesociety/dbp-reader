/**
 *
 * Verses
 * Connected to Store and manages state for all actions within the Verses
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import isEqual from 'lodash/isEqual';
// Components
import PopupMessage from '../../components/PopupMessage';
import PleaseSignInMessage from '../../components/PleaseSignInMessage';
import ContextPortal from '../../components/ContextPortal';
import FootnotePortal from '../../components/FootnotePortal';
import ReadFullChapter from '../../components/ReadFullChapter';
import Information from '../../components/Information';
import AudioOnlyMessage from '../../components/AudioOnlyMessage';
import PlainText from '../../components/PlainText';
// Utils
import injectReducer from '../../utils/injectReducer';
import {
	getFormattedParentVerseNumber,
	getPlainParentVerse,
	getFormattedParentVerse,
	getFormattedChildIndex,
	getFormattedElementVerseId,
	getPlainParentVerseWithoutNumber,
	getClosestParent,
	getOffsetNeededForPsalms,
	replaceCharsRegex,
	getReference,
	calcDistance,
} from '../../utils/highlightingUtils';
import getFirstSelectedVerse from '../../utils/requiresDom/getFirstSelectedVerse';
import getLastSelectedVerse from '../../utils/requiresDom/getLastSelectedVerse';
import addHighlightUtil from '../../utils/requiresDom/addHighlight';
import shareHighlightToFacebook from '../../utils/requiresDom/shareToFacebook';
import { getClassNameForMain } from '../Text/textRenderUtils';
// Actions
import {
	toggleNotesModal,
	setActiveNote,
	deleteHighlights,
	setChapterTextLoadingState,
	addHighlight as addHighlightAction,
} from '../HomePage/actions';
import { addBookmark, setActiveChild } from '../Notes/actions';
// Reducers
import reducer from './reducer';
import homeReducer from '../HomePage/reducer';
// Selectors
import makeSelectVerses, {
	selectHighlights,
	selectActiveTextId,
	selectActiveBookId,
	selectActiveBookName,
	selectActiveChapter,
	selectVerseNumber,
	selectUserSettings,
	selectUserId,
	selectUserAuthenticated,
	selectNotesMenuState,
	selectTextDirection,
} from './selectors';
import { selectUserNotes, selectFormattedSource } from '../HomePage/selectors';
import FormattedText from '../../components/FormattedText';

export class Verses extends React.PureComponent {
	state = {
		contextMenuState: false,
		footnoteState: false,
		coords: {},
		selectedText: '',
		userSelectedText: '',
		firstVerse: 0,
		lastVerse: 0,
		activeVerseInfo: { verse: 0 },
		wholeVerseIsSelected: false,
		domMethodsAvailable: false,
		footnotes: {},
	};

	componentDidMount() {
		// May not need this anymore
		this.window = window;
		this.setState({ domMethodsAvailable: true });
	}

	componentWillReceiveProps(nextProps) {
		// If there is new formatted text or new plain text then the menus need to be disabled
		// Change the loading state to be set and controlled within the API call and promise
		if (
			// If there was a change in the text at all then the menus need to be closed
			nextProps.verseNumber !== this.props.verseNumber ||
			nextProps.activeChapter !== this.props.activeChapter ||
			nextProps.activeBookId !== this.props.activeBookId ||
			nextProps.activeTextId !== this.props.activeTextId ||
			nextProps.formattedSource.main !== this.props.formattedSource.main ||
			!isEqual(nextProps.textData.text, this.props.textData.text)
		) {
			this.props.dispatch(setChapterTextLoadingState({ state: false }));
		}
	}

	getFirstVerse = (e) => {
		const { userSettings, formattedSource } = this.props;
		e.stopPropagation();
		typeof e.persist === 'function' && e.persist(); // eslint-disable-line no-unused-expressions

		const firstVerse = getFirstSelectedVerse({
			target: e.target,
			button: e.button === 0,
			formattedSourceMain: formattedSource.main,
			main: this.mainRef,
			userSettings,
			getFormattedParentVerse,
			getPlainParentVerseWithoutNumber,
		});
		this.setState({
			firstVerse,
		});
	};

	getLastVerse = (e) => {
		const {
			formattedSource,
			userSettings,
			activeChapter,
			activeBookId,
		} = this.props;
		const { text } = this.props.textData;
		typeof e.persist === 'function' && e.persist(); // eslint-disable-line no-unused-expressions
		// Failsafe for the case that the dom hasn't loaded yet
		// may not need this anymore
		if (typeof this.window === 'undefined') return;

		const lastVerse = getLastSelectedVerse(e, {
			formattedSourceMain: formattedSource.main,
			userSettings,
			windowObject: this.window,
			main: this.mainRef,
			activeBookId,
			activeChapter,
			text,
			selectedWholeVerse: this.selectedWholeVerse,
			getFormattedParentVerse,
			getPlainParentVerseWithoutNumber,
		});
		if (lastVerse.openMenu) {
			this.setState(
				{
					lastVerse: lastVerse.stateObject.lastVerse,
					wholeVerseIsSelected: lastVerse.stateObject.wholeVerseIsSelected,
					anchorOffset: lastVerse.stateObject.anchorOffset,
					anchorText: lastVerse.stateObject.anchorText,
					anchorNode: lastVerse.stateObject.anchorNode,
					focusOffset: lastVerse.stateObject.focusOffset,
					focusText: lastVerse.stateObject.focusText,
					focusNode: lastVerse.stateObject.focusNode,
					userSelectedText: lastVerse.stateObject.userSelectedText,
					selectedText: lastVerse.stateObject.selectedText,
				},
				() => this.openContextMenu(e),
			);
		}
	};

	setActiveNotesViewMethod = (view) =>
		this.props.dispatch(setActiveChild(view));

	setActiveNote = ({ coords, existingNote, bookmark }) => {
		const {
			userAuthenticated,
			userId,
			activeBookId,
			activeChapter,
			activeTextId,
		} = this.props;
		const { firstVerse, lastVerse } = this.state;

		if (!userAuthenticated || !userId) {
			this.openPopup({ x: coords.x, y: coords.y });
			return;
		}

		const note = {
			verse_start: firstVerse || lastVerse,
			verse_end: lastVerse || firstVerse,
			book_id: activeBookId,
			chapter: activeChapter,
			bible_id: activeTextId,
			bookmark: bookmark ? 1 : 0,
		};

		this.props.dispatch(setActiveNote({ note: existingNote || note }));
	};

	setFormattedRef = (el) => {
		this.format = el;
	};

	setFormattedRefHighlight = (el) => {
		this.formatHighlight = el;
	};

	setMainRef = (el) => {
		this.mainRef = el;
	};

	setFootnotes = (footnotes) =>
		this.setState({ footnotes, footnoteState: false });

	// This is a no-op to trick iOS devices
	handleHighlightClick = () => {
		// Unless there is a click event the mouseup and mousedown events won't fire for mobile devices
		// Left this blank since I actually don't need to do anything with it
	};

	handleNoteClick = (noteIndex, clickedBookmark) => {
		const { notesActive } = this.props;
		const { userNotes } = this.props.textData;
		const existingNote = userNotes[noteIndex];

		if (!notesActive) {
			this.setActiveNote({ existingNote });
			if (clickedBookmark) {
				this.setActiveNotesViewMethod('bookmarks');
			} else {
				this.setActiveNotesViewMethod('edit');
			}
			this.closeContextMenu();
			this.toggleNotesModalMethod();
		} else {
			this.setActiveNote({ existingNote });
			if (clickedBookmark) {
				this.setActiveNotesViewMethod('bookmarks');
			} else {
				this.setActiveNotesViewMethod('edit');
			}
			this.closeContextMenu();
		}
	};

	handleAddBookmark = () => {
		const {
			activeBookId,
			userId,
			userAuthenticated,
			activeChapter,
			activeTextId,
			activeBookName,
		} = this.props;
		const { firstVerse, lastVerse } = this.state;
		// Need to make first verse and last verse integers for the < comparison
		const fv = parseInt(firstVerse, 10);
		const lv = parseInt(lastVerse, 10);
		// This takes into account RTL and LTR selections
		const verseStart = fv < lv ? fv : lv;
		const verseEnd = fv < lv ? lv : fv;

		// Only add the bookmark if there is a userId to add it too
		if (userAuthenticated && userId) {
			this.props.dispatch(
				addBookmark({
					book_id: activeBookId,
					chapter: activeChapter,
					user_id: userId,
					bible_id: activeTextId,
					reference: getReference(
						verseStart || verseEnd,
						verseEnd,
						activeBookName,
						activeChapter,
					),
					verse_start: verseStart || verseEnd,
					verse_end: verseEnd,
				}),
			);
		}
	};

	handleMouseUp = (e) => {
		e.stopPropagation();

		this.getLastVerse(e);
		if (
			e.button === 0 &&
			this.state.footnoteState &&
			e.target.className !== 'key'
		) {
			this.closeFootnote();
		}
	};

	handleScrollOnMain = () => {
		if (this.state.contextMenuState) {
			this.setState({ contextMenuState: false, activeVerseInfo: { verse: 0 } });
		}
	};

	toggleNotesModalMethod = () => this.props.dispatch(toggleNotesModal());

	deleteHighlights = (highlightObject, highlights) => {
		const space =
			highlightObject.highlightStart + highlightObject.highlightedWords;
		const highsToDelete = highlights
			.filter(
				(high) =>
					high.verse_start === parseInt(highlightObject.verseStart, 10) &&
					(high.highlight_start <= space &&
						high.highlight_start + high.highlighted_words >=
							highlightObject.highlightStart),
			)
			.reduce((a, h) => [...a, h.id], []);

		this.props.dispatch(deleteHighlights({ ids: highsToDelete }));
	};

	selectedWholeVerse = (verse, isPlain, clientX, clientY, userSelectedText) => {
		if (typeof this.window !== 'undefined') {
			const rightEdge =
				this.window.innerWidth < 500
					? this.window.innerWidth - 295
					: this.window.innerWidth - 250;
			const bottomEdge =
				this.window.innerHeight < 900
					? this.window.innerHeight - 317
					: this.window.innerHeight - 297;
			const x = rightEdge < clientX ? rightEdge : clientX;
			const y = bottomEdge < clientY ? bottomEdge : clientY;

			if (isPlain) {
				this.setState((currentState) => ({
					coords: { x, y },
					wholeVerseIsSelected: !(
						currentState.wholeVerseIsSelected &&
						currentState.activeVerseInfo.verse === verse
					),
					contextMenuState: currentState.activeVerseInfo.verse !== verse,
					lastVerse: currentState.firstVerse,
					activeVerseInfo: {
						verse: currentState.activeVerseInfo.verse !== verse ? verse : 0,
						isPlain,
					},
					userSelectedText,
				}));
			} else {
				// is formatted
				this.setState((currentState) => ({
					coords: { x, y },
					wholeVerseIsSelected: !(
						currentState.wholeVerseIsSelected &&
						currentState.activeVerseInfo.verse === verse
					),
					contextMenuState: currentState.activeVerseInfo.verse !== verse,
					lastVerse: currentState.firstVerse,
					activeVerseInfo: {
						verse: currentState.activeVerseInfo.verse !== verse ? verse : 0,
						isPlain,
					},
					userSelectedText,
				}));
			}
		}
	};

	openPopup = (coords) => {
		this.setState({ popupOpen: true, popupCoords: coords });
		setTimeout(() => this.setState({ popupOpen: false }), 2500);
	};

	openFootnote = ({ id, coords }) => {
		this.setState((cs) => ({
			footnoteState: true,
			contextMenuState: false,
			footnotePortal: {
				message: cs.footnotes[id],
				closeFootnote: this.closeFootnote,
				coords,
			},
		}));
	};

	openContextMenu = (e) => {
		if (typeof this.window !== 'undefined') {
			const rightEdge = this.window.innerWidth - 250;
			const bottomEdge = this.window.innerHeight - 297;
			const x = rightEdge < e.clientX ? rightEdge : e.clientX;
			const y = bottomEdge < e.clientY ? bottomEdge : e.clientY;
			// Using setTimeout 0 so that the check for the selection happens in the next frame and not this one
			// That allows the function that updates the selection to run before this one does
			if (this.timer) {
				clearTimeout(this.timer);
			}
			setTimeout(() => {
				if (
					typeof this.window !== 'undefined' &&
					!this.window.getSelection().toString()
				) {
					this.closeContextMenu();
				} else {
					this.setState({
						coords: { x, y },
						contextMenuState: true,
					});
				}
			}, 0);
		}
	};

	closeContextMenu = () => {
		this.setState({
			contextMenuState: false,
			activeVerseInfo: { verse: 0, isPlain: false },
		});
	};

	closeFootnote = () =>
		this.setState({
			activeVerseInfo: { verse: 0, isPlain: false },
			footnoteState: false,
		});

	dispatchAddHighlight = (props) =>
		this.props.dispatch(addHighlightAction(props));

	// Should refactor to be addPlainTextHighlight and addFormattedHighlight
	// They have some similarities but also some significant differences
	addHighlightMethod = ({ color, popupCoords }) => {
		addHighlightUtil({
			color,
			popupCoords,
			// Props
			userAuthenticated: this.props.userAuthenticated,
			userId: this.props.userId,
			text: this.props.textData.text,
			highlights: this.props.highlights,
			formattedSource: this.props.formattedSource,
			userSettings: this.props.userSettings,
			activeTextId: this.props.activeTextId,
			activeBookId: this.props.activeBookId,
			activeBookName: this.props.activeBookName,
			activeChapter: this.props.activeChapter,
			// State
			wholeVerseIsSelected: this.state.wholeVerseIsSelected,
			activeVerseInfo: this.state.activeVerseInfo,
			firstVerseState: this.state.firstVerse,
			lastVerseState: this.state.lastVerse,
			anchorOffsetState: this.state.anchorOffset,
			focusOffsetState: this.state.focusOffset,
			focusTextState: this.state.focusText,
			anchorTextState: this.state.anchorText,
			anchorNodeState: this.state.anchorNode,
			focusNodeState: this.state.focusNode,
			selectedTextState: this.state.selectedText,
			// Methods
			main: this.mainRef,
			format: this.format,
			openPopup: this.openPopup,
			setParentState: this.setState,
			formatHighlight: this.formatHighlight,
			deleteHighlights: this.deleteHighlights,
			closeContextMenu: this.closeContextMenu,
			addHighlight: this.dispatchAddHighlight,
			// External Functions
			getReference,
			calcDistance,
			getClosestParent,
			replaceCharsRegex,
			getPlainParentVerse,
			getFormattedChildIndex,
			getFormattedParentVerse,
			getOffsetNeededForPsalms,
			getFormattedElementVerseId,
			getFormattedParentVerseNumber,
			getPlainParentVerseWithoutNumber,
		});
	};

	addFacebookLike = () => {
		if (typeof this.window !== 'undefined') {
			const fb = this.window.FB;
			fb.api(
				`${process.env.FB_APP_ID}?metadata=1`,
				{
					access_token: process.env.FB_ACCESS,
				},
				(res) => res,
			);
		}
		this.closeContextMenu();
	};

	shareHighlightToFacebook = () => {
		const { activeBookName: book, activeChapter: chapter } = this.props;
		const { firstVerse: v1, lastVerse: v2, selectedText: sl } = this.state;
		const verseRange =
			v1 === v2
				? `${book} ${chapter}:${v1}\n${sl}`
				: `${book} ${chapter}:${v1}-${v2}\n"${sl}"`;

		shareHighlightToFacebook(verseRange, this.closeContextMenu);
	};

	domMethodsAvailable = () => this.setState({ domMethodsAvailable: true });

	render() {
		const {
			activeChapter,
			formattedSource,
			userSettings,
			notesActive,
			textDirection,
			verseNumber,
			menuIsOpen,
			highlights,
			activeBookId,
			activeBookName,
			activeTextId,
			userAuthenticated,
		} = this.props;
		const { userNotes, bookmarks, text } = this.props.textData;
		// Needs to be state eventually
		const {
			activeVerseInfo,
			popupCoords,
			popupOpen,
			contextMenuState,
			coords,
			footnotePortal,
			footnoteState,
			userSelectedText,
			domMethodsAvailable,
		} = this.state;
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
			<main
				ref={this.setMainRef}
				className={getClassNameForMain(textDirection, menuIsOpen)}
				onScroll={this.handleScrollOnMain}
			>
				{!formattedSource.main &&
					!text.length && (
						<AudioOnlyMessage
							key={'no_text'}
							book={activeBookName}
							chapter={activeChapter}
						/>
					)}
				{(formattedSource.main && !readersMode && !oneVersePerLine) ||
				text.length === 0 ||
				(!readersMode && !oneVersePerLine) ? null : (
					<div className="active-chapter-title">
						<h1 className="active-chapter-title">
							{chapterAlt || activeChapter}
						</h1>
					</div>
				)}
				{formattedSource.main &&
					domMethodsAvailable &&
					!readersMode &&
					!oneVersePerLine && (
						<FormattedText
							userNotes={userNotes}
							bookmarks={bookmarks}
							highlights={highlights}
							verseNumber={verseNumber}
							userSettings={userSettings}
							activeBookId={activeBookId}
							activeChapter={activeChapter}
							formattedSource={formattedSource}
							activeVerseInfo={activeVerseInfo}
							userAuthenticated={userAuthenticated}
							domMethodsAvailable={domMethodsAvailable}
							mainRef={this.mainRef}
							formatRef={this.format}
							openFootnote={this.openFootnote}
							setFootnotes={this.setFootnotes}
							handleMouseUp={this.handleMouseUp}
							getFirstVerse={this.getFirstVerse}
							handleNoteClick={this.handleNoteClick}
							setFormattedRef={this.setFormattedRef}
							formatHighlightRef={this.formatHighlight}
							handleHighlightClick={this.handleHighlightClick}
							setFormattedRefHighlight={this.setFormattedRefHighlight}
						/>
					)}
				{(!formattedSource.main ||
					readersMode ||
					oneVersePerLine ||
					!domMethodsAvailable) &&
					!!text.length && (
						<PlainText
							initialText={text}
							highlights={highlights}
							verseNumber={verseNumber}
							userSettings={userSettings}
							activeChapter={activeChapter}
							activeVerseInfo={activeVerseInfo}
							handleMouseUp={this.handleMouseUp}
							getFirstVerse={this.getFirstVerse}
							userAuthenticated={userAuthenticated}
							handleNoteClick={this.handleNoteClick}
							handleHighlightClick={this.handleHighlightClick}
						/>
					)}
				{contextMenuState && (
					<ContextPortal
						handleAddBookmark={this.handleAddBookmark}
						addHighlight={this.addHighlightMethod}
						addFacebookLike={this.addFacebookLike}
						shareHighlightToFacebook={this.shareHighlightToFacebook}
						setActiveNote={this.setActiveNote}
						setActiveNotesView={this.setActiveNotesViewMethod}
						closeContextMenu={this.closeContextMenu}
						toggleNotesModal={this.toggleNotesModalMethod}
						notesActive={notesActive}
						coordinates={coords}
						selectedText={userSelectedText}
					/>
				)}
				{footnoteState && <FootnotePortal {...footnotePortal} />}
				{popupOpen && (
					<PopupMessage
						message={<PleaseSignInMessage message={'toUseFeature'} />}
						x={popupCoords.x}
						y={popupCoords.y}
					/>
				)}
				{verseNumber && (
					<ReadFullChapter
						activeTextId={activeTextId}
						activeBookId={activeBookId}
						activeChapter={activeChapter}
					/>
				)}
				<Information />
			</main>
		);
	}
}

Verses.propTypes = {
	dispatch: PropTypes.func.isRequired,
	// Homepage
	textData: PropTypes.object,
	highlights: PropTypes.array,
	formattedSource: PropTypes.object,
	activeChapter: PropTypes.number,
	activeTextId: PropTypes.string,
	activeBookId: PropTypes.string,
	activeBookName: PropTypes.string,
	verseNumber: PropTypes.string,
	notesActive: PropTypes.bool,
	textDirection: PropTypes.string,
	// Settings
	userSettings: PropTypes.object,
	// Profile
	userAuthenticated: PropTypes.bool,
	userId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	// Parent Props
	menuIsOpen: PropTypes.bool,
};

const mapStateToProps = createStructuredSelector({
	verses: makeSelectVerses(),
	textData: selectUserNotes(),
	highlights: selectHighlights(),
	activeTextId: selectActiveTextId(),
	activeBookId: selectActiveBookId(),
	activeBookName: selectActiveBookName(),
	activeChapter: selectActiveChapter(),
	verseNumber: selectVerseNumber(),
	notesActive: selectNotesMenuState(),
	textDirection: selectTextDirection(),
	formattedSource: selectFormattedSource(),
	userSettings: selectUserSettings(),
	userAuthenticated: selectUserAuthenticated(),
	userId: selectUserId(),
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
